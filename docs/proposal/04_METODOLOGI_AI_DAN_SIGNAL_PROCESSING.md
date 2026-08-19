# 04. METODOLOGI AI & SIGNAL PROCESSING

## 1. Spesifikasi Dataset: MIMII Dataset (Industrial Benchmark)

Model AI EchoFactory dikembangkan dan divalidasi menggunakan **MIMII Dataset (Malfunctioning Industrial Machine Investigation and Inspection)** yang dirilis oleh Hitachi, Ltd. dan Toyo Corporation:

### A. Komposisi Mesin & Kondisi Operasional
- **4 Tipe Mesin Industri**:
  1. **Fan / Blower Industri**: Kegagalan unbalance bilah dan degradasi bantalan (*bearing outer/inner race*).
  2. **Centrifugal Pump**: Kegagalan kavitasi cairan (*cavitation bubble implosion*) dan kontaminasi *seal*.
  3. **Linear Slider**: Keausan rel panduan (*guide rail friction*) dan kekurangan pelumasan.
  4. **Solenoid Valve**: Kebocoran fluida bertekanan (*pressure leakage*) dan hambatan buka-tutup katup.
- **Tingkat Kebisingan Pabrik Asli (*Signal-to-Noise Ratio*)**:
  - SNR **$+6\text{ dB}$**: Kebisingan pabrik ringan (*Light Factory Ambience*).
  - SNR **$0\text{ dB}$**: Kebisingan pabrik menengah (*Moderate Factory Noise*).
  - SNR **$-6\text{ dB}$**: Kebisingan pabrik berat (*Extreme Industrial Harsh Environment*).

---

## 2. Pemrosesan Sinyal Akustik (*Signal Processing Pipeline*)

```
  Audio Mentah (16 kHz)
           │
     ┌─────┴────────────────────────┐
     ▼                              ▼
  [ STFT ]                 [ Log-Mel Filterbank ]
(Resolusi Waktu-Frekuensi)    (Persepsi Resonansi)
     │                              │
     └──────────────┬───────────────┘
                    ▼
     [ Spatio-Temporal Feature Fusion ]
                    │
                    ▼
     [ MobileFaceNet Embedding Network ]
                    │
                    ▼
     [ Cosine Metric Anomaly Scoring ]
```

### A. Short-Time Fourier Transform (STFT)
Sinyal audio $x(t)$ dipecah menjadi segmen-segmen pendek bertetangga menggunakan jendela Hann:
$$X(m, \omega) = \sum_{n=-\infty}^{\infty} x(n) w(n - m) e^{-j\omega n}$$
di mana $w(n)$ adalah fungsi jendela Hann, $m$ adalah pergeseran waktu (*hop size* = 512), dan $\omega$ adalah frekuensi diskrit ($N_{\text{fft}} = 1024$).

### B. Log-Mel Spectrogram
Spektrum daya $|X(m, \omega)|^2$ dipetakan ke skala frekuensi non-linear Mel menggunakan $M = 64$ filter segitiga:
$$M(m, k) = \ln \left( \sum_{\omega} |X(m, \omega)|^2 \cdot H_k(\omega) + \epsilon \right)$$
di mana $H_k(\omega)$ adalah respon frekuensi filter Mel ke-$k$.

### C. Spectral Crest Factor (Deteksi Impulsif)
Untuk mendeteksi benturan mekanik periodik (*bearing impact*):
$$\text{Crest Factor} = \frac{|x_{\text{peak}}|}{x_{\text{rms}}} = \frac{\max |x(t)|}{\sqrt{\frac{1}{N}\sum_{t=1}^{N} x(t)^2}}$$

---

## 3. Arsitektur Model Deep Learning: STgram-MFN v3

### A. Konsep Desain
Model menggunakan arsitektur **STgram-MFN (Spatio-Temporal Spectrogram MobileFaceNet)** yang menggabungkan keunggulan:
1. **Representasi Spasial**: Mengekstrak pola harmonik frekuensi stasioner dari Log-Mel Spectrogram.
2. **Representasi Temporal**: Mengekstrak transien dan perubahan fase getaran cepat dari spektrogram STFT.
3. **MobileFaceNet Backbone**: Jaringan konvolusional kompak yang menggunakan *Depthwise Separable Convolutions* dan *Global Depthwise Residual Blocks* untuk menjaga ukuran model tetap sangat kecil ($<12\text{ MB}$) dengan akurasi representasi *embedding* yang tajam.

