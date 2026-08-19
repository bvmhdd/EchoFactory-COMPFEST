# 02. USE CASES, 4-PERSONA BREAKDOWN & USER JOURNEY

## 1. Daftar Use Case Industri (UC-01 s.d. UC-08)

EchoFactory mencakup 8 skenario operasional pabrik yang terintegrasi penuh:

```
                  ┌──────────────────────────────────────────────────┐
                  │          ECHOFACTORY INDUSTRIAL WORKFLOW         │
                  └──────────────────────────────────────────────────┘
                                           │
       ┌─────────────────┬─────────────────┼─────────────────┬─────────────────┐
       ▼                 ▼                 ▼                 ▼                 ▼
  [ UC-01/02 ]      [ UC-03 ]         [ UC-04/05 ]      [ UC-06 ]         [ UC-07/08 ]
  Acoustic Edge    Voice Assistant    Cognitive RCA    Fleet Health       Blockchain
  Ingest & Scan     for Technician    & ERP Dispatch    & ROI Metrics     Passport/Claim
```

### UC-01: Ingesti & Pindai Suara Mesin Non-Kontak (*Acoustic Ingestion*)
- **Aktor**: Operator Pabrik / Teknisi Lapangan.
- **Deskripsi**: Operator merekam audio emisi mesin selama 10 detik menggunakan mikrofon smartphone/tablet industri atau mengunggah rekaman suara.
- **Output**: Spektrogram visual interaktif, skor anomali, dan status kelayakan (*PASS / ALERT*).

### UC-02: Auto-Detection Mesin & Profiling Kebisingan Latar (*SNR Profiler*)
- **Aktor**: Sistem AI Edge.
- **Deskripsi**: Sistem secara otomatis mengenali tipe mesin (Fan, Pump, Slider, Valve) berdasarkan *fingerprint* akustik dan mengestimasi tingkat kebisingan lingkungan (*Signal-to-Noise Ratio: -6dB, 0dB, +6dB*) untuk kalibrasi *threshold* adaptif.

### UC-03: Industrial Voice Assistant (Interaksi Suara Hands-Free)
- **Aktor**: Teknisi Lapangan saat bekerja dengan alat pelindung diri (APD).
- **Deskripsi**: Teknisi mengajukan pertanyaan suara (contoh: *"Echo, bagaimana kondisi vibrasi Fan 00 saat ini?"*) dan menerima jawaban instan mengenai status kesehatan dan riwayat mesin.

### UC-04: Diagnosis Akar Masalah Kognitif (*Multimodal Root Cause Reasoning*)
- **Aktor**: Maintenance Supervisor / Lead Engineer.
- **Deskripsi**: Ketika mesin terdeteksi anomali, sistem memicu penalaran Gemini Flash yang mengkorelasikan spektrum frekuensi dengan standar vibrasi ISO 10816-3 untuk mendiagnosis jenis kerusakan spesifik (misal: *Inner Race Bearing Fault / Cavitation*).

### UC-05: Estimasi Sisa Usia Pakai (RUL) & Penerbitan Tiket Perbaikan ERP
- **Aktor**: Maintenance Supervisor.
- **Deskripsi**: Sistem mengestimasi *Remaining Useful Life* (RUL) dalam satuan jam operasional dan otomatis memilih suku cadang yang tepat dari inventaris gudang ERP/SAP untuk diterbitkan menjadi *Work Order* resmi.

### UC-06: Monitoring Kesehatan Armada & Analisis Penghematan Finansial (*ROI Metric*)
- **Aktor**: Plant Manager / Direktur Operasional.
- **Deskripsi**: Menyajikan metrik reliabilitas armada (*Fleet Reliability Index %*), grafik degradasi 30 hari, estimasi jam *downtime* yang berhasil dicegah, dan estimasi biaya perbaikan yang dihemat (dalam Rupiah).

