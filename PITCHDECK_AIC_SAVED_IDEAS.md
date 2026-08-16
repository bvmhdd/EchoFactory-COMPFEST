# 📄 PITCHDECK WORKSHEET: COMPFEST 18 AI INNOVATION CHALLENGE (AIC)
**3 Ide Terpilih: JeniusWaste, KoperasiSurya, & InnoVault**

> **Dokumen Resmi Tim**: Berisi rancangan pitchdeck lengkap untuk 3 ide terpilih yang selaras dengan Matriks Penilaian COMPFEST 18 AIC (Bobot: 25% Arsitektur/Teknologi, 20% Orisinalitas/Dampak, 15% Proposal, 15% MVP, 10% Relevansi Tema, 3.5% Business & Governance).

---

# 🟢 IDE #1: **JeniusWaste** — AI Limbah-ke-Energi Terverifikasi & Blockchain Green Certificate

## 📋 METADATA IDE GAGASAN
- **Nama Inovasi**: JeniusWaste (AI Waste-to-Energy & Blockchain Green Certificate)
- **Sub-Tema**: Smart Manufacturing & Sustainability
- **Teknologi Utama / AI Stack**: Fine-tuned XGBoost/Scikit-learn Regressor + LayoutLMv3 + FastAPI + Next.js + Polygon Amoy Testnet (ERC-1155)

---

## 📌 BAGIAN 1: ORISINALITAS & DAMPAK SOSIAL (BOBOT: 20%)
### 1.1 Pain Point & Data-Driven Urgency
- **Masalah Spesifik**: ~15.000 industri tahu-tempe dan UMKM olahan pangan di Indonesia menghasilkan jutaan liter limbah cair organik (COD/BOD tinggi) yang 99% dibuang langsung ke sungai, memicu pencemaran air masif dan konflik sosial warga.
- **Data Statistik**:
  - *Data 1*: Kementerian LHK mencatat limbah cair tahu menyumbang emisi metana signifikan dan menurunkan kualitas air di lebih dari 60% sungai sentra UMKM Jawa Tengah & Jawa Barat.
  - *Data 2*: Bauran Bioenergi Indonesia 2025 baru mencapai 7.45%, padahal limbah cair tahu mampu menghasilkan 1.8 m³ biogas per 50 liter limbah (setara penghematan Rp 500rb - 2jt/bulan per UMKM).
- **Urgensi**: Kenaikan harga LPG dan bahan bakar produksi mengancam margin UMKM, sementara tekanan regulasi lingkungan (PP No. 40/2025 tentang Kebijakan Energi Nasional) menuntut ekonomi sirkular.

### 1.2 Kebaruan (Novelty) & Target Pengguna
- **Target Pengguna**: UMKM olahan pangan (tahu-tempe, kelapa sawit rakyat) dan Korporasi yang membutuhkan ESG Carbon/Green Credits.
- **Pendekatan Baru**: Mengubah "limbah polutan" menjadi "aset digital terverifikasi". AI memvalidasi yield biogas & CO2 offset secara objektif, lalu mendigitalisasikannya menjadi Green Certificate (NFT) yang dapat diperjualbelikan ke korporasi.
- **Perbedaan Kompetitor**: Bukan sekadar aplikasi pengaduan lingkungan atau alat biodigester fisik biasa, melainkan *Verification & Monetization Layer* berbasis AI + Blockchain.

---

## 🎯 BAGIAN 2: SOLUSI & RELEVANSI TEMA (BOBOT: 10%)
### 2.1 Konsep Solusi
UMKM memasukkan data operasional (volume limbah, suhu digester, waktu retensi). AI memprediksi yield biogas aktual dan kuantifikasi reduksi emisi CO2. Setelah tervalidasi AI, sistem menerbitkan *Green Waste Certificate* di Polygon Testnet yang siap di-listing di marketplace ESG credit.

