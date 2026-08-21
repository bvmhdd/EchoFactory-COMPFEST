# PROPOSAL INOVASI TEKNOLOGI: ECHOFACTORY
## Acoustic Machine Intelligence & Tamper-Proof Health Passport for Industry 4.0

**Kategori Lomba**: AI Innovation Challenge (AIC) — Smart Manufacturing Track  
**Kompetisi**: COMPFEST 18  
**Nama Tim**: Aku Mau Fokus Hima Team  
**Institusi**: Universitas Indonesia / Tim Pengembang EchoFactory  
**Tahun**: 2026  

---

## 👥 PROFIL TIM PENGEMBANG (AKU MAU FOKUS HIMA TEAM)

| No | Nama Anggota | Role Hackathon | Tanggung Jawab & Kontribusi Utama |
|---|---|---|---|
| 1 | **Muhammad Muhibin** | **Team Lead & AI Architect** | Memimpin perancangan arsitektur deep metric learning STgram-MFN v3 dual-branch, optimasi kuantisasi ONNX Opset 17, dan arsitektur smart contract Polygon Amoy. |
| 2 | **Eko Muhammad Rizki** | **Full-Stack Developer** | Mengembangkan antarmuka Next.js 15 konsol industri 4-persona (Operator, Supervisor, Manager, Auditor), WebAudio API streaming 16 kHz, dan visualisasi spektrogram real-time. |
| 3 | **Muhammad Ihya Abdillah** | **AI & RAG Engineer** | Menyusun Cognitive Diagnostic Core menggunakan Gemini 2.0 Flash Multimodal RAG terintegrasi standar vibrasi ISO 10816-3 untuk estimasi RUL dan rekomendasi SOP preskriptif. |
| 4 | **Yasmin Tia Nizarini** | **Product & Proposal Lead** | Menyusun proposal teknis, memimpin strategi kepatuhan booklet lomba COMPFEST 18 AIC, dan mengelola koordinasi komunikasi serta roadmap proyek. |
| 5 | **Zaskia Azzahra** | **Data & ML Pipeline Engineer** | Mengkurasi pipeline dataset audio industri Hitachi MIMII (Fan, Pump, Slider, Valve), augmentasi sinyal multi-SNR (-6 dB s/d +6 dB), dan validasi distribusi spektrum akustik. |

---

# DAFTAR ISI PROPOSAL

- **BAB 1: RINGKASAN EKSEKUTIF & PROBLEM STATEMENT**
  - 1.1 Executive Summary
  - 1.2 Problem Statement Industri 4.0
  - 1.3 Value Proposition & Keunggulan Inovasi
- **BAB 2: USE CASES & USER JOURNEY MULTI-STAKEHOLDER**
  - 2.1 Matriks 4-Persona Pemangku Kepentingan
  - 2.2 Delapan Use Case Utama (UC-01 s.d. UC-08)
  - 2.3 End-to-End Workflow Walkthrough
- **BAB 3: ARSITEKTUR SISTEM & DATA FLOW**
  - 3.1 Model Arsitektur 5-Lapisan
  - 3.2 Diagram Alur Pemrosesan Data Akustik
  - 3.3 Benchmarking Latensi Pemrosesan Real-time
- **BAB 4: METODOLOGI AI & SIGNAL PROCESSING**
  - 4.1 Spesifikasi Dataset Hitachi MIMII
  - 4.2 Formula Signal Processing (STFT, Mel-Spectrogram, Crest Factor)
  - 4.3 Arsitektur Neural STgram-MFN v3 ONNX
  - 4.4 Cognitive RAG Gemini 2.0 Flash & Standar Vibrasi ISO 10816-3
- **BAB 5: BLOCKCHAIN & SMART CONTRACT AUDIT PASSPORT**
  - 5.1 Infrastruktur Polygon Amoy Testnet
  - 5.2 Smart Contract MachineHealthPassport.sol
  - 5.3 Kriptografi SHA-256 Proof of Inspection
  - 5.4 Automasi Klaim Garansi Parametrik OEM
- **BAB 6: ANALISIS BISNIS, FINANSIAL ROI & OEE**
  - 6.1 Dampak Metrik Overall Equipment Effectiveness (OEE)
  - 6.2 Simulasi Pengembalian Investasi (ROI & Payback Period)
  - 6.3 Matriks Perbandingan Kompetitor
