# 04. METODOLOGI AI & SIGNAL PROCESSING

**Tim Pengembang**: Aku Mau Fokus Hima Team  
**Produk Inovasi**: EchoFactory  

---

## 1. Spesifikasi Dataset: Hitachi MIMII Industrial Benchmark

Model AI EchoFactory dikembangkan dan divalidasi menggunakan **Hitachi MIMII Dataset (Malfunctioning Industrial Machine Investigation and Inspection)** yang merupakan benchmark global industri manufaktur:

### A. Komposisi 4 Mesin Target
1. **Fan / Blower Industri**: Kegagalan unbalance bilah, ketidaksejajaran poros (*misalignment*), dan degradasi bantalan (*bearing outer/inner race BPFI/BPFO* 118.5 Hz).
2. **Centrifugal Pump**: Kegagalan kavitasi cairan (*cavitation bubble popping* 3–6 kHz), erosi impeller, dan kebocoran *mechanical seal*.
3. **Linear Slider Rail**: Keausan rel panduan (*guide rail dry friction screech* 1800 & 3200 Hz), keausan ball screw, dan kekurangan pelumasan.
4. **Solenoid Valve**: Kebocoran fluida bertekanan tinggi (*pressure leakage hiss* 4–7 kHz), hambatan plunger, dan kerusakan diafragma katup.

### B. Profil Kebisingan Pabrik Asli (*Signal-to-Noise Ratio*)
- **SNR $+6\text{ dB}$**: Kebisingan pabrik ringan (*Light Factory Ambience*).
- **SNR $0\text{ dB}$**: Kebisingan pabrik menengah (*Moderate Industrial Background*).
- **SNR $-6\text{ dB}$**: Kebisingan pabrik berat (*Extreme Industrial Harsh Environment*).

---

## 2. Pemrosesan Sinyal Akustik (*Signal Processing Pipeline*)

```
  Audio PCM 16 kHz (10 Detik)
               │
       ┌───────┴────────────────────────┐
       ▼                                ▼
    [ STFT ]                 [ Log-Mel Filterbank ]
 (Resolusi Waktu-Frekuensi)     (Persepsi Resonansi)
       │                                │
       └───────────────┬────────────────┘
                       ▼
        [ Spatio-Temporal Fusion Layer ]
                       │
                       ▼
        [ STgram-MFN v3 Feature Backbone ]
                       │
                       ▼
        [ ArcFace Cosine Metric Scoring ]
                       │
                       ▼
        [ Anomaly Score (Threshold 0.500) ]
```

### A. Short-Time Fourier Transform (STFT)
Sinyal audio $x(t)$ dipecah menjadi segmen-segmen pendek bertetangga menggunakan jendela Hann:
$$X(m, \omega) = \sum_{n=-\infty}^{\infty} x(n) w(n - m) e^{-j\omega n}$$
di mana $w(n)$ adalah fungsi jendela Hann, $m$ adalah pergeseran waktu (*hop size* = 512), dan $\omega$ adalah frekuensi diskrit ($N_{\text{fft}} = 1024$).

### B. Log-Mel Spectrogram (64 Filterbanks)
Spektrum daya $|X(m, \omega)|^2$ dipetakan ke skala frekuensi non-linear Mel menggunakan $M = 64$ filter segitiga:
$$M(m, k) = \ln \left( \sum_{\omega} |X(m, \omega)|^2 \cdot H_k(\omega) + \epsilon \right)$$
di mana $H_k(\omega)$ adalah respon frekuensi filter Mel ke-$k$.

### C. Spectral Crest Factor (Deteksi Impulsif)
Untuk mendeteksi benturan mekanik periodik (*bearing pulse impacts*):
$$\text{Crest Factor} = \frac{|x_{\text{peak}}|}{x_{\text{rms}}} = \frac{\max |x(t)|}{\sqrt{\frac{1}{N}\sum_{t=1}^{N} x(t)^2}}$$

---

## 3. Arsitektur Model Deep Learning: STgram-MFN v3 ONNX

### A. Dual-Branch Spectro-Temporal Memory Network
Model menggabungkan dua representasi komplementer:
1. **Linear STFT Branch**: Menangkap detail harmonik frekuensi tinggi dan lonjakan impulsif tajam.
2. **Mel-Scale Branch**: Menangkap pola distribusi energi makro menyerupai persepsi akustik telinga manusia.
3. **Fusion & Metric Learning**: Vektor fitur digabungkan dan diproyeksikan menggunakan fungsi kehilangan **ArcFace Margin Loss** untuk memisahkan kluster suara normal dan suara anomali secara optimal.

### B. Optimasi Inferensi Edge (ONNX Runtime FP32)
- Bobot model dikonversi ke format **ONNX Opset 17** dengan footprint memori ultra-ringan (<184 KB).
- Menghasilkan latensi inferensi super-cepat **<25 ms**, memungkinkan deployment langsung di perangkat edge pabrik tanpa GPU mahal.

---

## 4. Cognitive Diagnostic Core: Gemini 2.0 Flash RAG & ISO 10816-3

Output inferensi skor anomali diteruskan ke modul **Cognitive AI (Gemini 2.0 Flash)** yang diperkaya dengan Knowledge Base Standar Vibrasi Internasional:

### A. Evaluasi Zona ISO 10816-3
- **Zone A (< 1.8 mm/s)**: Mesin Baru / Kondisi Prima (*Good*) — Operasi normal.
- **Zone B (1.8 - 4.5 mm/s)**: Memuaskan / Layak Operasi (*Satisfactory*) — Lanjutkan inspeksi berkala.
- **Zone C (4.5 - 11.2 mm/s)**: Peringatan Degradasi (*Unsatisfactory*) — Terbitkan Work Order terencana.
- **Zone D (> 11.2 mm/s)**: Bahaya Kritis (*Unacceptable*) — Matikan unit segera guna mencegah kecelakaan fatal.

### B. Estimasi Remaining Useful Life (RUL) & Rekomendasi Preskriptif
Gemini 2.0 Flash mengonversi metrik getaran, crest factor, dan profil SNR menjadi:
1. Estimasi sisa hari/jam kerja aman unit sebelum kegagalan katastropik.
2. Rekomendasi tindakan perbaikan preskriptif spesifik (misal: *alignment shaft, re-greasing SKF bearing, penggantian seal Grundfos*).
3. Penerbitan draft tiket **Work Order resmi (ERP/SAP)** dengan estimasi biaya dan suku cadang teralokasi dari gudang.
