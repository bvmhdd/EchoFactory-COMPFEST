# 🎤 SAVED IDEA: VoiceLog
## AI Laporan Produksi dari Suara — COMPFEST 18 AIC

---

### 📋 METADATA
- **Nama Inovasi**: VoiceLog — Voice-to-Structured Production Log with Blockchain Immutability
- **Sub-Tema**: Smart Manufacturing (Factory Floor Operations)
- **AI Stack**: Fine-tuned Whisper Small (ASR Bahasa Indonesia) + Fine-tuned IndoBERT (NLP Extraction) + XGBoost (Anomaly Detection) + FastAPI + Next.js + Polygon Amoy Testnet
- **Dataset Utama**: Mozilla Common Voice ID (free, public) + Sintetik factory vocab Bahasa Indonesia

---

### 🇮🇩 KEBIASAAN INDONESIA YANG DISELESAIKAN
> Laporan produksi harian di pabrik Indonesia mayoritas masih manual (kertas/Excel).
> Operator mengisi angka "berdasarkan perasaan" atau mengarang karena takut kena marah jika target tidak tercapai.
> Pabrik tidak pernah punya data produksi yang benar.

---

### 💡 KONSEP UTAMA
> *"Setiap jam operator harus isi form laporan: berapa unit jadi, berapa reject, mesin down berapa menit. Tapi karena tekanan target, mereka isi angka kira-kira atau bahkan mengarang. VoiceLog membiarkan operator cukup ngomong — AI yang isi datanya, blockchain yang kunci kebenarannya."*

**Insight kunci**: Input termudah bagi operator Indonesia adalah SUARA dalam Bahasa Indonesia. Bukan keyboard, bukan touchscreen, bukan barcode scanner.

---

### 📊 PAIN POINT & DATA (2025)
| Data | Fakta |
|---|---|
| Metode laporan pabrik Indonesia | Mayoritas manual (kertas/Excel) — terutama skala menengah/kecil |
| Masalah utama | Data tidak real-time, tidak akurat, diisi "berdasarkan perasaan" bukan aktual |
| Budaya "takut kena marah" | Operator tidak berani lapor downtime/reject tinggi → data produksi palsu |
| Biaya keputusan salah | Manajemen buat keputusan produksi berdasar data kemarin yang sudah basi |

---

### 🔄 ALUR MVP

```
INPUT: Operator tekan tombol di HP → Bicara:
"Shift pagi, mesin 3, sudah jadi 420 unit, reject 12, downtime 15 menit gara-gara belt putus"

AI PIPELINE:
  1. Fine-tuned Whisper Small (ASR noise-robust Bahasa Indonesia)
     → Transkripsi suara → teks akurat meski ada noise lantai pabrik
  2. Fine-tuned IndoBERT (Information Extraction NLP)
     → Extract entitas: { shift, mesin, output, reject, downtime_min, reason }
  3. Anomaly & Validation Layer (XGBoost)
     → Validasi vs. kapasitas mesin baseline
     → Deteksi pola manipulasi historis (reject selalu 0, output selalu bulat)

BLOCKCHAIN (Polygon Amoy Testnet):
  → Hash audio + data terstruktur → commit on-chain (IMMUTABLE)
  → Tidak bisa diedit retroaktif → "sumber kebenaran tunggal"
  → Smart Contract → jika downtime > threshold → auto-notifikasi maintenance

OUTPUT:
  Ngomong → transkripsi → data terstruktur → dashboard real-time + anomali flag
```

---

### 🛠️ TECH STACK
| Layer | Tech |
|---|---|
| Frontend | Next.js (voice recorder + live dashboard + anomaly alerts) |
| Backend | FastAPI |
| AI | Whisper Small fine-tuned (ASR) + IndoBERT (NLP) + XGBoost (anomaly) |
| Dataset | Mozilla Common Voice ID + sintetik factory vocabulary |
| Blockchain | Polygon Amoy Testnet |

---

### 📊 EVALUASI 5 BINTANG
| Novelty | Relevansi Masyarakat | Feasibility MVP | AI Depth |
|:---:|:---:|:---:|:---:|
| ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Novelty**: Voice → structured production log + manipulation detection = belum pernah ada di hackathon Indonesia
**Relevansi**: Masalah laporan manual ada di SETIAP pabrik Indonesia
**Feasibility**: Whisper tersedia, IndoBERT mature, Common Voice ID gratis
**AI Depth**: ASR noise-robust + domain NLP + anomaly detection = triple AI pipeline

---

### 💬 PITCH HOOK
> *"Setiap hari operator pabrik mengisi laporan yang mereka karang. Bukan karena nakal — tapi karena sistemnya memaksa mereka berbohong. VoiceLog membiarkan operator cukup ngomong — AI yang isi datanya, blockchain yang kunci kebenarannya."*

---

*Saved for COMPFEST 18 AIC | Smart Manufacturing Sub-Theme | August 2026*
