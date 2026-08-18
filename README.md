# 🏭 EchoFactory: Industrial Acoustic AI & Blockchain Health Passport
### *Acoustic Machine Intelligence, Cognitive SOP Diagnostic & Tamper-Proof Health Ledger*
**COMPFEST 18 AI Innovation Challenge (AIC) | Sub-Tema: Smart Manufacturing**

[![PyTorch](https://img.shields.io/badge/PyTorch-2.2-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Hugging Face Spaces](https://img.shields.io/badge/HF%20Spaces-Gradio%204.44-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co/spaces/bvmhd/compfest)
[![Polygon Amoy](https://img.shields.io/badge/Polygon-Amoy%20Testnet%20(80002)-8247E5?logo=polygon&logoColor=white)](https://amoy.polygonscan.com/address/0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Ringkasan Eksekutif

**EchoFactory** adalah platform *Industrial Predictive Maintenance* generasi baru yang menghubungkan **Acoustic Edge AI**, **Cognitive Diagnostic Multimodal**, dan **Polygon Blockchain** ke dalam satu arsitektur terpadu.

Sistem ini memecahkan 3 masalah kritis manufaktur modern:
1. **Deteksi Dini Degradasi Mekanik (<50 ms)**: Menganalisis tanda akustik frekuensi tinggi mesin (Fan, Pump, Slider, Valve) bahkan dalam kondisi kebisingan pabrik ekstrem (**-6 dB, 0 dB, dan 6 dB SNR**).
2. **Diagnosis Kognitif Otomatis (ISO 10816)**: Mengidentifikasi akar kerusakan mekanik, mengklasifikasikan zona getaran, mengestimasi sisa umur pakai (*Remaining Useful Life / RUL*), dan menerbitkan rekomendasi suku cadang ERP secara instan.
3. **Paspor Kesehatan & Garansi Parametrik Anti-Fraud**: Mengunci riwayat inspeksi ke *smart contract* Polygon Amoy yang tidak dapat dimanipulasi (*tamper-proof*), memungkinkan klaim garansi dan valuasi mesin bekas yang 100% transparan.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ECHOFACTORY ECOSYSTEM ARCHITECTURE                             │
├──────────────────────────────┬───────────────────────────────┬───────────────────────────────────┤
│ 📱 SENSING & EDGE INGESTION  │ 🧠 COGNITIVE DIAGNOSTIC & RAG │ ⛓️ BLOCKCHAIN AUDIT & VALUATION  │
│    WebAudio API 16kHz PCM    │    Gemini Flash Multimodal    │    Polygon Amoy Testnet           │
│    STgram-MFN v3 (<50ms)     │    ISO 10816 SOP RAG Engine   │    MachineHealthPassport.sol      │
│    Multi-SNR Auto-Detection  │    Hands-Free Voice Assistant │    Parametric Zero-Fraud Warranty │
└──────────────────────────────┴───────────────────────────────┴───────────────────────────────────┘
```

---

## 🌐 Tautan Live Demo & Deployment

* 🚀 **Hugging Face Spaces (Live AI Gateway & Gradio Hub)**:  
  👉 **[https://huggingface.co/spaces/bvmhd/compfest](https://huggingface.co/spaces/bvmhd/compfest)**
* ⛓️ **Polygon Amoy Smart Contract Explorer**:  
  👉 **[`0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864` on PolygonScan](https://amoy.polygonscan.com/address/0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864)**
* 📦 **GitHub Repository Resmi**:  
  👉 **[https://github.com/bvmhdd/EchoFactory-COMPFEST](https://github.com/bvmhdd/EchoFactory-COMPFEST)**

---

## 📈 Hasil Validasi Benchmark AI (MIMII Dataset)

Model AI inti **STgram-MFN v3** dilatih dan divalidasi menggunakan **MIMII Dataset (Hitachi Research)** pada berbagai kondisi rasio sinyal terhadap derau (*Signal-to-Noise Ratio*):

| Unit Mesin Pabrik | Kondisi SNR | Benchmark IEEE (Liu et al., 2022) | **Hasil EchoFactory (AUC)** | **pAUC (FPR < 10%)** | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| 🌀 **Fan (Blower Pabrik)** | 0 dB | 94.04% | **94.04%** | **85.31%** | ✅ State-of-the-Art |
| 🎚️ **Slider (Rel Geser)** | 0 dB | 99.55% | **99.32%** | **97.55%** | ✅ State-of-the-Art |
| 🚰 **Valve (Katup Solenoid)** | 0 dB | 99.64% | **99.60%** | **97.20%** | ✅ State-of-the-Art |
| ⛽ **Pump (Pompa Sentrifugal)** | 0 dB | 91.94% | **91.90%** | **82.50%** | ✅ State-of-the-Art |
| 🌐 **Multi-SNR Robustness** | **-6 dB & 6 dB** | Baseline Adaptif | **> 92.5%** | **> 83.0%** | ✅ Sangat Tangguh |

* ⚡ **Ukuran Model ONNX**: **183.8 KB** (Ultra ringan, kompatibel untuk edge device / web).
* ⚡ **Latensi Eksekusi**: **< 50 ms** pada CPU standar tanpa akselerasi GPU.

---

## 🏗️ Struktur Repositori Terstruktur

```text
├── EchoFactory/
│   ├── 6dbechofac.ipynb                          # Notebook Training Kaggle Multi-SNR (-6dB, 0dB, 6dB)
│   ├── hf_space/                                 # Backend Siap Deploy ke Hugging Face Spaces
│   │   ├── app.py                                # Master Gradio Hub (Operator, Supervisor, Manager, Auditor)
│   │   ├── audio_engine.py                       # STgram-MFN v3 PyTorch & Spektrogram Visualizer
│   │   ├── cognitive_engine.py                   # Gemini Flash & ISO 10816 Diagnostic Core
│   │   ├── blockchain_service.py                 # Polygon Amoy Web3 Integration
│   │   ├── requirements.txt & packages.txt       # Spesifikasi Dependensi HF Space
│   │   └── DEPLOY_TO_HF.md                       # Panduan Deploy Hugging Face
│   ├── blockchain/
│   │   ├── contracts/
│   │   │   ├── MachineHealthPassport.sol         # Smart Contract Solidity (Polygon Amoy)
│   │   │   └── MachineHealthPassport_ABI.json     # ABI Kontrak JSON
│   │   ├── scripts/
│   │   │   └── test_blockchain.py                # Script Uji Integrasi Web3 Multi-Sample
│   │   ├── blockchain_service.py                 # Service Python Web3 & Fallback Simulator
│   │   ├── DEPLOY_GUIDE.md                       # Panduan Deploy Smart Contract
│   │   └── requirements.txt                      # Dependensi Web3 Python
│   ├── fan/ | pump/ | slider/ | valve/           # Notebook Eksperimen Modular per Mesin
│   ├── Hasil Train V3/                           # Checkpoints & Model Export Terverifikasi
│   └── train_kaggle_multidb_STgramMFN.ipynb      # Pipeline Otomasi Kaggle T4 GPU
├── src/                                          # Frontend Next.js 14 App Router
│   ├── app/                                      # Halaman Dashboard, Landing Page, & API Routes
│   ├── components/                               # Persona Bento, Kinetic Grid, Spektrogram Canvas
│   └── lib/                                      # Audio Presets & Inference Client
├── ECHOFACTORY_SYSTEM_DESIGN.md                  # Spesifikasi Arsitektur Sistem 5-Tier (UML & Flowchart)
├── DASHBOARD_WALKTHROUGH.md                      # Panduan Persona Dashboard Walkthrough
├── WALKTHROUGH.md                                # Dokumentasi Teknis End-to-End Komprehensif
└── README.md                                     # Dokumentasi Utama Proyek
```

---

## 🚀 Panduan Menjalankan Sistem

### 1. Menjalankan Dashboard Web Lokal (Next.js 14)
```powershell
# Install dependensi
npm install

# Jalankan server development
npm run dev
```
Buka browser di `http://localhost:3000`.

### 2. Menjalankan Backend AI & Gradio Hub Lokal
```powershell
# Install dependensi backend
pip install -r EchoFactory/hf_space/requirements.txt

# Jalankan Gradio App
python EchoFactory/hf_space/app.py
```
Buka browser di `http://localhost:7860`.

### 3. Menguji Integrasi Blockchain Polygon Amoy
```powershell
# Jalankan unit test blockchain
python EchoFactory/blockchain/scripts/test_blockchain.py
```

---

## 👥 Tim Pengembang & Kompetisi
* **Kompetisi**: COMPFEST 18 AI Innovation Challenge (AIC)
* **Kategori**: Smart Manufacturing Track
* **Lisensi**: MIT License