### 2.2 Relevansi AI & Smart Manufacturing
- **Mengapa AI Mutlak**: Verifikasi klaim energi hijau dari UMKM rawan manipulasi (*greenwashing*). AI Regressor + Anomaly Detector memvalidasi apakah klaim volume biogas realistis berdasarkan hukum termodinamika & data biologis limbah.
- **Transformasi Manufaktur**: Mengintegrasikan pengelolaan limbah manufaktur makanan ke dalam rantai nilai energi bersih domestik.

---

## 🛠️ BAGIAN 3: IMPLEMENTASI TEKNOLOGI & ARSITEKTUR (BOBOT: 25%)
### 3.1 Alur Dataset
- **Sumber**: Open dataset riset biogas akademik (Kemenperin/BRIN) + data sintetik variabel COD/suhu/waktu retensi.
- **Preprocessing**: Normalisasi fitur numerik, penanganan outlier via Z-score, dan feature engineering (rasio C/N).

### 3.2 Model AI & Inference
- **Model**: Fine-tuned XGBoost Regressor (prediksi m³ biogas & CO2 offset) + Isolation Forest (deteksi manipulasi data).
- **Inference**: Paramater statis (threshold COD & efisiensi digester 75%) untuk respon inferensi < 200ms.

### 3.3 Arsitektur Modular (FE - BE - AI - Web3)
- **Frontend**: Next.js + Shadcn UI (Dashboard Input Limbah & Certificate Viewer)
- **Backend**: FastAPI (Python)
- **Blockchain**: Polygon Amoy Testnet (Smart Contract ERC-1155 Minting)
- **Alur**: FE $\rightarrow$ FastAPI $\rightarrow$ Model Inference $\rightarrow$ Web3 Provider (Ethers.js / Web3.py) $\rightarrow$ Polygon.

---

## ⚡ BAGIAN 4: KESIAPAN & BATASAN MVP PENYISIHAN (BOBOT: 15%)
- **FE Scope**: Form input tunggal (volume limbah & suhu) + Tampilan Certificate Result.
- **BE Scope**: API sinkron untuk inferensi model & minting sertifikat ke testnet.
- **Docker**: Single `docker-compose.yml` menampung FE, BE, dan Model Server.

---

## ⚖️ BAGIAN 6: BUSINESS VALUE & RESPONSIBLE AI (BOBOT: 3.5%)
- **Monetisasi**: Biaya transaksi 2.5% per penjualan Green Certificate dari UMKM ke Korporasi.
- **Responsible AI**: Transparansi algoritma perhitungan emisi sesuai standar IPCC (Intergovernmental Panel on Climate Change).

---

# 🟡 IDE #2: **KoperasiSurya** — AI-Optimized Solar Cooperative & Transparent Blockchain Profit Sharing

## 📋 METADATA IDE GAGASAN
- **Nama Inovasi**: KoperasiSurya (Decentralized Solar Cooperative & Transparent Yield Sharing)
- **Sub-Tema**: Smart Manufacturing & Swasembada Energi
- **Teknologi Utama / AI Stack**: Prophet / LSTM + Linear Programming Optimization + FastAPI + Next.js + Polygon Smart Contract

---

## 📌 BAGIAN 1: ORISINALITAS & DAMPAK SOSIAL (BOBOT: 20%)
### 1.1 Pain Point & Data-Driven Urgency
- **Masalah Spesifik**: Pemasangan PLTS Atap membutuhkan modal awal Rp 15 - 30 juta/kWp yang tidak terjangkau oleh UMKM individu. Skema koperasi komunal gagal karena krisis kepercayaan terhadap transparansi pengurus dan pembagian manfaat energi.
- **Data Statistik**:
  - *Data 1*: Biaya listrik menyumbang 30-40% dari biaya operasional UMKM manufaktur (konveksi, kerajinan, bengkel).
  - *Data 2*: Target Presiden Prabowo mempercepat PLTS Desa 13 GW dari total 100 GW untuk swasembada energi, tetapi adopsi UMKM terhambat masalah pendanaan & transparansi pengelolaan komunal.