### UC-07: Penerbitan Paspor Kesehatan On-Chain (*Decentralized Health Ledger*)
- **Aktor**: Sistem AI, Operator, dan Auditor Independen.
- **Deskripsi**: Setiap hasil pemindaian otomatis di-hash kriptografis dan dicatat ke *Smart Contract* Polygon Amoy Testnet sebagai bukti inspeksi permanen tanpa risiko manipulasi.

### UC-08: Klaim Garansi & Asuransi Parametrik Otomatis (*Parametric Claim Portal*)
- **Aktor**: Plant Manager, OEM Produsen Mesin, dan Perusahaan Asuransi.
- **Deskripsi**: Pengajuan klaim garansi kerusakan yang diverifikasi secara otomatis berdasarkan kepatuhan histori inspeksi on-chain tanpa memerlukan investigasi manual berkepanjangan.

---

## 2. Struktur 4-Persona Pemangku Kepentingan

| Persona | Fokus Utama | Pertanyaan Kunci yang Dijawab | Fitur di EchoFactory |
|---|---|---|---|
| **1. Operator Lapangan** | Kemudahan pemindaian & kecepatan respons | *"Apakah mesin ini aman untuk tetap beroperasi sekarang?"* | • Lampu Indikator Status Hijau/Merah<br>• Spektrogram Audio Visual<br>• Voice Assistant Hands-Free |
| **2. Maintenance Supervisor** | Presisi diagnosis & alokasi teknisi | *"Apa komponen yang rusak dan tindakan perbaikan apa yang harus dilakukan?"* | • Analisis Akar Masalah Gemini Flash<br>• Klasifikasi Zona ISO 10816-3<br>• Auto-Dispatch Work Order ERP |
| **3. Plant Manager** | Efisiensi biaya & keandalan pabrik | *"Berapa kerugian downtime yang berhasil kita cegah bulan ini?"* | • Fleet Health Reliability Index (%)<br>• Grafik Tren Getaran 30 Hari<br>• Metrik Estimasi Biaya Terhindar (Rp) |
| **4. Auditor & Asuransi** | Integritas data & validasi kepatuhan | *"Apakah prosedur inspeksi dipatuhi secara sah dan tanpa manipulasi?"* | • On-Chain Inspection Ledger (Polygon Amoy)<br>• Tautan Transaksi PolygonScan<br>• Klaim Garansi Parametrik Otomatis |

---

## 3. End-to-End User Journey (Alur Perjalanan Pengguna)

```
[LANGKAH 1] Operator merekam suara mesin Fan #00 menggunakan mic smartphone.
    │
[LANGKAH 2] STgram-MFN v3 menganalisis audio dalam 38ms.
    │       Hasil: Skor Anomali 0.0842 (Melebihi Threshold 0.050) -> Status: ABNORMAL.
    │
[LANGKAH 3] Bukti inspeksi otomatis di-hash (Keccak-256) dan dicatat ke Polygon Amoy.
    │
[LANGKAH 4] Notifikasi diteruskan ke Supervisor.
    │       Supervisor membuka tab Diagnosis:
    │       - Gemini Flash: "Terdeteksi Bearing Inner Race Defect pada SNR +6dB."
    │       - Standar: ISO 10816-3 Zone C (Unsatisfactory).
    │       - Sisa Usia Pakai (RUL): 168 Jam Operasi.
    │       - Suku Cadang: SKF-6204 Bearing (Gudang B - Rak 04).
    │
[LANGKAH 5] Supervisor menekan tombol "Terbitkan Work Order". Tiket perbaikan resmi dikirim ke teknisi shift.
    │
[LANGKAH 6] Plant Manager memantau grafik armada: 14.2 jam downtime dicegah, estimasi penghematan Rp 284 Juta.
    │
[LANGKAH 7] Jika terjadi klaim garansi ke OEM, Auditor membuka Paspor On-Chain untuk memvalidasi kepatuhan inspeksi tanpa sengketa.
```
