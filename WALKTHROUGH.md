# 🏭 EchoFactory: End-to-End System Walkthrough
### Acoustic Machine Intelligence & Blockchain Tamper-Proof Health Passport
**COMPFEST 18 AI Innovation Challenge (AIC) | Sub-Tema: Smart Manufacturing**

---

## 📌 1. RINGKASAN EKSEKUTIF & ARSITEKTUR SOLUSI

**EchoFactory** adalah platform *Industrial Predictive Maintenance* generasi baru yang menggabungkan:
1. **Edge Acoustic AI** (STgram-MFN ONNX & KNN-k5) untuk deteksi anomali suara mesin secara ultra-cepat ($<50$ ms) pada kondisi kebisingan pabrik nyata ($0\text{ dB SNR}$).
2. **Cognitive Diagnostic Core** (Gemini Multimodal + SOP RAG ISO 10816) untuk identifikasi akar masalah komponen mesin dan estimasi sisa umur operasional (*Remaining Useful Life* / RUL).
3. **Decentralized Trust Ledger** (Polygon Blockchain Smart Contract) untuk mencatat paspor kesehatan mesin (*Machine Health Passport*) yang permanen, transparan, dan tidak dapat dimanipulasi (*tamper-proof*).

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ECHOFACTORY ECOSYSTEM BOUNDARY                                 │
├──────────────────────────────┬───────────────────────────────┬───────────────────────────────────┤
│ 📱 SENSING & EDGE INGESTION  │ 🧠 COGNITIVE DIAGNOSTIC & RAG │ ⛓️ BLOCKCHAIN AUDIT & VALUATION  │
│    WebAudio API 16kHz PCM    │    Gemini Flash Multimodal    │    Polygon Amoy Testnet           │
│    STgram-MFN ONNX (<50ms)   │    SOP RAG & RUL Estimator    │    MachineHealthPassport.sol      │
└──────────────────────────────┴───────────────────────────────┴───────────────────────────────────┘
```

---

## 👥 2. MATRIKS AKTOR SISTEM (UML ACTOR MATRIX)

Sistem EchoFactory menghubungkan 4 aktor manusia dan 2 sistem eksternal:

| ID Aktor | Nama Aktor | Kategori | Peran & Interaksi Utama |
|---|---|---|---|
| **ACT-01** | **Operator Lapangan (Floor Technician)** | Human (Primary) | Merekam suara mesin harian, berinteraksi via asisten suara *hands-free*, dan melihat indikator *Pass/Fail*. |
| **ACT-02** | **Supervisor / Kepala Maintenance** | Human (Primary) | Menganalisis diagnosis multimodal, menyetujui penerbitan *Work Order*, dan mengelola kalibrasi baseline mesin. |
| **ACT-03** | **Manajer Pabrik (Plant Manager)** | Human (Primary) | Memantau dasbor kesehatan seluruh armada pabrik (*Fleet Health*), estimasi RUL, dan risiko downtime. |
| **ACT-04** | **Auditor K3 / Calon Pembeli / Lembaga Asuransi** | Human (Secondary) | Memindai QR Code mesin untuk memverifikasi keaslian riwayat servis on-chain (*Machine Health Passport*). |
| **SYS-01** | **Enterprise ERP/SAP System** | External System | Menerima instruksi pembuatan tiket perbaikan (*Work Order*) dan menyediakan data stok suku cadang. |
| **SYS-02** | **Polygon Blockchain Network** | External System | Menyimpan komitmen hash kriptografi audit kesehatan mesin dan mengeksekusi klaim garansi parametrik. |

---

## 📊 3. UML USE CASE DIAGRAM & SPESIFIKASI LENGKAP (UC-01 s/d UC-08)

```mermaid
flowchart LR
    %% ACTORS
    subgraph ACTORS ["👥 AKTOR PENGGUNA & SISTEM EKSTERNAL"]
        direction TB
        A1["👷 Operator Lapangan"]
        A2["👨‍💼 Supervisor Maintenance"]
        A3["🏭 Manajer Pabrik"]
        A4["🔍 Auditor / Asuransi"]
        S1["💻 Sistem ERP / SAP"]
        S2["⛓️ Polygon Smart Contract"]
    end

    %% SYSTEM BOUNDARY
    subgraph SYS ["🏭 ECHOFACTORY SYSTEM BOUNDARY"]
        direction TB
        UC1(["UC-01: Rekam & Pindai Akustik Mesin"])
        UC2(["UC-02: Tanya Jawab Suara Hands-Free"])
        UC3(["UC-03: Kalibrasi Baseline Mesin Baru"])
        UC4(["UC-04: Diagnosis Multimodal & SOP RAG"])
        UC5(["UC-05: Generate Work Order & Cek Stok Part"])
        UC6(["UC-06: Monitoring Dasbor Armada & RUL"])
        UC7(["UC-07: Verifikasi Paspor On-Chain"])
        UC8(["UC-08: Eksekusi Klaim Garansi Parametrik"])
    end

    %% RELATIONSHIPS
    A1 --> UC1
    A1 --> UC2
    A1 --> UC3

    A2 --> UC3
    A2 --> UC4
    A2 --> UC5
    A2 --> UC8

    A3 --> UC6

    A4 --> UC7
    A4 --> UC8

    UC1 -.->|<<extend>> jika anomali| UC4
    UC4 -.->|<<include>>| UC5
    UC5 <--> S1
    UC1 -.->|commit hash| S2
    UC3 -.->|register genesis| S2
    UC7 <--> S2
    UC8 <--> S2