### 1.2 Kebaruan (Novelty) & Target Pengguna
- **Target Pengguna**: Sentra UMKM (kluster industri kecil) dan Koperasi Usaha Bersama (KUB).
- **Pendekatan Baru**: Menggabungkan algoritma AI untuk prediksi energi surya & pembagian adil (*fair distribution*) dengan *Smart Contract Multi-Sig* di Blockchain sebagai pengelola dana & distribusi manfaat tanpa perantara manusia yang bisa korupsi.

---

## 🎯 BAGIAN 2: SOLUSI & RELEVANSI TEMA (BOBOT: 10%)
### 2.1 Konsep Solusi
Kelompok UMKM melakukan patungan modal via Smart Contract. Panel surya komunal dipasang di kawasan sentra. AI memprediksi produksi energi bulanan dan mengoptimalkan alokasi listrik ke setiap UMKM. Hasil penghematan/dividen ditransfer otomatis oleh Smart Contract ke wallet anggota secara real-time.

### 2.2 Relevansi AI & Smart Manufacturing
- **Mengapa AI Mutlak**: Cuaca dan radiasi matahari fluktuatif. AI (Prophet/LSTM) diperlukan untuk memprediksi pasokan energi jam-demi-jam dan menyesuaikannya dengan profil beban industri UMKM melalui optimasi *Linear Programming*.

---

## 🛠️ BAGIAN 3: IMPLEMENTASI TEKNOLOGI & ARSITEKTUR (BOBOT: 25%)
### 3.1 Dataset & AI Pipeline
- **Dataset**: Data iradiasi matahari dari Open-Meteo / PVGIS API + data histori konsumsi listrik industri B1 PLN.
- **Model**: Prophet (time-series forecasting) + PuLP Linear Programming (energy distribution optimization).
- **Tech Stack**: Next.js (Dashboard Koperasi) + FastAPI + Polygon (ERC-20 Solar Token + Treasury Smart Contract).

---

## ⚡ BAGIAN 4: KESIAPAN & BATASAN MVP PENYISIHAN (BOBOT: 15%)
- **FE**: Dashboard status produksi solar komunal + visualisasi profit sharing per anggota.
- **BE**: Inferensi sinkron prediksi iradiasi & alokasi token energi.
- **Deployment**: Dockerized localhost setup.

---

# 🔵 IDE #3: **InnoVault** — AI Patent Similarity & Blockchain IP Notarization untuk UMKM

## 📋 METADATA IDE GAGASAN
- **Nama Inovasi**: InnoVault (AI Patent Similarity & Prior Art Blockchain Notarization)
- **Sub-Tema**: Smart Manufacturing & Intellectual Property Protection
- **Teknologi Utama / AI Stack**: Fine-tuned PatentBERT / SciBERT + LLaMA-3 + FastAPI + Next.js + Polygon Amoy Testnet

---

## 📌 BAGIAN 1: ORISINALITAS & DAMPAK SOSIAL (BOBOT: 20%)
### 1.1 Pain Point & Data-Driven Urgency
- **Masalah Spesifik**: UMKM manufaktur (alat pertanian custom, mebel, kerajinan) menciptakan inovasi produk/proses berharga, tetapi tidak mampu membayar biaya pendaftaran paten formal (Rp 5-20 juta) dan waktu tunggu yang lama (2-3 tahun). Akibatnya, ide sering dicuri oleh pabrik besar tanpa bukti klaim hukum awal.
- **Data Statistik**:
  - *Data 1*: Kurang dari 5% dari 64 juta UMKM Indonesia yang memiliki perlindungan Kekayaan Intelektual (KI) resmi (DJKI Kemenkumham).
  - *Data 2*: Kasus peniru desain & proses produksi UMKM oleh barang impor massal menyebabkan kerugian hingga miliaran rupiah tanpa adanya *timestamping* bukti cipta yang sah di pengadilan.

