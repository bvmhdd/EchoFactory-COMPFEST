"""
EchoFactory - Blockchain Service Module
Menghubungkan Output Inferensi ML & Diagnostic Agent ke Polygon Amoy Smart Contract.
"""

import os
import json
import hashlib
from typing import Dict, Any, List, Optional
from web3 import Web3
from web3.exceptions import ContractLogicError
from dotenv import load_dotenv

# Muat environment variables dari .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Konfigurasi Default Polygon Amoy Testnet (Chain ID 80002)
# Daftar RPC Publik Polygon Amoy Testnet (Multi-Fallback)
DEFAULT_RPCS = [
    "https://polygon-amoy-bor-rpc.publicnode.com",
    "https://polygon-amoy.drpc.org",
    "https://rpc-amoy.polygon.technology",
    "https://rpc.ankr.com/polygon_amoy"
]

POLYGON_AMOY_RPC = os.getenv("POLYGON_RPC_URL", DEFAULT_RPCS[0])
PRIVATE_KEY = os.getenv("WALLET_PRIVATE_KEY", "")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")
CHAIN_ID = int(os.getenv("CHAIN_ID", "80002"))

# Load ABI
ABI_PATH = os.path.join(BASE_DIR, "contracts", "MachineHealthPassport_ABI.json")
try:
    with open(ABI_PATH, "r", encoding="utf-8") as f:
        CONTRACT_ABI = json.load(f)
except Exception as e:
    CONTRACT_ABI = []
    print(f"[WARN] Gagal memuat ABI file: {e}")


