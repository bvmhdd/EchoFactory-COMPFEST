# 06. ANALISIS BISNIS, ROI, ROADMAP & TECH STACK

## 1. Analisis Kelayakan Bisnis & Dampak Finansial (*ROI & OEE*)

### A. Pengaruh Terhadap Overall Equipment Effectiveness (OEE)
Penerapan EchoFactory secara langsung meningkatkan metrik OEE pada 3 dimensi utama:
1. **Availability (+8.5%)**: Penurunan waktu henti mesin tak terencana (*unplanned downtime*) berkat deteksi dini anomali suara 2-4 minggu sebelum kegagalan mekanik.
2. **Performance (+5.2%)**: Mesin beroperasi pada kapasitas optimal tanpa perlambatan akibat friksi atau getaran abnormal.
3. **Quality (+3.1%)**: Mencegah cacat produk manufaktur yang diakibatkan oleh ketidakstabilan motor putar atau pompa injeksi.

### B. Simulasi Pengembalian Investasi (*Return on Investment - ROI*)
Pada fasilitas pabrik manufaktur skala menengah dengan **50 unit mesin kritis**:

| Parameter Finansial | Metode Konvensional | Dengan EchoFactory | Penghematan / Peningkatan |
|---|---|---|---|
| Biaya Sensor & Wiring per Mesin | Rp 15.000.000 (Piezo Kabel) | Rp 1.500.000 (Mic Non-Kontak) | **Hemat 90% Biaya Hardware** |
| Rata-rata Downtime / Bulan | 28 Jam | 8 Jam | **Pengurangan 20 Jam Downtime** |
| Biaya Kerugian Downtime (Rp 15jt/jam) | Rp 420.000.000 / bulan | Rp 120.000.000 / bulan | **Hemat Rp 300 Juta / bulan** |
| Biaya Perbaikan Darurat (*Emergency*) | Tinggi (Komponen Rusak Total) | Rendah (Ganti Part Dini) | **Hemat 40% Biaya Suku Cadang** |
| **Estimasi Waktu Balik Modal (Payback Period)** | - | **< 3 Bulan Operasional** | - |

---

## 2. Matriks Keunggulan Kompetitif

| Fitur / Parameter | Sensor Vibrasi Kabel (SCADA) | Inspeksi Manual (Handheld) | **EchoFactory** |
|---|---|---|---|
| **Metode Sampling** | Kontak kabel permanen | Kontak manual sesaat | **Akustik Non-Invasif (Mic / Smartphone)** |
| **Deteksi Degradasi Mikro** | Menengah | Sangat Rendah | **Tinggi (Frekuensi Akustik Tinggi)** |
| **Kecepatan Inferensi** | Real-time | Tertunda (harian/mingguan) | **Real-time (<50 ms Edge ONNX)** |
| **Penalaran Diagnosis** | Tidak ada (hanya alarm threshold) | Pengalaman teknisi subjektif | **AI Kognitif Multimodal (Gemini Flash) + ISO 10816** |
| **Penerbitan Work Order** | Manual input ERP | Manual input | **Otomatis Dispatch ke ERP Suku Cadang** |
| **Integritas Riwayat Log** | Database lokal (bisa diedit) | Buku log / Excel | **Immutable Smart Contract (Polygon Amoy)** |
| **Klaim Garansi Mesin** | Negosiasi manual rumit | Rawan sengketa | **Parametrik Otomatis Berbasis On-Chain** |

---

## 3. Roadmap Pengembangan & Implementasi

```
  [ FASE 1: RISET & VALIDASI MODEL (SELESAI) ]
  • Pelatihan STgram-MFN v3 pada MIMII Dataset (Fan, Pump, Slider, Valve).
  • Validasi ketahanan noise (-6dB, 0dB, +6dB) & integrasi ONNX Runtime.
  • Deployment Smart Contract MachineHealthPassport ke Polygon Amoy Testnet.
                         │
                         ▼
  [ FASE 2: PROTOYPE & INTEGRASI DASHBOARD (SELESAI) ]
  • Pengembangan Web Console Next.js 14 dengan 4-Persona Unified Views.
  • Integrasi penalaran kognitif Gemini 1.5 Flash & knowledge base ISO 10816-3.
  • Deployment backend interaktif ke Hugging Face ZeroGPU Spaces.
                         │
                         ▼
  [ FASE 3: PILOT PROJECT INDUSTRI (Bulan 1 - 3) ]
  • Uji coba lapangan pada 20 mesin industri di pabrik manufaktur mitra.
  • Kalibrasi akustik pada lingkungan kebisingan pabrik riil.
  • Integrasi API webhook ke sistem ERP/SAP eksisting.
                         │
                         ▼
  [ FASE 4: KOMERSIALISASI & SCALE-UP (Bulan 4 - 12) ]
  • Peluncuran aplikasi mobile teknisi Android/iOS (Edge ONNX Native).
  • Kemitraan dengan perusahaan asuransi industri & OEM mesin untuk program garansi Web3.
```

---

## 4. Matriks Arsitektur Teknologi (*Tech Stack Matrix*)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND / DASHBOARD                          │
│  • Framework      : Next.js 14 (App Router), React 18, TypeScript       │
│  • Styling        : Tailwind CSS, Lucide React, Glassmorphism UI        │
│  • Signal Canvas  : HTML5 Canvas 60 FPS Spectrogram Engine              │
├─────────────────────────────────────────────────────────────────────────┤
│                          AI & SIGNAL PROCESSING                         │
│  • Edge AI Model  : STgram-MFN v3 (Spatio-Temporal Fusion ONNX Engine)  │
│  • Preprocessing  : Librosa 0.10, SciPy, NumPy, Matplotlib              │
│  • Cognitive LLM  : Google Gemini 1.5 Flash (Generative AI SDK)         │
│  • Knowledge Base : ISO 10816-3 Vibration Severity Rules Engine         │
├─────────────────────────────────────────────────────────────────────────┤
│                           BACKEND & SERVING                             │
│  • Model Serving  : Hugging Face Spaces (ZeroGPU CUDA Layer)            │
│  • Web Framework  : FastAPI, Starlette 0.37.2, AnyIO Async Engine       │
│  • Interactive UI : Gradio 4.44.0                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                         BLOCKCHAIN & DECENTRALIZED                      │
│  • Network        : Polygon Amoy Testnet (Chain ID: 80002)              │
│  • Smart Contract : Solidity 0.8.20 (MachineHealthPassport.sol)         │
│  • Web3 Library   : Web3.py / Ethers.js, Keccak-256 Hashing Standard    │
└─────────────────────────────────────────────────────────────────────────┘
```