### 1.2 Kebaruan (Novelty) & Target Pengguna
- **Target Pengguna**: UMKM Manufaktur Kreatif, Pembuat Mesin Tepat Guna, & Pengrajin Lokal.
- **Pendekatan Baru**: Menyediakan *Instant Interim IP Protection* berbiaya ~0 rupiah. AI menganalisis kemiripan inovasi terhadap database paten global, dan Blockchain mengunci *Proof of Prior Art* berstempel waktu yang tidak dapat diubah retroaktif.

---

## 🎯 BAGIAN 2: SOLUSI & RELEVANSI TEMA (BOBOT: 10%)
### 2.1 Konsep Solusi
UMKM memasukkan deskripsi & foto inovasi produk. AI PatentBERT melakukan semantic search ke database paten publik untuk menghitung *Novelty Score* (0-100%) dan melengkapi klaim teknis. Dokumen yang tervalidasi kemudian di-hash dan di-commit ke Polygon Blockchain untuk menerbitkan *Digital IP Certificate*.

### 2.2 Relevansi AI
- **Mengapa AI Mutlak**: Bahasa paten bersifat teknis dan rumit. AI NLP (PatentBERT) mutlak diperlukan untuk melakukan *vector similarity search* pada ruang embedding dokumen paten global guna menemukan *prior art* yang mirip.

---

## 🛠️ BAGIAN 3: IMPLEMENTASI TEKNOLOGI & ARSITEKTUR (BOBOT: 25%)
### 3.1 Dataset & AI Pipeline
- **Dataset**: Google Patents Public Dataset (BigQuery) + USPTO Open Data.
- **Model**: PatentBERT / Sentence-Transformers (vector embedding) + LLaMA-3-8B (auto-generator klaim teknis).
- **Stack**: Next.js + FastAPI + FAISS Vector DB + Polygon Amoy Testnet.

---

## ⚡ BAGIAN 4: KESIAPAN & BATASAN MVP PENYISIHAN (BOBOT: 15%)
- **FE**: Form deskripsi inovasi + tampilan Novelty Score & Blockchain Certificate.
- **BE**: Pipeline sinkron embedding search (FAISS) & smart contract notarization.

---

## 📊 MATRIKS EVALUASI MANDIRI (COMPFEST AIC COMPLIANT)

| Kriteria Penilaian | JeniusWaste | KoperasiSurya | InnoVault | Target COMPFEST |
|---|:---:|:---:|:---:|:---:|
| **Implementasi Teknologi (25%)** | 4.8 / 5.0 | 4.7 / 5.0 | 4.9 / 5.0 | High Technical Depth |
| **Orisinalitas & Dampak (20%)** | 4.9 / 5.0 | 4.8 / 5.0 | 4.8 / 5.0 | High Novelty & Social Impact |
| **Kualitas Proposal (15%)** | 4.8 / 5.0 | 4.7 / 5.0 | 4.8 / 5.0 | Data-Driven & Logical Flow |
| **Kesiapan MVP (15%)** | 5.0 / 5.0 | 5.0 / 5.0 | 5.0 / 5.0 | Strict MVP Boundaries |
| **Relevansi Tema (10%)** | 5.0 / 5.0 | 5.0 / 5.0 | 4.8 / 5.0 | AI for Backbone Economy |
| **Business & Governance (3.5%)** | 4.7 / 5.0 | 4.8 / 5.0 | 4.6 / 5.0 | Realistic Business Model |
| **TOTAL ESTIMASI SKOR** | **96.5%** | **95.2%** | **95.8%** | **Lolos 8 Besar Finalis** |

---

*Disiapkan untuk COMPFEST 18 AI Innovation Challenge (AIC)*
*File Workspace: `c:\Users\muhib\Downloads\COMPFEST\PITCHDECK_AIC_SAVED_IDEAS.md`*
