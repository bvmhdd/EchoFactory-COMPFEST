"""
EchoFactory - Test Script Blockchain Integration
Script untuk menguji koneksi Web3, commit data ML, dan fetch audit trail.
"""

import os
import sys
import time

# Pastikan UTF-8 encoding untuk Windows terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Tambahkan direktori root blockchain ke sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from blockchain_service import BlockchainService


def run_blockchain_test():
    print("=" * 65)
    print("[ECHOFACTORY] - BLOCKCHAIN INTEGRATION TEST")
    print("=" * 65)

    svc = BlockchainService()

    # 1. Cek Koneksi ke Node Polygon Amoy
    print("\n[STEP 1] Memeriksa koneksi ke Polygon Amoy Testnet...")
    connected = svc.is_connected()
    if connected:
        print("[OK] Terhubung ke Node RPC Polygon Amoy!")
    else:
        print("[ERROR] Gagal terhubung ke RPC. Periksa koneksi internet Anda.")
        return

    # 2. Cek Status Wallet & Saldo
    print("\n[STEP 2] Memeriksa Status Wallet...")
    wallet_info = svc.get_wallet_info()
    if wallet_info.get("status") == "success":
        print(f"[OK] Wallet Address : {wallet_info['address']}")
        print(f"[OK] Saldo MATIC    : {wallet_info['balance_matic']:.4f} MATIC")
        if wallet_info['balance_matic'] == 0:
            print("[WARN] Saldo masih 0 MATIC. Dapatkan saldo gratis di https://faucet.polygon.technology")
    else:
        print(f"[INFO] {wallet_info.get('message')}")
        print("[INFO] Catatan: Sistem berjalan dalam Mode Simulasi Hashing lokal.")

    # 3. Simulasi Input dari Model ML (Misal Anomali Fan)
    print("\n[STEP 3] Menyiapkan Log Hasil Inferensi AI/ML...")
    machine_id = "FAN_ID_00_BEARING"
    anomaly_score = 0.045 # Skor normal
    status = "NORMAL"
    defect = "None (Healthy Operation)"
    
    sample_payload = {
        "machine_id": machine_id,
        "anomaly_score": anomaly_score,
        "status": status,
        "rpm": 1450,
        "temperature_celsius": 42.5,
        "timestamp": int(time.time()),
        "model_version": "STgram-MFN-v3-ONNX"
    }
    
    print(f"  * Mesin ID      : {machine_id}")
    print(f"  * Skor Anomali  : {anomaly_score}")
    print(f"  * Status Fisik  : {status}")

    # 4. Commit ke Blockchain
    print("\n[STEP 4] Mengirim Log Data ke Smart Contract / Hashing...")
    result = svc.commit_inspection_record(
        machine_id=machine_id,
        anomaly_score=anomaly_score,
        status=status,
        defect_type=defect,
        raw_metadata=sample_payload
    )

    print("\n" + "-" * 50)
    print("HASIL TRANSMISI BLOCKCHAIN:")
    print("-" * 50)
    for k, v in result.items():
        print(f"  {k:<18}: {v}")
    print("-" * 50)

    # 5. Fetch Riwayat On-Chain
    if svc.contract:
        print(f"\n[STEP 5] Membaca Riwayat Paspor Kesehatan Mesin ({machine_id}) On-Chain...")
        history = svc.get_machine_history(machine_id)
        print(f"[OK] Ditemukan {len(history)} catatan inspeksi di Blockchain.")
        for idx, rec in enumerate(history, 1):
            print(f"  [{idx}] Skor: {rec['anomaly_score']} | Status: {rec['status']} | Hash: {rec['data_hash'][:16]}...")
    else:
        print("\n[INFO] Smart Contract Address belum diisi di .env. Setelah dideploy, riwayat on-chain bisa dibaca di sini.")

    print("\n" + "=" * 65)
    print("[SUCCESS] Pengujian selesai! Arsitektur Blockchain EchoFactory Siap.")
    print("=" * 65)


if __name__ == "__main__":
    run_blockchain_test()