### B. Formulasi Perhitungan Skor Anomali (*Anomaly Score Formula*)
Model dilatih secara *self-supervised* untuk mempelajari distribusi suara mesin normal:
1. Vektor representasi *embedding* $\mathbf{z} = f_{\theta}(X)$ diekstraksi dari sinyal uji.
2. Jarak kosinus dihitung terhadap *centroid* suara normal mesin $\mathbf{c}_{\text{normal}}$:
$$D_{\text{cosine}}(\mathbf{z}, \mathbf{c}_{\text{normal}}) = 1 - \frac{\mathbf{z} \cdot \mathbf{c}_{\text{normal}}}{\|\mathbf{z}\| \|\mathbf{c}_{\text{normal}}\|}$$
3. Skor anomali akhir $S$ merupakan kombinasi terbobot jarak kosinus dan kesalahan rekonstruksi:
$$S = \alpha \cdot D_{\text{cosine}} + (1 - \alpha) \cdot \text{Error}_{\text{recon}}$$
Jika $S > \text{Threshold}_{\text{SNR}}$, sistem menandai kondisi mesin sebagai **ABNORMAL**.

---

## 4. Mesin Kognitif & Standar ISO 10816-3 (Diagnostic RAG)

### A. Matriks Klasifikasi Zona Getaran ISO 10816-3

| Zona ISO | Rentang Getaran RMS | Kondisi Mesin | Rekomendasi Tindakan Operasional |
|---|---|---|---|
| **Zone A** | $0.0 - 1.8\text{ mm/s}$ | Baru / Sangat Baik (*Good*) | Operasi normal tanpa batasan. Inspeksi rutin berjalan. |
| **Zone B** | $1.8 - 4.5\text{ mm/s}$ | Layak Operasi (*Satisfactory*) | Mesin layak beroperasi jangka panjang tanpa intervensi. |
| **Zone C** | $4.5 - 11.2\text{ mm/s}$ | Degradasi Dini (*Unsatisfactory*) | Peringatan! Jadwalkan inspeksi & pergantian komponen sebelum kerusakan struktural. |
| **Zone D** | $> 11.2\text{ mm/s}$ | Bahaya Kritis (*Unacceptable*) | **BAHAYA!** Matikan mesin segera untuk mencegah kegagalan katastropik. |

### B. Prompt Engineering & Reasoning Gemini 1.5 Flash
Ketika anomali terdeteksi, sistem menyusun *contextual prompt* terstruktur ke Gemini Flash:

```text
Peran: AI Predictive Maintenance Engineer Standar ISO 10816.
Data Input:
- Machine ID: FAN_ID_00
- Noise Profile: +6dB SNR
- Anomaly Score: 0.0842 (Threshold: 0.050)
- Spectral Crest Factor: 4.82 (High Impulsiveness)
- ISO 10816 Severity: Zone C (Unsatisfactory)

Tugas: Berikan analisis teknis Bahasa Indonesia maksimal 3 kalimat:
(1) Identifikasi akar masalah mekanik spesifik.
(2) Risiko jika mesin dibiarkan menyala.
(3) Tindakan korektif segera & komponen suku cadang pengganti.
```

### C. Estimasi Remaining Useful Life (RUL)
Estimasi sisa jam operasi sebelum kegagalan katastropik dihitung dengan model degradasi eksponensial berbasis skor anomali dan gradien laju perubahan getaran:
$$\text{RUL}_{\text{hours}} = \max\left(24, \quad \text{RUL}_{\text{nominal}} \cdot \exp\left(-\beta \cdot \frac{S - S_{\text{threshold}}}{S_{\text{threshold}}}\right)\right)$$
di mana $\beta$ adalah koefisien laju keausan spesifik per tipe mesin.
