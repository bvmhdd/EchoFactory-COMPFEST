# 05. BLOCKCHAIN, PASPOR ON-CHAIN & SMART CONTRACT

## 1. Infrastruktur Web3 & Jaringan Terdesentralisasi

Untuk menjamin integritas data inspeksi yang tidak dapat dimanipulasi (*tamper-proof*), EchoFactory mengimplementasikan paspor kesehatan mesin digital di atas jaringan **Polygon Amoy Testnet**:

- **Jaringan**: Polygon Amoy Testnet (Ethereum Layer 2 Testnet)
- **Chain ID**: `80002`
- **Mekanisme Konsensus**: Proof of Stake (PoS) — hemat energi, ramah lingkungan untuk standar industri hijau (*Green Manufacturing*).
- **Rata-rata Waktu Blok**: $\approx 2.1\text{ detik}$
- **Estimasi Biaya Transaksi (*Gas Fee*)**: $< \$0.001$ per komitmen inspeksi.

---

## 2. Alamat & Spesifikasi Smart Contract

- **Nama Kontrak**: `MachineHealthPassport.sol`
- **Alamat Smart Contract (Deployed)**: `0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864`
- **Explorer URL**: `https://amoy.polygonscan.com/address/0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864`

### A. Struktur Data On-Chain (*Struct Data Definition*)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct InspectionRecord {
    uint256 timestamp;          // Waktu blok UNIX inspeksi
    string machineId;           // Identifier unit mesin (misal: "FAN_ID_00")
    uint256 anomalyScoreScaled; // Skor anomali terukur (skala 1e6 untuk presisi)
    string status;              // "PASS" atau "ALERT"
    string defectType;          // Diagnosis jenis kerusakan
    bytes32 dataHash;           // Hash kriptografis Keccak-256 bukti scan
    address inspector;          // Alamat wallet publik teknisi/node edge
}

struct WarrantyClaim {
    uint256 claimId;
    string machineId;
    string reason;
    uint256 timestamp;
    bool isApproved;
    uint256 complianceLogCount;
    string resolutionNote;
}
```

### B. Formulasi Proof-of-Inspection Hashing (Kriptografi)
Setiap sesi pemindaian menghasilkan bukti digital deterministik:
$$\text{DataHash} = \text{keccak256}\Big(\text{abi.encodePacked}(\text{machineId}, \text{timestamp}, \text{anomalyScore}, \text{modelArchitecture}, \text{inspectorAddress})\Big)$$

Bukti hash ini menjamin bahwa:
1. Hasil diagnosa AI tidak dapat diedit pasca-inspeksi.
2. Identitas node pemeriksa dan waktu pemindaian tercatat permanen.
3. Riwayat mesin seumur hidup dapat diaudit kapan saja oleh auditor independen.

---

## 3. Alur Klaim Garansi & Asuransi Parametrik Otomatis

```
                  ┌─────────────────────────────────────┐
                  │    PABRIK MENGAJUKAN KLAIM GARANSI  │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   SMART CONTRACT QUERY HISTORY      │
                  │ (Validasi Log Pemeliharaan Rutin)   │
                  └──────────────────┬──────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
         [ Log Kepatuhan >= 5 ]                [ Log Kepatuhan < 5 ]
                  │                                     │
                  ▼                                     ▼
       ┌──────────────────────┐              ┌──────────────────────┐
       │   KLAIM DISETUJUI    │              │   KLAIM PENDING /    │
       │     (AUTOMATED)      │              │   BUTUH INVESTIGASI  │
       │ Payout Asuransi Rilis│              │ Pelanggaran Prosedur │
       └──────────────────────┘              └──────────────────────┘
```

### Keunggulan Dibandingkan Sistem Konvensional:
1. **Zero Dispute**: Perusahaan asuransi atau OEM dapat langsung memverifikasi apakah pabrik rutin melakukan inspeksi preventif atau lalai membiarkan anomali berlarut-larut.
2. **Klaim Instan (Parametric)**: Pembayaran santunan atau pengiriman suku cadang garansi dapat dipicu secara otomatis tanpa birokrasi berbulan-bulan.
3. **Nilai Jual Kembali Mesin Bekas (*Residual Value*)**: Mesin industri yang memiliki rekam jejak *Blockchain Passport* lengkap memiliki harga jual kembali yang jauh lebih tinggi dan terpercaya.
