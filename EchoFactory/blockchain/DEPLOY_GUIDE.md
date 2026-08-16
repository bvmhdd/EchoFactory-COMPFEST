# 🚀 Panduan Setup & Deploy Blockchain EchoFactory (Polygon Amoy Testnet)

Dokumen ini adalah panduan praktis langkah-demi-langkah bagi Anda (ML Engineer) untuk mendeploy Smart Contract dan menghubungkannya dengan pipeline ML / Backend EchoFactory.

---

## ⏱️ Estimasi Waktu Setup: 5 - 10 Menit (100% Gratis)

---

## 📌 Langkah 1: Siapkan Wallet MetaMask (Testnet)
1. Buka ekstensi **MetaMask** di browser Chrome/Brave/Edge.
2. Tambahkan jaringan **Polygon Amoy Testnet** (jika belum ada):
   * **Network Name**: `Polygon Amoy Testnet`
   * **New RPC URL**: `https://rpc-amoy.polygon.technology`
   * **Chain ID**: `80002`
   * **Currency Symbol**: `MATIC`
   * **Block Explorer URL**: `https://amoy.polygonscan.com/`
3. Ambil **Private Key** akun MetaMask Anda:
   * Klik ikon titik tiga di kanan atas MetaMask $\to$ *Account details* $\to$ *Show private key*.
   * Salin string private key tersebut (format: `0x...` atau 64 karakter hex).

> [!CAUTION]
> **PENTING**: Gunakan akun wallet khusus testing/lomba, jangan gunakan wallet pribadi yang memiliki aset kripto asli!

---

## 💰 Langkah 2: Ambil Saldo MATIC Gratis (Faucet)
Untuk membayar biaya gas transaksi saat deploy dan commit data:
1. Kunjungi salah satu faucet resmi gratis berikut:
   * **[Polygon Official Faucet](https://faucet.polygon.technology/)** (Pilih Network: *Amoy*, Token: *MATIC*)
   * **[Alchemy Amoy Faucet](https://www.alchemy.com/faucets/polygon-amoy)**
2. Masukkan alamat wallet (*Public Address*) MetaMask Anda $\to$ Klik **Submit / Claim**.
3. Dalam ~10 detik, Anda akan menerima 0.5 - 1 MATIC gratis di wallet MetaMask Anda.

---

## 📜 Langkah 3: Deploy Smart Contract via Remix IDE (Hanya 2 Menit)
1. Buka browser dan pergi ke **[Remix Ethereum IDE](https://remix.ethereum.org/)**.
2. Pada panel kiri (*File Explorer*), buat file baru bernama: `MachineHealthPassport.sol`.
3. Buka file `EchoFactory/blockchain/contracts/MachineHealthPassport.sol` di komputer Anda, salin seluruh kodenya, lalu **paste** ke Remix IDE.
4. Klik tab **Solidity Compiler** (ikon ke-3 di kiri):
   * Pilih Compiler Version: `0.8.20` atau yang lebih baru.
   * Klik tombol **Compile MachineHealthPassport.sol** (muncul centang hijau ✅).
5. Klik tab **Deploy & Run Transactions** (ikon ke-4 di kiri):
   * Pada kolom **Environment**, pilih **Injected Provider - MetaMask**.
   * MetaMask akan muncul meminta izin koneksi $\to$ Klik **Connect** (pastikan jaringan di MetaMask adalah *Polygon Amoy Testnet*).
   * Klik tombol oranye **Deploy**.
   * Konfirmasi transaksi di MetaMask.
6. **Selesai!** Pada bagian *Deployed Contracts* di bawah, salin alamat smart contract Anda (misal: `0x9a8B3...`).

---

## ⚙️ Langkah 4: Hubungkan ke Kode Python Anda
1. Buka file [EchoFactory/blockchain/.env](file:///c:/Users/muhib/Downloads/COMPFEST/EchoFactory/blockchain/.env) di editor Anda.
2. Isi nilai yang didapat:
   ```env
   POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
   CHAIN_ID=80002
   
   WALLET_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
   CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE
   ```

---

## 🧪 Langkah 5: Jalankan Uji Coba Transmisi Data
Buka Terminal / PowerShell di folder proyek dan jalankan:

```powershell
# 1. Install library web3
pip install -r EchoFactory/blockchain/requirements.txt

# 2. Jalankan test script
python EchoFactory/blockchain/scripts/test_blockchain.py
```

Jika berhasil, Anda akan melihat output transaksi sukses dan link langsung ke **Polygonscan** seperti:
`https://amoy.polygonscan.com/tx/0xabc123...`

---

## 🔗 Cara Memanggil Modul Ini dari Pipeline ML / FastAPI
Di file Python ML / backend Anda, Anda cukup memanggil 1 baris fungsi:

```python
from EchoFactory.blockchain.blockchain_service import blockchain_service

# Setelah model ML selesai menghitung anomali suara mesin:
result = blockchain_service.commit_inspection_record(
    machine_id="FAN_ID_00",
    anomaly_score=0.045,
    status="NORMAL",
    defect_type="None (Healthy)"
)

print(result["polygonscan_url"]) # Tampilkan URL bukti audit ini ke user/juri!
```
