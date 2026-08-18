# 🚀 Panduan Deploy Backend EchoFactory ke Hugging Face Spaces Gradio

Panduan langkah-demi-langkah untuk mempublikasikan backend dan antarmuka EchoFactory ke **Hugging Face Spaces (Gradio SDK)** dalam waktu kurang dari 2 menit:

---

### 1. Buat Space Baru di Hugging Face
1. Buka [Hugging Face Spaces](https://huggingface.co/spaces) dan login ke akun Anda.
2. Klik **Create new Space**.
3. Isi data:
   * **Space name**: `EchoFactory` (atau nama lain yang Anda inginkan).
   * **License**: `mit`.
   * **Select the Space SDK**: Pilih **Gradio**.
   * **Space hardware**: Pilih **CPU basic (Free: 2 vCPU, 16 GB RAM)**.
   * **Privacy**: **Public**.
4. Klik **Create Space**.

---

### 2. Upload / Push File ke Repository Space

#### Opsi A: Menggunakan Git CLI (Paling Cepat & Rapi)
Jalankan perintah berikut di terminal Anda:

```powershell
# 1. Masuk ke folder hf_space
cd c:\Users\muhib\Downloads\COMPFEST\EchoFactory\hf_space

# 2. Inisialisasi git lokal untuk HF Space
git init
git add .
git commit -m "feat: EchoFactory Industrial AI & Blockchain Health Passport (Gradio Backend)"

# 3. Tambahkan remote repository HF Space Anda
# Format: https://huggingface.co/spaces/<USERNAME>/<SPACE_NAME>
git remote add hf https://huggingface.co/spaces/<USERNAME_ANDA>/EchoFactory

# 4. Push ke Hugging Face
git branch -M main
git push -u hf main --force
```

*(Catatan: Saat diminta password, masukkan **Hugging Face Access Token (Write)** dari menu [Settings > Access Tokens](https://huggingface.co/settings/tokens)).*

---

#### Opsi B: Upload Manual via Browser (Drag & Drop)
Jika tidak ingin menggunakan Git CLI:
1. Buka tab **Files** pada Space baru Anda di Hugging Face.
2. Klik **Add file $\rightarrow$ Upload files**.
3. Drag & drop seluruh isi folder `c:\Users\muhib\Downloads\COMPFEST\EchoFactory\hf_space\`:
   * `app.py`
   * `audio_engine.py`
   * `cognitive_engine.py`
   * `blockchain_service.py`
   * `requirements.txt`
   * `packages.txt`
   * `README.md`
   * Folder `demo_samples/` beserta 8 file `.wav` di dalamnya.
4. Klik **Commit changes to main**.

---

### 3. Konfigurasi Secrets (Opsional tapi Direkomendasikan)
Di halaman Space Anda, buka **Settings $\rightarrow$ Variables and secrets $\rightarrow$ New secret**:

* `GEMINI_API_KEY`: Kunci API Google Gemini Anda (untuk diagnosis kognitif real-time).
* `WALLET_PRIVATE_KEY`: Private key wallet MetaMask Polygon Amoy (jika ingin mencatat transaksi live on-chain).
* `CONTRACT_ADDRESS`: `0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864`.

---

### 4. Selesai!
Hugging Face akan otomatis melakukan *build* selama ~30–60 detik. Setelah status berubah menjadi **Running (Hijau)**, aplikasi EchoFactory Anda siap diakses 24/7 di:
`https://huggingface.co/spaces/<USERNAME_ANDA>/EchoFactory`

*Link ini siap Anda lampirkan di submission proposal dan didemonstrasikan ke juri COMPFEST 18 AIC!*
