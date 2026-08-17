# 🏭 EchoFactory: Unified Industrial Dashboard Walkthrough
### Alur Interaksi Dasbor Terpadu & Kepatuhan Batasan MVP (COMPFEST 18 AIC)
**Sub-Tema: Smart Manufacturing | Kepatuhan Teknis: Booklet Page 15**

---

## 📌 1. RINGKASAN EKSEKUTIF & KONSEP DASBOR

Dokumen ini memuat panduan alur interaksi (*walkthrough*) antarmuka dasbor **EchoFactory** yang dirancang untuk mengakomodasi seluruh kebutuhan *use case* dari 4 persona pengguna (**Operator Lapangan**, **Supervisor Maintenance**, **Manajer Pabrik**, dan **Auditor/Asuransi**) dalam satu konsol terpadu (**Unified Single-Screen Industrial Console**) **tanpa melanggar satu pun batasan teknis tahap penyisihan pada Booklet COMPFEST (Halaman 15)**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ECHOFACTORY UNIFIED CONSOLE                                      │
├───────────────────────────────────┬──────────────────────────────────────────────────────────────┤
│ 📥 INPUT TUNGGAL (Sinkron)        │ 📊 OUTPUT MULTI-STAKEHOLDER TERPADU (1 Layar Instan)         │
│ • Upload / Rekam Audio 10s        │ • [Operator]   : Spektrogram + Status Normal/Abnormal (<50ms)│
│ • Pilih Mesin (Fan/Pump/dll)      │ • [Supervisor] : Root Cause Diagnosis SOP ISO 10816          │
│ • Tombol Eksekusi Diagnosis       │ • [Manajer]    : Health Index Gauge & Risiko Downtime        │
│                                   │ • [Auditor]    : SHA-256 Hash & Bukti On-Chain Polygon Amoy  │
└───────────────────────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 🛡️ 2. MATRIKS KEPATUHAN TERHADAP ATURAN BOOKLET (PAGE 15)

Ketentuan resmi ruang lingkup MVP Tahap Penyisihan COMPFEST 18 menetapkan 3 batasan utama:

| Pilar Teknis | Ketentuan Resmi Booklet (Page 15) | Implementasi Dasbor EchoFactory | Status Kepatuhan |
|---|---|---|:---:|
| **1. Frontend (FE)** | • UI wajib hanya berfokus pada alur interaksi inti: menerima **input tunggal** dan menampilkan **output dari AI**.<br>• *Dilarang/tidak perlu*: Dashboard analitik multi-page, sistem otentikasi/login bertingkat, atau riwayat penggunaan masa lalu. | **Single-Screen Unified Console**: 1 halaman antarmuka tunggal tanpa login/role yang rumit. 1 input file audio langsung menghasilkan 4 panel informasi terpadu. | ✅ **100% COMPLIANT** |
| **2. Backend (BE)** | • Arsitektur backend wajib hanya sampai pada **pemrosesan interaksi sinkron**.<br>• *Dilarang/tidak perlu*: Background worker (Celery/Redis), pipeline logging otomatis berkala, atau distributed database. | **Single Synchronous REST API**: 1 endpoint sinkron `POST /api/v1/detect-acoustic` yang langsung merespons dalam 1 siklus request-response. | ✅ **100% COMPLIANT** |
| **3. Model AI** | • Implementasi AI wajib hanya berfokus pada **fungsionalitas inferensi utama (*core inference*)** dengan parameter statis.<br>• *Dilarang/tidak perlu*: Auto-tuning, bulk testing crawler, atau loop umpan balik otomatis. | **Static ONNX Model**: Menggunakan model **STgram-MFN v3 ONNX** (183.8 KB) dan KNN-k5 centroid statis yang deterministik dan ultra-cepat (<50ms). | ✅ **100% COMPLIANT** |

---

