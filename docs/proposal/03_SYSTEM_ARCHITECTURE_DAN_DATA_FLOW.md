# 03. ARSITEKTUR SISTEM & ALUR DATA (SYSTEM ARCHITECTURE)

## 1. Model Arsitektur 5-Lapisan (*5-Layer Architecture*)

EchoFactory dibangun dengan arsitektur modular terdistribusi yang memisahkan komputasi *edge*, penalaran kognitif berbasis *cloud*, dan validasi *blockchain*:

```
┌─────────────────────────────────────────────────────────────────────────┐
│               LAYER 5: PRESENTATION & USER EXPERIENCE                   │
│  • Next.js 14 Web Console (TypeScript, Tailwind CSS, Canvas Visualizer) │
│  • 4-Persona Unified Views (Operator, Supervisor, Manager, Auditor)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (REST API / JSON Response)
┌────────────────────────────────────┴────────────────────────────────────┐
│               LAYER 3: COGNITIVE REASONING & ERP RAG                    │
│  • Google Gemini 1.5 Flash Multimodal Engine                            │
│  • ISO 10816-3 Vibration Severity Rules Engine                          │
│  • Remaining Useful Life (RUL) Estimator & SAP/ERP Dispatcher           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────┴────────────────────────────────────┐
│               LAYER 2: ACOUSTIC EDGE AI INFERENCE CORE                  │
│  • STgram-MFN v3 (Spatio-Temporal Fusion Network + MobileFaceNet)       │
│  • Machine Fingerprint Classifier & Adaptive SNR Profiler               │
│  • Low-Latency ONNX Runtime Inference Engine (<50ms)                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (16 kHz Mono Audio Waveform)
┌────────────────────────────────────┴────────────────────────────────────┐
│               LAYER 1: AUDIO INGESTION & SIGNAL PREPROCESSING           │
│  • Direct Industrial Microphone Ingestion / WAV/MP3 Upload              │
│  • Short-Time Fourier Transform (STFT) & Log-Mel Spectrogram Generator  │
│  • Noise Suppression & Dynamic Peak Energy / Crest Factor Extractor     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (Hash Proof Commit)
┌────────────────────────────────────┴────────────────────────────────────┐
│               LAYER 4: DECENTRALIZED TRUST & PASSPORT (WEB3)            │
│  • Polygon Amoy Testnet (Chain ID: 80002, EVM-Compatible)               │
│  • Smart Contract: MachineHealthPassport.sol (0xFEc1FcFfF8...B3f1fD)    │
│  • Keccak-256 Proof-of-Inspection Hasher & Parametric Claim Engine      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Rincian Fungsi Per Lapisan

### Lapisan 1: Audio Ingestion & Signal Preprocessing
- **Fungsi**: Menerima sinyal audio mentah, melakukan standarisasi (*resampling* ke $16.000\text{ Hz}$, konversi saluran ke mono, serta *padding/trimming* ke durasi $10\text{ detik}$).
- **Ekstraksi Spektral**:
  - *STFT Matrix*: Menghasilkan peta frekuensi-waktu beresolusi tinggi ($N_{\text{fft}} = 1024, \text{hop} = 512$).
  - *Log-Mel Filterbank*: 64 filter bank mel untuk menangkap kontur energi akustik.
  - *Statistical Metrics*: Menghitung *Spectral Centroid, Crest Factor*, dan rasio energi frekuensi tinggi.

### Lapisan 2: Acoustic Edge AI Inference Core
- **Fungsi**: Mengekstraksi *embedding vector* dari gabungan spektrogram waktu dan spasial menggunakan model **STgram-MFN v3**.
- **Karakteristik Komputasi**: Diformulasikan dalam format **ONNX (Open Neural Network Exchange)** yang sangat ringan, memungkinkan inferensi ultra-cepat (<50ms) bahkan pada perangkat edge dengan daya komputasi terbatas (seperti Raspberry Pi 5 atau smartphone teknisi).

### Lapisan 3: Cognitive Diagnostic & ERP Dispatcher
- **Fungsi**: Menerjemahkan skor anomali angka menjadi narasi pemeliharaan yang bermakna (*actionable intelligence*).
- **Komponen**:
  - *ISO 10816 Standard Module*: Menetapkan tingkat keparahan getaran (Zone A, B, C, atau D).
  - *Gemini Flash AI*: Menyusun ringkasan diagnosis 3 kalimat (identifikasi masalah, risiko kegagalan, dan aksi cepat).
  - *ERP Inventory Matcher*: Mengambil data suku cadang terkait dari database gudang pabrik.

### Lapisan 4: Decentralized Trust & Passport Layer (Polygon Amoy)
- **Fungsi**: Menjamin bahwa seluruh data inspeksi tidak dapat diubah surut (*non-retroactive*) dan tidak dapat dimanipulasi oleh pihak internal pabrik maupun pihak ketiga.
- **Mekanisme**: Setiap hasil scan menghasilkan hash unik 32-byte yang dicatat ke blockchain publik melalui transaksi *smart contract* yang dapat diverifikasi di PolygonScan Explorer.

### Lapisan 5: Presentation & Multi-Stakeholder UI
- **Fungsi**: Menyajikan *dashboard* modern responsif berbasis **Next.js 14 & Tailwind CSS** dengan arsitektur UI berkinerja tinggi, dilengkapi visualisasi spektrogram interaktif (*HTML5 Canvas*) dan konsol 4 persona.

---

## 3. Karakteristik Kinerja & Metrik Latensi (*Performance Benchmarks*)

| Tahapan Pemrosesan | Teknologi / Engine | Target Latensi | Aktual Pengujian |
|---|---|---|---|
| Ingesti & Resampling Audio | Librosa / Scipy Signal | $<20\text{ ms}$ | $14.2\text{ ms}$ |
| Ekstraksi Fitur Spektral | STFT + Log-Mel Transform | $<15\text{ ms}$ | $11.8\text{ ms}$ |
| Inferensi Deteksi Anomali | STgram-MFN v3 ONNX | $<50\text{ ms}$ | **$38.4\text{ ms}$** |
| Penalaran Kognitif & ISO SOP | Gemini 1.5 Flash API | $<1.500\text{ ms}$ | $850\text{ ms}$ |
| Hashing Kriptografis | Keccak-256 (Local) | $<1\text{ ms}$ | $0.2\text{ ms}$ |
| Pencatatan On-Chain | Polygon Amoy RPC (Async) | $2.000 - 4.000\text{ ms}$ | Latar Belakang (Non-blocking) |
| Render Spektrogram Canvas | Next.js HTML5 Canvas | $<16\text{ ms}$ ($60\text{ fps}$) | $12.0\text{ ms}$ |
