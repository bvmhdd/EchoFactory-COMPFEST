# 01. RINGKASAN EKSEKUTIF, LATAR BELAKANG & PROBLEM STATEMENT

**Tim Pengembang**: Aku Mau Fokus Hima Team  
**Produk Inovasi**: EchoFactory (Acoustic Machine Intelligence & Tamper-Proof Health Passport)  
**Kompetisi**: COMPFEST 18 AI Innovation Challenge (AIC) — Smart Manufacturing Track  

---

## 1. Executive Summary
**EchoFactory** adalah platform pemeliharaan prediktif (*Predictive Maintenance*) industri 4.0 generasi baru yang memadukan **AI Akustik Edge (STgram-MFN v3 ONNX)**, **Penalaran Kognitif Multimodal (Gemini 2.0 Flash RAG)**, **Standar Vibrasi Mekanik Internasional (ISO 10816-3)**, dan **Paspor Kesehatan Mesin Terdesentralisasi (Polygon Amoy Web3 Ledger)**.

Platform ini mentransformasi proses inspeksi suara mesin dari metode manual dan reaktif menjadi sistem inspeksi non-invasif yang otomatis, *real-time* (<25 ms), preskriptif, dan memiliki integritas data anti-manipulasi (*tamper-proof*).

Dikembangkan oleh **Aku Mau Fokus Hima Team**, EchoFactory dirancang untuk mengeliminasi *unplanned downtime* pabrik hingga 71%, menurunkan biaya pemantauan sensor hingga 90%, serta mengotomatisasi rantai pasok suku cadang dan audit klaim garansi mesin industri.

---

## 2. Problem Statement (Latar Belakang Masalah Industri)

Dalam ekosistem manufaktur modern (*Industry 4.0*), mesin berputar dan bergerak (*rotary & linear equipment*) seperti *Industrial Fan/Blower, Centrifugal Pump, Linear Slider Rail*, dan *Solenoid Valve* merupakan tulang punggung operasional pabrik. Kegagalan pada komponen-komponen kritis ini menimbulkan tiga krisis utama:

### A. Kerugian Finansial Akibat *Unplanned Downtime*
- Waktu henti mendadak (*unplanned downtime*) pada lini produksi manufaktur bernilai kerugian rata-rata **$260.000 (sekitar Rp 4,1 Miliar) per jam**.
- Kerusakan komponen mikro (seperti keausan bantalan *bearing*, keausan bilah, atau kavitasi impeler) sering kali luput dari pemantauan berkala hingga mesin mengalami kerusakan total (*catastrophic failure*).

### B. Keterbatasan Sensor Getaran Kontak (*Vibration Accelerometer*) Tradisional
- **Invasif & Berbahaya**: Pemasangan sensor piezoelektrik konvensional mengharuskan kontak fisik langsung pada bodi mesin bersuhu tinggi, bertegangan tinggi, atau berputar cepat.
- **Biaya Hardware Sangat Mahal**: Pemasangan sensor kabel permanen di setiap titik mesin membutuhkan biaya instalasi (*wiring & data acquisition system*) mencapai belasan juta rupiah per titik, sehingga mustahil diterapkan pada skala ribuan mesin UKM/pabrik menengah.
- **Deteksi Terlambat**: Perubahan getaran makro biasanya baru terdeteksi pada fase kerusakan akhir. Sebaliknya, gesekan frekuensi tinggi menghasilkan **sinyal emisi akustik abnormal** 2–4 minggu jauh lebih awal.

### C. Silo Data & Kerentanan Manipulasi Log (*Tamper-Prone Records*)
- Catatan pemeliharaan dan inspeksi teknisi saat ini masih berbasis kertas, spreadsheet, atau database lokal yang mudah dimodifikasi (*fraudulent logs*).
- Ketiadaan verifikasi independen menyulitkan pabrik saat mengajukan klaim garansi ke pihak OEM (*Original Equipment Manufacturer*) atau klaim ke pihak asuransi industri, yang sering berujung pada sengketa (*dispute*).

---

## 3. Value Proposition (Nilai Kebaruan & Solusi EchoFactory)

EchoFactory menghadirkan **4 Pilar Nilai Terpadu**:

| Pilar | Deskripsi Teknologi | Keunggulan Dibanding Solusi Eksisting |
|---|---|---|
| **1. Non-Invasive Acoustic Edge AI** | Menangkap emisi akustik frekuensi tinggi mesin melalui mikrofon MEMS tanpa sentuh dan memprosesnya dengan arsitektur **STgram-MFN v3 ONNX Runtime**. | Deteksi dini <25 ms tanpa pasang kabel fisik pada mesin; biaya sensor turun hingga 90% (1 mic untuk beberapa mesin). |
| **2. Cognitive SOP & Root Cause Analysis** | Menggabungkan penalaran Multimodal **Gemini 2.0 Flash RAG** dengan aturan standardisasi getaran **ISO 10816-3**. | Bukan sekadar angka anomali, melainkan analisis akar masalah naratif, estimasi *Remaining Useful Life* (RUL), dan alokasi suku cadang ERP otomatis. |
| **3. Decentralized Health Passport** | Setiap rekaman inspeksi di-hash kriptografis SHA-256 dan dicatat ke *Smart Contract* **Polygon Amoy Testnet (Chain ID: 80002)**. | Riwayat seumur hidup mesin bersifat abadi (*immutable*), transparan, dan mendukung klaim garansi parametrik instan tanpa sengketa. |
| **4. Multi-Stakeholder Unified Interface** | Konsol terpadu yang memecah informasi kompleks ke dalam 4 sudut pandang: Operator, Supervisor, Plant Manager, dan Auditor. | Menghilangkan silo komunikasi antar divisi pabrik dari lantai operasi (*shop floor*) hingga level manajemen dan auditor eksternal. |
