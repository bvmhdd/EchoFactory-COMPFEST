# 🎵 SAVED IDEA: EchoFactory
## AI Machine Health Intelligence dari Suara — COMPFEST 18 AIC

---

### 📋 METADATA
- **Nama Inovasi**: EchoFactory — Acoustic Machine Intelligence & Tamper-Proof Health Passport
- **Sub-Tema**: Smart Manufacturing (Predictive Maintenance via Acoustic AI)
- **AI Stack**: Fine-tuned CNN/Autoencoder on Spectrograms (Librosa + PyTorch) + FastAPI + Next.js + Polygon Amoy Testnet
- **Dataset Utama**: MIMII Dataset by Hitachi Research (PUBLIC, FREE) — suara 4 jenis mesin industri normal vs. abnormal (pompa, fan, slider, valve)

---

### 💡 KONSEP UTAMA
> *"Pak Slamet, 35 tahun operator mesin tenun, bisa tahu kalau mesinnya mau rusak hanya dari suaranya. Tapi Pak Slamet pensiun tahun depan — dan tidak ada yang bisa menangkap pengetahuannya."*

Semua predictive maintenance pakai **sensor mahal** (Rp 50-200 juta/mesin) atau **kamera**. EchoFactory pakai **mikrofon HP biasa**. Setiap mesin punya "sidik jari suara" unik yang bisa dianalisa AI dari rekaman 30 detik.

---

### 📊 PAIN POINT & DATA (2025)
| Data | Fakta |
|---|---|
| PHK massal manufaktur 2025 | 24.000+ PHK dalam 4 bulan pertama 2025 → operator veteran pergi membawa tacit knowledge |
| Biaya downtime mesin | Rp 10-50 juta per jam mesin berhenti tak terduga |
| Biaya sensor vibration premium | Rp 50-200 juta per titik sensor → tidak terjangkau pabrik menengah |
| Root cause | Tidak ada sistem murah yang bisa capture "telinga terlatih" operator berpengalaman |

---

### 🔄 ALUR MVP
```
INPUT: Rekam suara mesin 30 detik via HP

AI PIPELINE:
  1. Audio → STFT Spectrogram (gambar 2D frekuensi-waktu)
  2. Fine-tuned CNN (trained on MIMII) → Anomaly Score vs. baseline
  3. Failure Mode Classifier → bearing wear / belt slip / imbalance / cavitation
  4. RUL Estimator → "Estimasi failure dalam 47-72 jam"

BLOCKCHAIN (Polygon Amoy Testnet):
  → Hash baseline audio per mesin → "Machine Health Passport" on-chain
  → Setiap anomali → commit on-chain (tamper-proof audit trail)
  → Smart Contract → auto-trigger maintenance order jika critical anomaly

OUTPUT:
  Upload audio → Spektrogram visual → AI diagnosis → Blockchain health log
```

---

### 🛠️ TECH STACK
| Layer | Tech |
|---|---|
| Frontend | Next.js (audio recorder + spectrogram viz + health timeline) |
| Backend | FastAPI + Librosa (audio processing) |
| AI | CNN ResNet/Autoencoder pada spektrogram (PyTorch) |
| Dataset | MIMII Dataset by Hitachi (free, public) |
| Blockchain | Polygon Amoy Testnet |

---

### 📊 EVALUASI 5 BINTANG
| Novelty | Relevansi Masyarakat | Feasibility MVP | AI Depth |
|:---:|:---:|:---:|:---:|
| ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Novelty**: Acoustic AI untuk manufaktur = PERTAMA di hackathon Indonesia
**Relevansi**: Mesin rusak → pabrik berhenti → 24rb+ buruh PHK 2025 terkait downtime
**Feasibility**: MIMII Dataset siap pakai, Librosa+PyTorch CNN < 1 minggu
**AI Depth**: CNN pada spektrogram + Autoencoder anomaly = genuinely hard problem

---

### 💬 PITCH HOOK
> *"EchoFactory adalah cara kita mendokumentasikan 'telinga Pak Slamet' ke dalam AI — sebelum pengetahuan itu pergi selamanya bersama kepergiannya."*

---

*Saved for COMPFEST 18 AIC | Smart Manufacturing Sub-Theme | August 2026*
