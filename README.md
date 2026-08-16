# 🏭 EchoFactory: Industrial Acoustic AI & Blockchain Health Passport
### Acoustic Machine Intelligence & Tamper-Proof Health Ledger
**COMPFEST 18 AI Innovation Challenge (AIC) | Sub-Tema: Smart Manufacturing**

---

## 📌 Ringkasan Eksekutif

**EchoFactory** adalah platform *Industrial Predictive Maintenance* generasi baru yang menghubungkan **Acoustic Edge AI**, **Cognitive Diagnostic Multimodal**, dan **Polygon Blockchain** ke dalam satu arsitektur terpadu. Sistem ini mendeteksi degradasi mekanik mesin pabrik (Fan, Pump, Slider, Valve) melalui profil suara frekuensi tinggi dalam kondisi kebisingan nyata (*0 dB SNR*), mendiagnosis akar masalah dengan SOP RAG ISO 10816, serta mencatat paspor kesehatan mesin (*Machine Health Passport*) yang *tamper-proof* di jaringan terdesentralisasi.

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

## 🏗️ Struktur Repositori

```text
├── EchoFactory/
│   ├── blockchain/
│   │   ├── contracts/
│   │   │   ├── MachineHealthPassport.sol         # Smart Contract Solidity (Amoy Testnet)
│   │   │   └── MachineHealthPassport_ABI.json     # ABI Kontrak JSON
│   │   ├── scripts/
│   │   │   └── test_blockchain.py                # Script Uji Integrasi Web3 Multi-Sample
│   │   ├── blockchain_service.py                 # Service Python Web3 & Fallback Simulator
│   │   ├── DEPLOY_GUIDE.md                       # Panduan Deploy & Setup Wallet
│   │   ├── requirements.txt                      # Dependensi Python Web3
│   │   └── .env.example                          # Template Konfigurasi Environment
│   ├── fan/                                      # Notebook Eksperimen Mesin Fan
│   ├── pump/                                     # Notebook Eksperimen Mesin Pump
│   ├── slider/                                   # Notebook Eksperimen Mesin Slider
│   ├── valve/                                    # Notebook Eksperimen Mesin Valve
│   ├── Hasil Train V3/                           # Output Model & Checkpoints STgram-MFN
│   ├── NB-01_EDA.ipynb                           # Exploratory Data Analysis Akustik
│   ├── NB-02_Preprocessing.ipynb                 # Ekstraksi Mel-Spectrogram & Linear STFT
│   ├── NB-03_Train_STgramMFN.ipynb               # Pelatihan Model Deep Metric Learning
│   └── NB-04_Evaluate_Export.ipynb               # Evaluasi AUC & Export ONNX Edge
├── ECHOFACTORY_SYSTEM_DESIGN.md                  # Spesifikasi Arsitektur Sistem 5-Tier
├── EchoFactory_Diagrams.docx                     # Dokumen Diagram UML & Flowchart
├── WALKTHROUGH.md                                # Panduan Walkthrough End-to-End
└── README.md                                     # Dokumentasi Utama Repositori
```

---

## 📈 Benchmark & Hasil Validasi AI

Model AI inti EchoFactory (**STgram-MFN v3**) divalidasi pada **MIMII Dataset (Hitachi Research)** dengan kondisi kebisingan pabrik nyata (**0 dB SNR**):

| Jenis Unit Mesin | Benchmark IEEE (Liu et al., 2022) | **Hasil EchoFactory (AUC)** | **pAUC (FPR < 10%)** | Status |
|---|:---:|:---:|:---:|:---:|
| 🌀 **Fan (Blower Pabrik)** | 94.04% | **94.04%** | **85.31%** | ✅ Sempurna |
| 🎚️ **Slider (Rel Geser)** | 99.55% | **99.32%** | **97.55%** | ✅ Luar Biasa |
| 🚰 **Valve (Katup Solenoid)** | 99.64% | **99.60%** | **97.20%** | ✅ Sempurna |
| ⛽ **Pump (Pompa Sentrifugal)** | 91.94% | **91.90%** | **82.50%** | ✅ Sempurna |

* **Ukuran Model ONNX**: **183.8 KB** (Ultra ringan, kompatibel edge/mobile).
* **Latensi Inferensi**: **< 50 ms** pada CPU smartphone standar.

---

## 🚀 Panduan Cepat Menjalankan Pengujian Blockchain

### 1. Install Dependensi
```powershell
pip install -r EchoFactory/blockchain/requirements.txt
```

### 2. Konfigurasi File `.env`
Duplikat template environment:
```powershell
copy EchoFactory/blockchain/.env.example EchoFactory/blockchain/.env
```
Isi variabel di file `EchoFactory/blockchain/.env`:
```env
POLYGON_RPC_URL=https://polygon-amoy-bor-rpc.publicnode.com
CHAIN_ID=80002
WALLET_PRIVATE_KEY=0x<PRIVATE_KEY_METAMASK_ANDA>
CONTRACT_ADDRESS=0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864
```

### 3. Jalankan Pengujian Integrasi Multi-Sample
```powershell
python EchoFactory/blockchain/scripts/test_blockchain.py
```

---

## 📜 Lisensi & Kepatuhan
Dikembangkan untuk **COMPFEST 18 AI Innovation Challenge (Smart Manufacturing)**. Seluruh hak cipta dilindungi di bawah lisensi MIT.