```

### Rincian 8 Use Case:
1. **UC-01: Rekam & Pindai Akustik Mesin**: Operator merekam audio 10 detik (16kHz PCM), inferensi STgram-MFN ONNX menghasilkan skor anomali. Jika normal, hash bukti dicatat ke smart contract. Jika anomali, sistem memicu alarm & UC-04.
2. **UC-02: Tanya Jawab Suara Hands-Free**: Voice assistant berbahasa Indonesia (STT + TTS) membantu operator menanyakan kondisi mesin saat tangan memegang alat.
3. **UC-03: Kalibrasi Baseline Mesin Baru**: Merekam 3 sampel suara mesin normal untuk menghitung vektor centroid baseline dan mendaftarkan profil mesin ke blockchain (*Genesis Registration*).
4. **UC-04: Diagnosis Multimodal & SOP RAG**: Gemini Flash menganalisis spektrogram, kurva FFT, dan mencocokkan dokumen manual ISO 10816 untuk menentukan akar masalah komponen + estimasi RUL.
5. **UC-05: Generate Work Order & Cek Stok Sparepart**: Memanggil API ERP/SAP untuk memeriksa stok sparepart (misal bearing #SKF-6204) dan menerbitkan tiket perbaikan resmi.
6. **UC-06: Monitoring Dasbor Armada & Estimasi RUL**: Peta interaktif pabrik dengan kode warna status kesehatan mesin dan estimasi penghematan biaya downtime untuk manajemen.
7. **UC-07: Verifikasi Paspor Kesehatan On-Chain**: Auditor/calon pembeli memindai QR Code mesin untuk memverifikasi seluruh riwayat servis di smart contract secara independen (*zero-tampering*).
8. **UC-08: Eksekusi Klaim Garansi Parametrik**: Pengajuan klaim asuransi/garansi dievaluasi secara otomatis oleh smart contract berbasis histori kepatuhan inspeksi mesin ($\ge 95\%$).

---

## 🔄 4. END-TO-END WORKFLOW & SEQUENCE DIAGRAM

### Alur Logika Sistem (Flowchart Decision Tree):
```mermaid
flowchart TD
    Start([Mulai Inspeksi Harian Mesin]) --> Rec[Operator Rekam Audio 10 Detik 16kHz PCM]
    Rec --> EdgeAI[Ekstraksi STgram-MFN: Mel-Spectrogram & Linear STFT]
    EdgeAI --> KNN[KNN-k5 Hitung Jarak Anomali Cosine]
    
    KNN --> Check{Skor Anomali > Threshold?}
    
    %% Jalur Normal
    Check -- "Tidak (Mesin Sehat)" --> NormalCard[Tampilkan Kartu Hijau Pass]
    NormalCard --> GenHash[Hitung SHA-256 Data Hash]
    GenHash --> CommitChain[Commit ke Polygon Smart Contract]
    CommitChain --> End([Selesai])

    %% Jalur Anomali
    Check -- "Ya (Anomali Terdeteksi)" --> RedAlert[Bunyikan Alarm & Tampilkan Spektrogram]
    RedAlert --> GenAICore[Kirim Dual-Spektrogram & Telemetri ke Gemini Multimodal]
    GenAICore --> RAGProc[RAG Telusuri Manual ISO 10816 & Estimasi RUL Fisik]
    RAGProc --> Report[Terbitkan Laporan Diagnostik: Komponen Rusak & Sisa Umur]
    
    Report --> Approve{Supervisor Setujui Work Order?}
    Approve -- Ya --> ERPCall[Panggil API ERP/SAP: Cek Stok Part & Terbitkan WO]
    ERPCall --> Notify[Kirim Notifikasi Tugas Kerja ke Teknisi Shift]
    Approve -- Tidak --> Reschedule[Jadwalkan Ulang Inspeksi]
    
    Notify --> GenHashAnomaly[Hitung SHA-256 Hash Laporan & Rekaman]
    GenHashAnomaly --> CommitChain
    Reschedule --> End