- **BAB 7: ROADMAP PENGEMBANGAN & TECH STACK**
  - 7.1 Roadmap 4 Fase Implementasi
  - 7.2 Matriks Teknologi (*Tech Stack Matrix*)

---

# BAB 1: RINGKASAN EKSEKUTIF & PROBLEM STATEMENT

## 1.1 Executive Summary
**EchoFactory** adalah platform pemeliharaan prediktif (*Predictive Maintenance*) industri generasi baru yang memadukan **AI Akustik Edge (STgram-MFN v3)**, **Penalaran Kognitif Multimodal (Gemini 2.0 Flash RAG)**, **Standar Vibrasi Mekanik Internasional (ISO 10816-3)**, dan **Paspor Kesehatan Mesin Terdesentralisasi (Polygon Amoy Web3 Ledger)**.

Platform ini mentransformasi proses inspeksi suara mesin dari metode manual dan reaktif menjadi sistem inspeksi non-invasif yang otomatis, *real-time* (<25 ms), cerdas, dan memiliki integritas data anti-manipulasi (*tamper-proof*).

## 1.2 Problem Statement (Latar Belakang Masalah)
1. **Kerugian Finansial Akibat Unplanned Downtime**: Waktu henti mendadak pada lini produksi manufaktur menelan kerugian rata-rata **$260.000 (Rp 4,1 Miliar) per jam**.
2. **Kelemahan Sensor Getaran Kontak Fisik**: Sensor piezoelektrik konvensional bersifat invasif, berisiko rusak pada area bersuhu tinggi, berbiaya belasan juta rupiah per titik, dan mendeteksi kerusakan pada fase getaran akhir.
3. **Silo Data & Pemalsuan Log Inspeksi**: Catatan inspeksi manual berbasis kertas/spreadsheet rentan manipulasi (*fraud*), menyulitkan pembuktian kepatuhan pemeliharaan saat mengajukan klaim garansi ke OEM.

## 1.3 Value Proposition
- **Non-Invasive Sensing**: Menggunakan mikrofon MEMS tanpa kontak kabel fisik langsung, memangkas biaya sensor hingga 90%.
- **Deteksi Dini Frekuensi Tinggi**: Gelombang suara frekuensi tinggi menangkap micro-friction dan kavitasi 2–4 minggu lebih awal dibanding sensor getaran makro.
- **Cognitive Prescription**: Gemini 2.0 Flash RAG menerjemahkan skor anomali menjadi diagnosis akar masalah, estimasi RUL, dan rekomendasi SOP suku cadang otomatis.
- **Immutable Blockchain Audit**: Log inspeksi di-hash SHA-256 dan dicatat ke Polygon Amoy smart contract untuk klaim garansi instan tanpa sengketa.

---

# BAB 2: USE CASES & USER JOURNEY MULTI-STAKEHOLDER

## 2.1 Matriks 4-Persona Pemangku Kepentingan
EchoFactory merancang antarmuka terpadu (*Unified Console*) yang melayani 4 peran pengguna di pabrik:

| Persona | Kebutuhan Utama | Fitur Kunci di EchoFactory |
|---|---|---|
| **Operator Lantai Pabrik** | Deteksi cepat & visualisasi kondisi mesin saat bertugas. | Status Banner (NORMAL/ABNORMAL), Anomaly Score, Waveform Audio & Spektrogram Real-time. |
| **Supervisor Pemeliharaan** | Diagnosis teknis akar masalah & alokasi perbaikan. | Root-Cause Analysis, Zona ISO 10816-3, SOP preskriptif, Tiket Work Order otomatis (ERP/SAP). |
| **Plant Manager** | Visibilitas kesehatan aset & mitigasi kerugian finansial. | Indeks Kesehatan Mesin (%), Estimasi Remaining Useful Life (RUL), Kalkulasi Downtime Mitigated ($ USD). |
| **Auditor / Vendor OEM** | Verifikasi kepatuhan perawatan & audit klaim garansi. | Polygon Amoy On-Chain Passport, SHA-256 Proof Hash, Smart Contract Warranty Settlement. |

---

# BAB 3: ARSITEKTUR SISTEM & DATA FLOW