## 🖥️ 3. WIREFRAME & STRUKTUR DASBOR TERPADU (SINGLE-PAGE CONSOLE)

Dasbor didesain dalam tata letak **Split-Screen Console** (Panel Kiri untuk Input Tunggal, Panel Kanan untuk Output Terpadu):

```text
+--------------------------------------------------------------------------------------------------+
| 🏭 EchoFactory Industrial Console                [● Engine: STgram-MFN] [● Polygon Amoy: 80002]  |
+-----------------------------------+--------------------------------------------------------------+
| 📥 PANEL INPUT TUNGGAL (OPERATOR) │ 📊 PANEL OUTPUT TERPADU (MULTI-STAKEHOLDER)                 |
|                                   +--------------------------------------------------------------+
| 1. Pilih Unit Mesin:              | 👷 [WIDGET OPERATOR: Status Akustik & Audio]                 |
|    (o) Fan Industrial             |    • Status Kondisi : 🔴 ABNORMAL (Skor: 0.887 / Thresh: 0.5)|
|    ( ) Centrifugal Pump           |    • Spektrogram 2D : [ Mel-Spectrogram & Linear STFT Plot ] |
|    ( ) Linear Slider Rail         |    • Waktu Inferensi: 42.6 ms (Ultra Edge-Ready)             |
|    ( ) Solenoid Valve             +--------------------------------------------------------------+
|                                   | 👨‍💼 [WIDGET SUPERVISOR: Cognitive SOP & Action Plan]         |
| 2. Input Sampel Suara (10s):      |    • Anomali Komponen: Bearing Outer Race Defect (ISO 10816) |
|    +-------------------------+    |    • Rekomendasi SOP : Penggantian Pelumas ISO VG 46 & Cek   |
|    |  [📁 Unggah File .wav]  |    |                        Beban Getaran Aksial                 |
|    |        -- ATAU --       |    +--------------------------------------------------------------+
|    |  [🎙️ Rekam dari Mic]   |    | 🏭 [WIDGET MANAJER PABRIK: Health & Risk Index]             |
|    +-------------------------+    |    • Machine Health Score: 62% (Kondisi Degradasi Menengah)  |
|                                   |    • Tingkat Risiko      : ⚠️ Sedang (Est. Downtime Loss: $4.2k) |
| [ ⚡ JALANKAN DIAGNOSIS AI ]      +--------------------------------------------------------------+
|                                   | 🔍 [WIDGET AUDITOR & ASURANSI: Paspor On-Chain]              |
|                                   |    • Proof Hash   : 0x8f3c71a9e2d5b6... (SHA-256 Validated)  |
|                                   |    • Smart Contract: 0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864  |
|                                   |    • [🔗 Verifikasi Transaksi di PolygonScan Explorer]       |
+-----------------------------------+--------------------------------------------------------------+
```

---

## 🚶‍♂️ 4. STEP-BY-STEP USER JOURNEY WALKTHROUGH

### 🔹 Langkah 1: Input Tunggal (Single Input Ingestion)
1. Pengguna membuka antarmuka lokal di `http://localhost:3000`.
2. Pengguna memilih tipe mesin yang sedang diperiksa (*Fan*, *Pump*, *Slider*, atau *Valve*).
3. Pengguna mengunggah rekaman suara mesin 10 detik (`.wav` 16kHz) atau merekam langsung via mikrofon.
4. Pengguna menekan tombol **"⚡ Jalankan Diagnosis AI"**.

### 🔹 Langkah 2: Pemrosesan Inferensi Sinkron (<50ms)
1. Frontend mengirim berkas audio melalui REST API sinkron:
   ```http
   POST /api/v1/detect-acoustic HTTP/1.1
   Content-Type: multipart/form-data
   Payload: machine_type="fan" & audio_file="fan_sample_01.wav"
   ```
