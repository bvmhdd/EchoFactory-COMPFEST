# 🎙️ SAVED IDEA: ApelAI
## AI yang Capture & Struktur Briefing Shift / Apel Pagi Pabrik — COMPFEST 18 AIC

---

### 📋 METADATA
- **Nama Inovasi**: ApelAI — Shift Briefing Intelligence & Blockchain Safety Audit Trail
- **Sub-Tema**: Smart Manufacturing (Factory Floor K3 & Operations)
- **AI Stack**: Fine-tuned Whisper Small (ASR Bahasa Indonesia) + Fine-tuned IndoBERT/Mistral (Structured NLP Extraction) + FastAPI + Next.js + Polygon Amoy Testnet
- **Dataset Utama**: Sintetik factory briefing scripts Bahasa Indonesia + Mozilla Common Voice ID

---

### 🇮🇩 KEBIASAAN INDONESIA YANG DISELESAIKAN
> **"Apel pagi" atau "briefing shift"** adalah ritual wajib di hampir semua pabrik Indonesia.
> Supervisor berdiri, bicara verbal 10-15 menit sebelum produksi: target, machine status, safety reminder.
> Format: **100% verbal. 0% terdokumentasi.**
> Jika kecelakaan terjadi → tidak ada yang bisa buktikan apakah safety sudah disampaikan.

---

### 💡 KONSEP UTAMA
> *"462.000 kecelakaan kerja terjadi tahun lalu. Di pengadilan, perusahaan selalu bilang 'sudah diingatkan di apel'. Tidak ada yang bisa buktikan. ApelAI mengubah ritual verbal 15 menit itu menjadi bukti hukum yang tersimpan di blockchain — tidak bisa dipalsukan."*

---

### 📊 PAIN POINT & DATA (2025)
| Data | Fakta |
|---|---|
| Kecelakaan kerja 2024 | 462.241 kasus (Kemnaker/BPJS Ketenagakerjaan) |
| Sektor manufaktur | Menyumbang 26% dari total kasus kecelakaan |
| Masalah dokumentasi apel | 100% verbal, tidak ada rekaman, tidak ada transkrip, tidak ada audit trail |
| Konsekuensi hukum | Jika kecelakaan terjadi: tidak bisa buktikan apakah safety briefing sudah disampaikan |
| Masalah konsistensi | Supervisor berbeda → standard penyampaian berbeda → info tidak konsisten |

---

### 🔄 ALUR MVP

```
INPUT: Supervisor tekan "mulai rekam" di HP sebelum apel → bicara seperti biasa → "selesai"

AI PIPELINE:
  1. Fine-tuned Whisper Small (ASR noise-robust Bahasa Indonesia)
     → Transkripsi audio briefing → robust terhadap noise mesin pabrik di latar belakang
  2. Structured Extraction NLP (Fine-tuned IndoBERT / Mistral)
     → Extract entitas terstruktur:
       { targets: {line_1: 500, line_3: 320},
         machine_issues: ["belt mesin 5 kendur"],
         safety_reminders: ["wajib pakai sarung tangan area press"],
         material_notes: ["bahan batch B7 mulai hari ini"] }
     → Generate ringkasan terformat otomatis
  3. Completeness Checker
     → Apakah semua elemen wajib sudah disampaikan? (target, safety, machine status)
     → Alert: "⚠️ Tidak ada safety reminder hari ini — wajib diulang"
     → Completeness Score: "Briefing hari ini: 87% lengkap"

BLOCKCHAIN (Polygon Amoy Testnet):
  → Hash audio + transkrip + structured data → commit per shift (IMMUTABLE)
  → Record: "Pada shift pagi tanggal X, safety reminder 'sarung tangan area press'
    TELAH/TIDAK disampaikan"
  → Jika terjadi kecelakaan → BPJS/Kemnaker verifikasi on-chain: apakah hazard sudah disampaikan?
  → Smart Contract: jika safety completeness score < 70% → auto-alert HSE Manager

OUTPUT:
  Rekam apel 15 menit → AI: transkrip + structured summary card +
  completeness checker → blockchain record locked per shift
```

---

### 🛠️ TECH STACK
| Layer | Tech |
|---|---|
| Frontend | Next.js (rekam + structured summary + history + completeness dashboard) |
| Backend | FastAPI |
| AI | Fine-tuned Whisper Small (ASR) + IndoBERT/Mistral (extraction) |
| Dataset | Sintetik factory briefing script + Mozilla Common Voice ID |
| Blockchain | Polygon Amoy Testnet |

---

### 📊 EVALUASI 5 BINTANG
| Novelty | Relevansi Masyarakat | Feasibility MVP | AI Depth |
|:---:|:---:|:---:|:---:|
| ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Novelty**: AI untuk "apel pagi pabrik Indonesia" = tidak ada di hackathon manapun di dunia
**Relevansi**: Apel pagi ada di SETIAP pabrik Indonesia, terkait langsung isu K3 dan 462rb kasus kecelakaan
**Feasibility**: Whisper + IndoBERT sangat mature, synthetic script dataset mudah dibuat
**AI Depth**: Noise-robust ASR + multi-entity structured extraction + completeness scoring = triple AI

---

### 💬 PITCH HOOK
> *"462.000 kecelakaan kerja terjadi tahun lalu. Di pengadilan, perusahaan selalu bilang 'sudah diingatkan di apel'. Tidak ada yang bisa buktikan. ApelAI mengubah ritual verbal 15 menit itu menjadi bukti hukum yang tersimpan di blockchain — tidak bisa dipalsukan."*

---

*Saved for COMPFEST 18 AIC | Smart Manufacturing Sub-Theme | August 2026*