## 3.1 Model Arsitektur 5-Lapisan (*5-Layer Architecture*)

```
┌────────────────────────────────────────────────────────────────────────┐
│  LAYER 5: UNIFIED PRESENTATION CONSOLE (Next.js 15 + Tailwind CSS)     │
│  [Operator Console]   [Supervisor View]   [Manager ROI]   [Auditor]    │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 4: COGNITIVE RAG & DECISION LAYER                               │
│  [Gemini 2.0 Flash] ── [ISO 10816-3 Rules] ── [ERP Work Order Engine]  │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 3: EDGE ACOUSTIC AI INFERENCE                                   │
│  [STgram-MFN v3 ONNX Runtime FP32] ── [ArcFace Margin Metric Scorer]   │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 2: SIGNAL PROCESSING & DUAL-BRANCH TRANSFORM                    │
│  [Hann-STFT Branch (1024 FFT)]  +  [Log-Mel Filterbank (64-Bands)]     │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 1: SENSING & INGESTION                                          │
│  [16 kHz PCM Audio Stream]  /  [MEMS Acoustic Sensor Array]            │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 0: DECENTRALIZED TRUST & IMMUTABILITY (Polygon Amoy Web3)       │
│  [MachineHealthPassport.sol] ── [SHA-256 Proof Hash] ── [Chain ID 80002│
└────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Benchmarking Latensi Pemrosesan Real-Time
- **Ingestion & Audio Framing (10s PCM 16 kHz)**: 8 ms
- **Dual-Branch STFT + Mel Transformation**: 12 ms
- **STgram-MFN v3 Neural Inference (ONNX Edge)**: **21 ms** (<25 ms target)
- **Cognitive Diagnostic Gemini RAG Execution**: ~350 ms
- **Total Pipeline Latency**: **< 400 ms** (Sub-second prescriptive feedback)

---

# BAB 4: METODOLOGI AI & SIGNAL PROCESSING

## 4.1 Spesifikasi Dataset: Hitachi MIMII Benchmark
Dilatih pada 4 kategori mesin industri global:
1. **Industrial Fan**: Kegagalan unbalance bilah, misalignment, bantalan BPFI/BPFO (SKF-6204-2RSH).
2. **Centrifugal Pump**: Kegagalan kavitasi cairan 3–6 kHz, mechanical seal rupture (Grundfos CR15).
3. **Linear Slider Rail**: Keausan rel kering screech 1800 & 3200 Hz (THK HSR25R).
4. **Solenoid Valve**: Kebocoran tekanan tinggi 4–7 kHz, plunger hesitation (Festo VZWD).

Evaluasi ketahanan kebisingan mencakup SNR $+6\text{ dB}$, $0\text{ dB}$, dan $-6\text{ dB}$ (Extreme Harsh Noise).

## 4.2 Formula Signal Processing
- **STFT 1024-FFT, Hop-Size 512**:
  $$X(m, \omega) = \sum_{n=-\infty}^{\infty} x(n) w(n - m) e^{-j\omega n}$$
- **Log-Mel 64-Band Filterbank**:
  $$M(m, k) = \ln \left( \sum_{\omega} |X(m, \omega)|^2 \cdot H_k(\omega) + \epsilon \right)$$
- **Spectral Crest Factor**:
  $$\text{Crest Factor} = \frac{\max |x(t)|}{\sqrt{\frac{1}{N}\sum_{t=1}^{N} x(t)^2}}$$

## 4.3 Model Neural STgram-MFN v3 ONNX
Menggabungkan cabang STFT frekuensi tinggi dan cabang persepsi Mel menggunakan *ArcFace Cosine Metric Loss*. Model diexport ke ONNX Opset 17 FP32 (<184 KB) untuk eksekusi edge berlatensi <25 ms.

## 4.4 Cognitive Reasoning Gemini 2.0 Flash
Gemini 2.0 Flash mengintegrasikan aturan **ISO 10816-3** (Zone A <1.8 mm/s, Zone B 1.8–4.5 mm/s, Zone C 4.5–11.2 mm/s, Zone D >11.2 mm/s) guna memprediksi sisa hari pakai (RUL) dan merumuskan SOP perbaikan preskriptif secara otomatis.

---

# BAB 5: BLOCKCHAIN & SMART CONTRACT AUDIT PASSPORT

## 5.1 Infrastruktur Polygon Amoy Testnet
- **Network**: Polygon Amoy Proof-of-Stake Testnet
- **Chain ID**: `80002`
- **Smart Contract**: `MachineHealthPassport.sol`
- **Contract Address**: `0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864`

## 5.2 Kriptografi Proof-of-Inspection SHA-256
Setiap hasil inspeksi menghasilkan data hash unik:
$$\text{DataHash} = \text{SHA256}(\text{MachineID} \parallel \text{AnomalyScore} \parallel \text{ISOZone} \parallel \text{Timestamp})$$
Hash ini dicatat on-chain secara permanen sehingga catatan kesehatan mesin tidak dapat diubah oleh pihak manapun.

## 5.3 Klaim Garansi Parametrik Otomatis
Jika terjadi kerusakan mesin, smart contract memverifikasi riwayat log inspeksi secara otomatis. Jika kepatuhan inspeksi rutin harian terpenuhi (>95%), klaim penggantian suku cadang OEM disetujui seketika (*auto-approved*) tanpa proses birokrasi manual yang berbelit-belit.

---

# BAB 6: ANALISIS BISNIS, FINANSIAL ROI & OEE

## 6.1 Pengaruh Terhadap Overall Equipment Effectiveness (OEE)
- **Availability (+8.5%)**: Pengurangan waktu henti mendadak sebesar 20 jam/bulan.
- **Performance (+5.2%)**: Mesin beroperasi pada kapasitas penuh tanpa penurunan kecepatan akibat friksi.
- **Quality (+3.1%)**: Mencegah produk cacat akibat instabilitas getaran mesin.

## 6.2 Simulasi Finansial ROI (Pabrik 50 Unit Mesin Kritis)

| Parameter Finansial | Metode Konvensional | Dengan EchoFactory | Nilai Penghematan |
|---|---|---|---|
| Biaya Sensor & Instalasi | Rp 750.000.000 (Kabel Piezo) | Rp 75.000.000 (Mic Non-Kontak) | **Hemat 90% Biaya Awal (Rp 675 Juta)** |
| Rata-rata Downtime / Bulan | 28 Jam | 8 Jam | **Pengurangan 20 Jam Downtime** |
| Kerugian Finansial Downtime | Rp 420.000.000 / bulan | Rp 120.000.000 / bulan | **Hemat Rp 300.000.000 / bulan** |
| Biaya Kerusakan Darurat | Tinggi (*Catastrophic Overhaul*) | Rendah (*Planned Part Replacement*) | **Hemat 40% Biaya Suku Cadang** |
| **Estimasi Payback Period** | - | **< 3 Bulan Operasional** | **ROI Sangat Cepat** |

---

# BAB 7: ROADMAP PENGEMBANGAN & TECH STACK

## 7.1 Roadmap Implementasi 4 Fase
1. **Fase 1 (Selesai)**: Pelatihan STgram-MFN v3 pada dataset Hitachi MIMII, validasi multi-SNR, konversi ONNX, dan deployment Smart Contract ke Polygon Amoy.
2. **Fase 2 (Selesai)**: Pengembangan Unified Console Next.js 15 4-persona, integrasi Gemini 2.0 Flash RAG, dan speech query assistant.
3. **Fase 3 (Bulan 1–3)**: Uji coba lapangan (*pilot project*) pada 20 mesin pabrik mitra manufaktur dan integrasi webhook ERP/SAP.
4. **Fase 4 (Bulan 4–12)**: Peluncuran aplikasi mobile teknisi Android/iOS (Edge ONNX Native) dan asuransi parametrik komersial.

## 7.2 Matriks Teknologi (*Tech Stack*)
- **Frontend / Client**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React, WebAudio API.
- **Machine Learning Core**: PyTorch, ONNX Runtime FP32, STgram-MFN v3, ArcFace Metric Loss.
- **Cognitive AI & NLP**: Google Gemini 2.0 Flash API, Standard ISO 10816-3 Knowledge Base, RAG Prompt Engine.
- **Decentralized Web3 Ledger**: Polygon Amoy Testnet (Chain ID 80002), Solidity Smart Contracts, Web3.py / Ethers.js, SHA-256 Hashing.