2. Engine backend mengekstraksi Mel-Spectrogram & Linear STFT, lalu mengeksekusi model **STgram-MFN v3 ONNX**.
3. Sistem menghitung jarak anomali terhadap baseline normal, merumuskan diagnosis SOP ISO 10816, serta membuat komitmen kriptografi paspor kesehatan mesin.

### 🔹 Langkah 3: Tampilan Output Menjawab 4 Persona Sekaligus
Hasil inferensi langsung di-render dalam satu layar tanpa perlu navigasi multi-halaman:

1. **Bagi Operator Lapangan**:
   * Menampilkan lampu indikator visual besar: **🟢 NORMAL** atau **🔴 ABNORMAL**.
   * Menampilkan visualisasi kurva spektrogram audio frekuensi tinggi.
2. **Bagi Supervisor Maintenance**:
   * Menampilkan rincian komponen mekanik yang dicurigai aus berdasarkan standar getaran ISO 10816.
   * Menampilkan panduan SOP tindakan perbaikan darurat (*preventive action plan*).
3. **Bagi Manajer Pabrik**:
   * Menampilkan persentase indeks kesehatan mesin (*Health Score Gauge*).
   * Menampilkan indikator risiko operasional untuk mencegah *unplanned downtime*.
4. **Bagi Auditor & Lembaga Asuransi**:
   * Menampilkan hash paspor kesehatan (*Tamper-Proof Audit Hash*).
   * Menyediakan tautan langsung (*hyperlink*) ke penjelajah blok **PolygonScan Amoy** untuk memverifikasi keaslian catatan riwayat mesin secara independen.

---

## 📡 5. SPESIFIKASI SKEMA DATA SINKRON (REST API)

### **Request Payload (Frontend ke Backend)**
```json
{
  "machine_type": "fan",
  "machine_id": "FAN-LINE-01",
  "audio_base64": "UklGRi4AAABXQVZFZm10IBAAAAABAAEA...",
  "sample_rate": 16000
}
```

### **Response Payload (Backend ke Frontend)**
```json
{
  "status": "success",
  "inference_time_ms": 42.6,
  "operator_view": {
    "condition": "ABNORMAL",
    "anomaly_score": 0.887,
    "threshold": 0.500,
    "confidence_level": "99.32%"
  },
  "supervisor_view": {
    "fault_type": "Bearing Outer Race Degradation",
    "iso_standard": "ISO 10816-3 Class II (Unacceptable Vibration)",
    "recommended_action": "Lumasi bearing dengan grease ISO VG 46 atau jadwalkan pergantian part #SKF-6204."
  },
  "manager_view": {
    "machine_health_percentage": 62.0,
    "risk_level": "MEDIUM_WARNING",
    "estimated_downtime_mitigated_usd": 4200
  },
  "auditor_view": {
    "proof_hash": "0x8f3c71a9e2d5b6a7c8e9f0123456789abcdef0123456789abcdef0123456789a",
    "smart_contract_address": "0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864",
    "network": "Polygon Amoy Testnet (Chain ID: 80002)",
    "polygonscan_url": "https://amoy.polygonscan.com/address/0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864"
  }
}
```

---

## 🎯 6. KESIMPULAN & NILAI UNGGUL

Dengan rancangan **Unified Single-Screen Industrial Console** ini:
1. **Kepatuhan Regulasi 100% Terpenuhi**: Repositori kode tidak terbebani oleh fitur kompleks di luar ruang lingkup penyisihan (tanpa auth rumit, tanpa background workers, tanpa multi-page routing).
2. **Kesiapan Uji Reproduksibilitas Juri (1-Click Run)**: Juri dapat menguji prototipe secara instan di lingkungan lokal melalui `docker compose up --build`.
3. **Dampak Bisnis Maksimal**: Seluruh narasi *pitchdeck* (Smart Manufacturing, Predictive Maintenance, Blockchain Tamper-Proof Passport) terbukti berfungsi secara nyata dan terintegrasi pada antarmuka prototipe.