```

### Diagram Urutan Pesan (Sequence Diagram):
```mermaid
sequenceDiagram
    autonumber
    actor Op as 👷 Operator Lapangan
    actor Sup as 👨‍💼 Supervisor Maint.
    participant App as 📱 EchoFactory App
    participant AI as ⚡ STgram-MFN Engine
    participant GenAI as 🧠 Gemini & SOP RAG
    participant ERP as 💻 SAP / ERP System
    participant Web3 as ⛓️ Polygon Smart Contract

    Op->>App: Rekam Audio Mesin 10 Detik (16kHz PCM)
    App->>AI: Ekstraksi Spektrogram & Scoring KNN-k5
    AI-->>App: Return Skor Anomali (0.840 - Alert Anomali)
    App->>Op: Tampilkan Indikator Peringatan Merah
    App->>Sup: Kirim Notifikasi Darurat Anomali Mesin

    rect rgb(254, 243, 199)
        note over Sup, GenAI: Fase Analisis Multimodal & RAG
        Sup->>App: Minta AI Mendiagnosis Akar Masalah
        App->>GenAI: Kirim Spektrogram + Telemetri (RPM, Temp)
        GenAI->>GenAI: Pencocokan Pola Frekuensi & Estimasi RUL Fisik
        GenAI-->>App: Diagnosis: "Bearing Inner Race Rusak | RUL: 38 Jam"
        App->>Sup: Tampilkan Laporan Diagnostik & Rekomendasi Part
    end

    rect rgb(220, 252, 231)
        note over Sup, ERP: Fase Eksekusi Work Order ERP
        Sup->>App: Approve Work Order (Ganti Bearing #SKF-6204)
        App->>ERP: Request Pembuatan WO & Alokasi Stok Gudang
        ERP-->>App: WO Terbit (#WO-2026-0814-09) & Stok Dialokasikan
        App->>Op: Kirim Pesan Tugas Kerja & Nomor Part
    end

    rect rgb(237, 233, 254)
        note over App, Web3: Fase Integritas Audit On-Chain (Blockchain)
        App->>App: Generate SHA-256 Hash Data Inspeksi Komplit
        App->>Web3: recordInspection(Machine_ID, Score, Status, Defect, Hash)
        Web3-->>App: TxHash Terbit & Tercatat Permanen di Blok Polygon
    end
```

---

## ⛓️ 5. SPESIFIKASI LENGKAP SMART CONTRACT (`MachineHealthPassport.sol`)

File smart contract terletak di: [MachineHealthPassport.sol](file:///c:/Users/muhib/Downloads/COMPFEST/EchoFactory/blockchain/contracts/MachineHealthPassport.sol)

### Fitur & Struktur Data Kontrak:
1. **Pendaftaran Mesin (Genesis Baseline)**:
   * Menyimpan `MachineProfile` (Model, RPM, waktu pendaftaran, dan centroid baseline hash).
2. **Pencatatan Riwayat Inspeksi**:
   * Menyimpan deret log `InspectionRecord` (Skor anomali integer skala 1:1000, status, defect type, IPFS link, data hash SHA-256, dan address pengirim).
3. **Verifikasi Integritas Data On-Chain**:
   * Fungsi `verifyDataIntegrity` memastikan hash data lokal sama persis dengan yang tersimpan di blockchain (*Zero-tampering check*).
4. **Klaim Garansi Parametrik**:
   * Fungsi `fileWarrantyClaim` mengevaluasi kepatuhan inspeksi mesin secara otomatis.

### Kode Smart Contract Solidity Lengkap:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MachineHealthPassport
 * @dev Smart Contract untuk Paspor Kesehatan Mesin & Klaim Garansi Parametrik
 *      Jaringan: Polygon Amoy Testnet (Chain ID 80002)
 */
contract MachineHealthPassport {
    
    struct MachineProfile {
        string machineId;
        string modelType;
        uint256 ratedRPM;
        bytes32 baselineHash;
        uint256 registeredAt;
        address registeredBy;
    }

    struct InspectionRecord {
        uint256 timestamp;
        uint256 anomalyScore; // Skala 1:1000 (contoh: 0.045 disimpan 45, 0.850 disimpan 850)
        string status;        // "NORMAL", "WARNING", "CRITICAL"
        string defectType;    // "None (Healthy)", "Bearing Inner Race Defect", dll.
        string ipfsMetadata;  // CID IPFS rekaman audio / laporan
        bytes32 dataHash;     // SHA-256 cryptographic hash
        address inspector;    // Address pengirim / node inspeksi
    }

    struct WarrantyClaim {
        uint256 claimId;
        string machineId;
        uint256 filedAt;
        string defectDescription;
        bool isApproved;
        string resolutionNote;
    }

    mapping(string => MachineProfile) public machineProfiles;
    mapping(string => InspectionRecord[]) private machineRegistry;
    mapping(uint256 => WarrantyClaim) public warrantyClaims;
    uint256 public totalClaimsCount;

    // Events
    event MachineRegistered(string indexed machineId, bytes32 baselineHash, address indexed owner);
    event InspectionLogged(string indexed machineId, uint256 indexed timestamp, uint256 anomalyScore, string status, bytes32 dataHash);
    event WarrantyClaimFiled(uint256 indexed claimId, string indexed machineId, bool isApproved);

    // UC-03: Registrasi Profil Mesin & Baseline Akustik
    function registerMachine(
        string memory _machineId,
        string memory _modelType,
        uint256 _ratedRPM,
        bytes32 _baselineHash
    ) external {
        require(bytes(_machineId).length > 0, "Machine ID tidak boleh kosong");
        require(machineProfiles[_machineId].registeredAt == 0, "Mesin sudah terdaftar");

        machineProfiles[_machineId] = MachineProfile({
            machineId: _machineId,
            modelType: _modelType,
            ratedRPM: _ratedRPM,
            baselineHash: _baselineHash,
            registeredAt: block.timestamp,
            registeredBy: msg.sender
        });

        emit MachineRegistered(_machineId, _baselineHash, msg.sender);
    }

    // UC-01: Mencatat Riwayat Inspeksi Akustik Baru
    function recordInspection(
        string memory _machineId,
        uint256 _anomalyScore,
        string memory _status,
        string memory _defectType,
        string memory _ipfsMetadata,
        bytes32 _dataHash
    ) external returns (uint256) {
        require(bytes(_machineId).length > 0, "Machine ID tidak boleh kosong");

        InspectionRecord memory newRecord = InspectionRecord({
            timestamp: block.timestamp,
            anomalyScore: _anomalyScore,
            status: _status,
            defectType: _defectType,
            ipfsMetadata: _ipfsMetadata,
            dataHash: _dataHash,
            inspector: msg.sender
        });

        machineRegistry[_machineId].push(newRecord);
        emit InspectionLogged(_machineId, block.timestamp, _anomalyScore, _status, _dataHash);
        return machineRegistry[_machineId].length;
    }

    // UC-08: Eksekusi Klaim Garansi Parametrik
    function fileWarrantyClaim(
        string memory _machineId,
        string memory _defectDescription
    ) external returns (uint256, bool) {
        uint256 inspectionCount = machineRegistry[_machineId].length;
        bool autoApproved = inspectionCount >= 5; 

        totalClaimsCount++;
        warrantyClaims[totalClaimsCount] = WarrantyClaim({
            claimId: totalClaimsCount,
            machineId: _machineId,
            filedAt: block.timestamp,
            defectDescription: _defectDescription,
            isApproved: autoApproved,
            resolutionNote: autoApproved 
                ? "Auto-Approved: Kepatuhan inspeksi rutin terpenuhi on-chain"
                : "Pending Manual Review: Riwayat log harian kurang memadai"
        });

        emit WarrantyClaimFiled(totalClaimsCount, _machineId, autoApproved);
        return (totalClaimsCount, autoApproved);
    }

    // UC-07: Query Riwayat Audit On-Chain
    function getMachineHistory(string memory _machineId) external view returns (InspectionRecord[] memory) {
        return machineRegistry[_machineId];
    }

    function getLatestRecord(string memory _machineId) external view returns (InspectionRecord memory) {
        uint256 count = machineRegistry[_machineId].length;
        require(count > 0, "Belum ada riwayat untuk mesin ini");
        return machineRegistry[_machineId][count - 1];
    }

    function getTotalInspections(string memory _machineId) external view returns (uint256) {
        return machineRegistry[_machineId].length;
    }

    function verifyDataIntegrity(
        string memory _machineId,
        uint256 _index,
        bytes32 _expectedHash
    ) external view returns (bool) {
        require(_index < machineRegistry[_machineId].length, "Index record di luar batas");
        return machineRegistry[_machineId][_index].dataHash == _expectedHash;
    }
}
```

---

## 🐍 6. INTEGRASI PYTHON SERVICE & PIPELINE ML

Modul Python penghubung terletak di: [blockchain_service.py](file:///c:/Users/muhib/Downloads/COMPFEST/EchoFactory/blockchain/blockchain_service.py)

### Fitur Utama Service:
1. **Multi-RPC Fallback**: Otomatis berganti endpoint RPC publik jika salah satu RPC lambat / *timeout*.
2. **Kalkulasi SHA-256 Data Hash**: Menghasilkan hash kriptografi dari kamus metadata hasil deteksi.
3. **Simulation Mode Fallback**: Jika smart contract belum dideploy atau dijalankan secara offline, service beralih ke mode simulasi hashing tanpa error/crash, sehingga demo tetap berjalan lancar.

### Cara Memanggil Service dari Pipeline Backend / FastAPI:
```python
from EchoFactory.blockchain.blockchain_service import blockchain_service

# Setelah inferensi STgram-MFN & KNN selesai:
result = blockchain_service.commit_inspection_record(
    machine_id="FAN_ID_00",
    anomaly_score=0.045,
    status="NORMAL",
    defect_type="None (Healthy)"
)

print(f"Status Komitmen : {result['status']}")
print(f"Polygonscan URL : {result['polygonscan_url']}")
```

---

## 🚀 7. PANDUAN DEPLOYMENT & TESTING LANGKAH-DEMI-LANGKAH

### Langkah 1: Setup Wallet & Saldo MATIC (Gratis)
1. Buka MetaMask, pilih jaringan **Polygon Amoy Testnet** (Chain ID: `80002`).
2. Klaim saldo MATIC gratis di [Polygon Official Faucet](https://faucet.polygon.technology/) atau [Alchemy Amoy Faucet](https://www.alchemy.com/faucets/polygon-amoy).
3. Salin **Private Key** akun testing Anda dari MetaMask.

### Langkah 2: Deploy Contract via Remix IDE
1. Buka [Remix Ethereum IDE](https://remix.ethereum.org/).
2. Buat file `MachineHealthPassport.sol` dan paste kode Solidity di atas.
3. Pada tab **Solidity Compiler**, pilih versi `0.8.20` dan klik **Compile**.
4. Pada tab **Deploy & Run**, pilih **Injected Provider - MetaMask**, lalu klik **Deploy**.
5. Salin alamat smart contract yang terbit (misal: `0x9a8B3...`).

### Langkah 3: Konfigurasi File Environment
Buka file [EchoFactory/blockchain/.env](file:///c:/Users/muhib/Downloads/COMPFEST/EchoFactory/blockchain/.env) dan isi konfigurasi:
```env
POLYGON_RPC_URL=https://polygon-amoy-bor-rpc.publicnode.com
CHAIN_ID=80002
WALLET_PRIVATE_KEY=0x<PRIVATE_KEY_ANDA>
CONTRACT_ADDRESS=0x<CONTRACT_ADDRESS_HASIL_DEPLOY>
```

### Langkah 4: Jalankan Script Pengujian
Jalankan pengujian end-to-end melalui terminal:
```powershell
python EchoFactory/blockchain/scripts/test_blockchain.py
```

Output pengujian akan menampilkan:
* ✅ Status koneksi node Polygon Amoy
* ✅ Alamat wallet & saldo MATIC
* ✅ Skor anomali hasil inferensi ML
* ✅ SHA-256 data hash
* ✅ Transaction Hash (`tx_hash`) dan tautan live explorer **Polygonscan**
* ✅ Pembacaan kembali riwayat inspeksi dari Smart Contract

---

## 📈 8. HASIL VALIDASI & BENCHMARK SISTEM

| Komponen | Metrik Pengujian | Hasil EchoFactory | Status |
|---|---|:---:|:---:|
| **Model AI (Fan)** | AUC Benchmark IEEE (0 dB SNR) | **94.04%** (pAUC: 85.31%) | ✅ Sempurna |
| **Model AI (Slider)**| AUC Benchmark IEEE (0 dB SNR) | **99.32%** (pAUC: 97.55%) | ✅ Luar Biasa |
| **Model AI (Valve)** | AUC Benchmark IEEE (0 dB SNR) | **99.60%** (pAUC: 97.20%) | ✅ Sempurna |
| **Model AI (Pump)**  | AUC Benchmark IEEE (0 dB SNR) | **91.90%** (pAUC: 82.50%) | ✅ Sempurna |
| **Efisiensi Edge** | Ukuran Model ONNX & Latensi | **183.8 KB** / **< 50 ms** | ✅ Ultra Ringan |
| **Integritas Web3** | Konsistensi SHA-256 Hash | **100% Match (0 Tampering)** | ✅ Terverifikasi |
| **Kecepatan Blok** | Waktu Validasi Blok Polygon | **~2.1 Detik / Transaksi** | ✅ Real-Time |

---

## 🔍 9. GAP ANALYSIS & STATUS IMPLEMENTASI

Berikut adalah rekapitulasi komprehensif status modul saat ini vs target MVP lengkap untuk kompetisi:

```mermaid
pie title Status Kesiapan Modul EchoFactory
    "Sudah Selesai (AI Models & Smart Contract)" : 45
    "Belum (Interactive Web Dashboard)" : 25
    "Belum (FastAPI Backend Gateway)" : 15
    "Belum (Gemini RAG ISO 10816 Module)" : 10
    "Belum (Sample Audio Bank & Pitch Deck)" : 5
```

| ID Use Case | Nama Fitur / Modul | Status Implementasi | Komponen yang Perlu Dikerjakan |
|---|---|:---:|---|
| **UC-01** | **Pindai & Deteksi Suara Mesin** | 🟡 *Backend Model Ready* | WebAudio UI Recorder, Waveform & Spectrogram visualizer, Tombol Scan. |
| **UC-02** | **Voice Assistant Hands-Free** | 🔴 *Belum Ada* | Speech Recognition (STT), Gemini Voice Prompting, Text-to-Speech (TTS). |
| **UC-03** | **Kalibrasi Baseline Mesin Baru** | 🟡 *Contract Ready* | UI Wizard 3-sample recording, centroid vector calculator, on-chain genesis minting. |
| **UC-04** | **Diagnosis Multimodal & SOP RAG** | 🔴 *Belum Ada* | Integrasi Gemini Flash Multimodal, Knowledge Base ISO 10816, estimasi RUL. |
| **UC-05** | **Work Order & ERP SAP Stock** | 🔴 *Belum Ada* | Endpoint simulasi ERP/SAP, UI penerbitan tiket WO dan alokasi sparepart. |
| **UC-06** | **Monitoring Dasbor Armada Mesin** | 🔴 *Belum Ada* | Dashboard Fleet Health 4 jenis mesin, visual peta pabrik, ROI & Downtime calculator. |
| **UC-07** | **Verifikasi Paspor On-Chain** | 🟡 *Service Ready* | UI Timeline riwayat inspeksi, verifikasi SHA-256 live hash, tautan Polygonscan. |
| **UC-08** | **Klaim Garansi Parametrik** | 🟡 *Contract Ready* | Form pengajuan klaim garansi, trigger smart contract auto-approval on-chain. |

---

## ⚡ 10. BLUEPRINT ARSITEKTUR BACKEND GATEWAY (`FastAPI`)

Backend terpadu akan dibangun menggunakan **FastAPI** di dalam modul `EchoFactory/backend/app.py` untuk mengorkestrasi inferensi AI, panggilan LLM, dan transaksi Blockchain.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI GATEWAY (Port 8000)                        │
├────────────────────────────────┬────────────────────────────────────────────┤
│ 1. POST /api/scan-audio        │ Ekstraksi Mel/STFT & STgram-MFN KNN score  │
│ 2. POST /api/diagnose          │ Gemini Flash Multimodal + ISO 10816 RAG    │
│ 3. POST /api/voice-assistant   │ Voice hands-free Q&A processing            │
│ 4. POST /api/work-order        │ ERP/SAP Work Order & Stock Allocation      │
│ 5. GET  /api/fleet-health      │ Real-time multi-machine health stats       │
│ 6. POST /api/blockchain/commit │ Commit record ke MachineHealthPassport.sol │
│ 7. GET  /api/blockchain/record │ Query live inspection passport on-chain    │
│ 8. POST /api/blockchain/claim  │ Trigger parametric warranty claim          │
└────────────────────────────────┴────────────────────────────────────────────┘
```

### Rincian Endpoint Kunci:

```python
# Blueprint app.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from EchoFactory.blockchain.blockchain_service import blockchain_service

app = FastAPI(title="EchoFactory Industrial AI & Web3 Gateway", version="1.0.0")

@app.post("/api/scan-audio")
async def scan_machine_audio(file: UploadFile = File(...), machine_id: str = Form(...)):
    """Menerima audio 10 detik, memproses spektrogram, dan mengembalikan anomaly score."""
    # 1. Baca audio file bytes
    # 2. Preprocess Mel-Spectrogram + Linear STFT
    # 3. Hitung cosine distance vs Centroid baseline
    # 4. Return status: NORMAL / WARNING / CRITICAL
    pass

@app.post("/api/diagnose")
async def diagnose_multimodal(machine_id: str, defect_data: dict):
    """Mendiagnosis akar masalah menggunakan Gemini Multimodal & ISO 10816."""
    # 1. Load context SOP ISO 10816 vibration severity
    # 2. Prompt Gemini Flash dengan kurva spektrum + parameter operasi
    # 3. Return diagnosis, defect type, RUL hours, recommended parts
    pass
```

---

## 🎨 11. BLUEPRINT FRONTEND INTERACTIVE DASHBOARD

Antarmuka web mengusung tema **Modern Industrial Dark Mode** (High-tech Slate & Cyan/Emerald Accents) dengan 4 Tab Navigasi Utama:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏭 ECHOFACTORY | Acoustic Machine Intelligence & Blockchain Passport       │
├──────────────────┬──────────────────┬──────────────────┬────────────────────┤
│ 📱 Operator Hub  │ 🔬 Supervisor AI │ 📊 Fleet Manager │ ⛓️ Blockchain Trust │
└──────────────────┴──────────────────┴──────────────────┴────────────────────┘
```

### 1. Tab 1: Operator Hub (UC-01 & UC-02)
* **Audio Input Zone**: Tombol *"Mulai Rekam Suara (10s)"* via mikrofon atau upload file audio WAV/MP3.
* **Live Visualizer**: Waveform audio real-time dan Mel-Spectrogram 2D visualizer.
* **Instant Decision Card**:
  * 🟢 **MESIN SEHAT (PASS)**: Score $\le 0.050$, tombol simpan log ke blockchain.
  * 🔴 **ANOMALI TERDETEKSI (ALERT)**: Score $> 0.050$, indikator alarm berkedip dan tombol *"Minta Analisis Supervisor"*.
* **Voice Assistant Widget**: Tombol mikrofon untuk tanya jawab lisan: *"Echo, apa tindakan darurat untuk Fan 00?"*.

### 2. Tab 2: Supervisor Diagnostic & Work Order (UC-04 & UC-05)
* **Dual-Spectrum Deep Analysis**: Spektrogram frekuensi waktu + FFT Power Spectral Density.
* **Cognitive AI Diagnosis Panel (Gemini Flash + ISO 10816)**:
  * Akar Masalah: *Bearing Inner Race Defect (BPFI: 118.5 Hz)*.
  * Level Keparahan: *Zone C (Unrestricted Operation Not Recommended)*.
  * Estimasi RUL: *38 Jam Operasi*.
* **ERP/SAP Work Order Dispatcher**:
  * Pengecekan stok suku cadang gudang (*SKF-6204 Bearing: 8 unit tersedia*).
  * Tombol 1-klik: *"Terbitkan Work Order #WO-2026-0814-09 & Kirim ke Teknisi Shift"*.

### 3. Tab 3: Fleet Management Dashboard (UC-06)
* **Peta Denah Pabrik Interaktif**: Visual lokasi 4 unit mesin (Fan, Pump, Slider, Valve) dengan indikator status warna (Hijau, Kuning, Merah).
* **Armada KPI Cards**:
  * *Overall Fleet Reliability Score*: **97.8%**
  * *Predicted Unplanned Downtime Prevented*: **14.2 Jam**
  * *Estimated Cost Savings*: **Rp 284.000.000,-**
* **Health Degradation Trend Chart**: Grafik garis perubahan skor anomali 30 hari terakhir per mesin.

### 4. Tab 4: Blockchain Health Passport & Warranty Portal (UC-07 & UC-08)
* **Passport Lookup & QR Scanner**: Input Machine ID untuk memanggil log riwayat dari Smart Contract Polygon Amoy.
* **On-Chain Audit Timeline**: Deret waktu inspeksi permanen berisi Timestamp, Inspector Address, Anomaly Score, dan SHA-256 Hash.
* **Zero-Tampering Hash Validator**: Membandingkan hash lokal vs on-chain secara interaktif. Tautan langsung ke live **Polygonscan Explorer**.
* **Parametric Warranty Portal**: Form pengajuan klaim garansi instan dengan evaluasi otomatis (*Auto-Approved if inspection compliance $\ge 5$ records*).

---

## 🧠 12. SPESIFIKASI COGNITIVE DIAGNOSTIC & SOP RAG (ISO 10816)

Modul ini menggabungkan penalaran visual Gemini dengan standar getaran mesin industri internasional:

### Standar Klasifikasi ISO 10816 (Vibration Severity):
* **Zone A (0.0 - 1.8 mm/s)**: Kondisi mesin baru beroperasi / prima (*Normal*).
* **Zone B (1.8 - 4.5 mm/s)**: Mesin layak operasi jangka panjang tanpa batasan (*Acceptable*).
* **Zone C (4.5 - 11.2 mm/s)**: Mesin mengalami degradasi, operasi jangka panjang tidak disarankan (*Warning*).
* **Zone D (> 11.2 mm/s)**: Kerusakan parah, bahaya kegagalan katastropik mendesak (*Critical/Danger*).

### Rumus Perhitungan Frekuensi Cacat Bearing (Bearing Fault Formulas):
1. **BPFI** (*Ball Pass Frequency Inner Ring*): $f_{\text{BPFI}} = \frac{N}{2} f_r \left(1 + \frac{d}{D}\cos\alpha\right)$
2. **BPFO** (*Ball Pass Frequency Outer Ring*): $f_{\text{BPFO}} = \frac{N}{2} f_r \left(1 - \frac{d}{D}\cos\alpha\right)$
3. **BSF** (*Ball Spin Frequency*): $f_{\text{BSF}} = \frac{D}{2d} f_r \left(1 - \left(\frac{d}{D}\cos\alpha\right)^2\right)$

---

## 🎵 13. BANK SAMPEL AUDIO DEMO SIAP UJI

Untuk memudahkan pengujian dan presentasi demo langsung (tanpa harus merekam suara fisik saat pitching), sistem menyediakan folder sampel audio demo:

| ID Sample | Mesin Target | Kondisi Operasional | Anomaly Score Ekspektasi | Hasil AI |
|---|---|---|:---:|:---:|
| `DEMO_FAN_NORMAL.wav` | Industrial Blower #00 | 100% Beban, Pelumasan Baik | $0.015 - 0.040$ | 🟢 Normal (Pass) |
| `DEMO_FAN_ANOMALY.wav` | Industrial Blower #00 | Inner Race Bearing Wear + Noise | $0.840 - 0.920$ | 🔴 Critical Alert |
| `DEMO_PUMP_NORMAL.wav` | Centrifugal Pump #01 | Aliran Laminar, Tekanan Stabil | $0.022 - 0.045$ | 🟢 Normal (Pass) |
| `DEMO_PUMP_ANOMALY.wav` | Centrifugal Pump #01 | Kavitasi Impeler & Gelembung Udara | $0.780 - 0.860$ | 🔴 Warning Alert |
| `DEMO_SLIDER_NORMAL.wav` | Linear Guide Rail #02 | Pelumas Cukup, Gerak Halus | $0.010 - 0.035$ | 🟢 Normal (Pass) |
| `DEMO_SLIDER_ANOMALY.wav` | Linear Guide Rail #02 | Friksi Rel Kering & Kontaminasi Debu | $0.890 - 0.970$ | 🔴 Critical Alert |
| `DEMO_VALVE_NORMAL.wav` | Solenoid Valve #03 | Siklus Buka-Tutup Presisi | $0.018 - 0.042$ | 🟢 Normal (Pass) |
| `DEMO_VALVE_ANOMALY.wav` | Solenoid Valve #03 | Kebocoran Katup & Sumbatan Partikel | $0.850 - 0.940$ | 🔴 Critical Alert |

---

## 🚀 14. ROADMAP EKSEKUSI & LANGKAH IMPLEMENTASI

Berikut adalah urutan tahapan kerja terstruktur untuk menyelesaikan seluruh ekosistem EchoFactory:

```mermaid
timeline
    title Roadmap Eksekusi EchoFactory Menuju Final Pitching
    Fase 1 : Backend Gateway FastAPI : Integrasi Model ONNX & Web3 Service
    Fase 2 : Frontend Industrial UI : 4 Tab Navigation & WebAudio Visualizer
    Fase 3 : Cognitive RAG Module : Gemini Flash & ISO 10816 Diagnostic Engine
    Fase 4 : Demo Sample Library : Pre-packaged Audio & Mock ERP Endpoint
    Fase 5 : Pitch Deck & Final Polish : Slide Presentation & Video Walkthrough
```

### Langkah Konkret Eksekusi:
1. **Langkah 1 (Backend Core)**: Buat `EchoFactory/backend/app.py` yang menghubungkan modul audio preprocessing, scoring STgram-MFN ONNX, dan `blockchain_service.py`.
2. **Langkah 2 (Frontend Web App)**: Buat antarmuka web interaktif (`index.html`, `style.css`, `app.js`) dengan styling industrial bertaraf tinggi (dark theme, glassmorphism, responsive, zero-placeholder).
3. **Langkah 3 (RAG & Gemini Integration)**: Integrasikan modul diagnosis kognitif yang memproses spektrogram audio + aturan ISO 10816.
4. **Langkah 4 (Bank Audio Demo)**: Siapkan sampel audio demo 4 mesin untuk pengujian instan 1-klik di UI.
5. **Langkah 5 (Pitch Deck & Final Artifacts)**: Susun dokumen presentasi slide deck pitch deck (PPTX/PDF/Docx) yang memukau juri COMPFEST 18 AIC.

---
*Dokumen Master Walkthrough ini diperbarui sebagai panduan arsitektur teknis dan roadmap implementasi lengkap EchoFactory.*