class BlockchainService:
    def __init__(
        self,
        rpc_url: Optional[str] = None,
        private_key: Optional[str] = None,
        contract_address: Optional[str] = None
    ):
        self.rpc_url = rpc_url or POLYGON_AMOY_RPC
        self.private_key = private_key or PRIVATE_KEY
        self.contract_address = contract_address or CONTRACT_ADDRESS
        
        # Inisialisasi Web3 Provider dengan timeout
        self.w3 = self._init_web3(self.rpc_url)
        self.account = None
        self.contract = None

        if self.private_key and self.private_key.startswith("0x") and len(self.private_key) == 66:
            try:
                self.account = self.w3.eth.account.from_key(self.private_key)
            except Exception as ex:
                print(f"[WARN] Inisialisasi wallet gagal: {ex}")

        if self.contract_address and self.w3.is_address(self.contract_address) and CONTRACT_ABI:
            try:
                checksum_addr = self.w3.to_checksum_address(self.contract_address)
                self.contract = self.w3.eth.contract(address=checksum_addr, abi=CONTRACT_ABI)
            except Exception as ex:
                print(f"[WARN] Inisialisasi Smart Contract gagal: {ex}")

    def _init_web3(self, primary_url: str) -> Web3:
        """Coba hubungkan ke RPC, jika gagal coba daftar fallback RPC."""
        candidate_rpcs = [primary_url] + [r for r in DEFAULT_RPCS if r != primary_url]
        for rpc in candidate_rpcs:
            try:
                provider = Web3.HTTPProvider(rpc, request_kwargs={"timeout": 5})
                w3_inst = Web3(provider)
                if w3_inst.is_connected():
                    self.rpc_url = rpc
                    return w3_inst
            except Exception:
                continue
        # Default fallback
        return Web3(Web3.HTTPProvider(primary_url, request_kwargs={"timeout": 5}))

    def is_connected(self) -> bool:
        """Cek apakah node blockchain terhubung."""
        try:
            return self.w3.is_connected()
        except Exception:
            return False

    def get_wallet_info(self) -> Dict[str, Any]:
        """Cek informasi address & saldo MATIC wallet."""
        if not self.account:
            return {"status": "error", "message": "Private key belum dikonfigurasi di .env"}
        
        try:
            balance_wei = self.w3.eth.get_balance(self.account.address)
            balance_matic = self.w3.from_wei(balance_wei, "ether")
            return {
                "status": "success",
                "address": self.account.address,
                "balance_matic": float(balance_matic),
                "is_connected": self.is_connected(),
                "network": f"Polygon Amoy (Chain ID {CHAIN_ID})"
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def calculate_data_hash(raw_data: Dict[str, Any]) -> bytes:
        """Menghitung SHA-256 hash kriptografi dari dictionary payload."""
        serialized = json.dumps(raw_data, sort_keys=True)
        return hashlib.sha256(serialized.encode("utf-8")).digest()

    def commit_inspection_record(
        self,
        machine_id: str,
        anomaly_score: float,
        status: str,
        defect_type: str = "Healthy",
        ipfs_metadata: str = "ipfs://QmDefaultMetadataCID",
        raw_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Mencatat hasil deteksi anomali ML ke Smart Contract Polygon.
        """
        if not self.contract or not self.account:
            # Fallback Simulation Mode jika Contract belum dideploy
            data_hash = self.calculate_data_hash(raw_metadata or {"score": anomaly_score, "machine": machine_id})
            mock_tx = "0x" + hashlib.sha256((machine_id + str(anomaly_score)).encode()).hexdigest()
            return {
                "status": "simulated",
                "message": "Mode Simulasi (Contract/Wallet belum aktif di .env). Data berhasil di-hash.",
                "machine_id": machine_id,
                "anomaly_score": anomaly_score,
                "health_status": status,
                "data_hash": "0x" + data_hash.hex(),
                "simulated_tx_hash": mock_tx,
                "polygonscan_url": f"https://amoy.polygonscan.com/tx/{mock_tx}"
            }

        # 1. Hitung Hash Data
        if raw_metadata is None:
            raw_metadata = {
                "machine_id": machine_id,
                "anomaly_score": anomaly_score,
                "status": status,
                "defect_type": defect_type
            }
        data_hash_bytes = self.calculate_data_hash(raw_metadata)

        # 2. Format Skor Anomali ke Integer (Skala 1:1000, contoh 0.045 -> 45)
        score_scaled = int(round(anomaly_score * 1000))

        # 3. Kirim Transaksi On-Chain
        try:
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            gas_price = self.w3.eth.gas_price

            tx = self.contract.functions.recordInspection(
                machine_id,
                score_scaled,
                status,
                defect_type,
                ipfs_metadata,
                data_hash_bytes
            ).build_transaction({
                "from": self.account.address,
                "nonce": nonce,
                "gas": 250000,
                "maxFeePerGas": int(gas_price * 1.35),
                "maxPriorityFeePerGas": self.w3.to_wei("30", "gwei"),
                "chainId": CHAIN_ID
            })

            # Tanda tangani transaksi dengan private key
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            tx_hex = self.w3.to_hex(tx_hash)

            return {
                "status": "success",
                "machine_id": machine_id,
                "anomaly_score": anomaly_score,
                "health_status": status,
                "defect_type": defect_type,
                "tx_hash": tx_hex,
                "data_hash": "0x" + data_hash_bytes.hex(),
                "polygonscan_url": f"https://amoy.polygonscan.com/tx/{tx_hex}",
                "explorer_note": "Klik link Polygonscan untuk melihat bukti validasi on-chain di hadapan juri."
            }
        except Exception as err:
            return {
                "status": "failed",
                "error": str(err),
                "message": "Gagal mengirim transaksi ke Polygon Amoy."
            }

    def get_machine_history(self, machine_id: str) -> List[Dict[str, Any]]:
        """Mengambil seluruh riwayat inspeksi dari Smart Contract."""
        if not self.contract:
            return []

        try:
            raw_records = self.contract.functions.getMachineHistory(machine_id).call()
            history = []
            for r in raw_records:
                history.append({
                    "timestamp": r[0],
                    "anomaly_score": r[1] / 1000.0,
                    "status": r[2],
                    "defect_type": r[3],
                    "ipfs_metadata": r[4],
                    "data_hash": "0x" + r[5].hex(),
                    "inspector": r[6]
                })
            return history
        except Exception as e:
            print(f"[ERROR] Gagal membaca riwayat mesin {machine_id}: {e}")
            return []

    def get_latest_record(self, machine_id: str) -> Optional[Dict[str, Any]]:
        """Mengambil status paling mutakhir mesin tertentu."""
        if not self.contract:
            return None

        try:
            r = self.contract.functions.getLatestRecord(machine_id).call()
            return {
                "timestamp": r[0],
                "anomaly_score": r[1] / 1000.0,
                "status": r[2],
                "defect_type": r[3],
                "ipfs_metadata": r[4],
                "data_hash": "0x" + r[5].hex(),
                "inspector": r[6]
            }
        except Exception as e:
            print(f"[ERROR] Gagal membaca record terakhir {machine_id}: {e}")
            return None


# Singleton instance yang siap di-import oleh backend / ML pipeline
blockchain_service = BlockchainService()
