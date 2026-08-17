# Design System Reference — Qronos Landing Page

Dokumen ini merangkum design system dari referensi visual (landing page "Qronos — schedule management system for autonomous agents") untuk dipakai sebagai acuan development (Next.js + Tailwind CSS).

---

## 1. Konsep Visual

- **Tema**: Dark mode, minimalis, futuristik, "AI/infra" vibe.
- **Mood**: Teknikal, premium, high-contrast, sedikit dramatis (mirip landing page Vercel/Linear/Resend).
- **Elemen ikonik**: Wormhole/vortex 3D berbentuk hyperboloid dari garis-garis tipis (line art), menyempit di tengah — dipakai sebagai hero background.

---

## 2. Color Palette

| Token | Hex (approx) | Penggunaan |
|---|---|---|
| `--bg-primary` | `#000000` | Background utama seluruh halaman |
| `--bg-surface` | `#0A0A0B` / `#111113` | Background card/panel |
| `--bg-surface-alt` | `#18181B` | Card sekunder, input field |
| `--border-subtle` | `#2A2A2E` | Border tipis pada card, divider |
| `--text-primary` | `#FFFFFF` | Heading, teks penting |
| `--text-secondary` | `#A1A1AA` / `#8B8B93` | Body text, deskripsi |
| `--text-muted` | `#5C5C63` | Logo partner, footer, teks tersier |
| `--accent-white` | `#FFFFFF` | Tombol solid putih (secondary CTA) |
| `--accent-line` | `#6B6B73` (gradient ke putih) | Garis-garis vortex |

**Catatan**: Tidak ada warna brand/aksen mencolok (biru/ungu). Semua kontras dibangun dari grayscale + putih murni. Highlight kecil (grafik/status) memakai warna soft seperti hijau/biru pastel dengan opacity rendah.

---

## 3. Typography

- **Font style**: Sans-serif modern, geometric/grotesk (mirip *Inter*, *Geist*, atau *Söhne*).
- **Heading (H1 Hero)**: Ukuran sangat besar (~64–80px desktop), `font-weight: 500–600`, line-height rapat (~1.05), warna gradasi putih → abu-abu (gradient text, dari terang di kiri/atas ke redup).
- **Heading (H2 Section)**: ~32–40px, weight medium, contoh: "Stateful execution.", "Durable autonomy.", "Track agent insights in real time."
  - Pola: kalimat pendek + kalimat lanjutan di baris baru dengan opacity/warna lebih redup (efek 2-tone).
- **Body/Subtext**: ~16–18px, `text-secondary`, line-height longgar (~1.6), max-width dibatasi (~600px) agar tetap readable di tengah.
- **Button text**: Uppercase, letter-spacing sedang, ~13–14px, weight semi-bold.
- **Nav text**: ~14px, weight regular, warna abu terang.

---

## 4. Layout & Spacing

- **Container**: Full-width dengan max-width konten ~1200–1280px, centered.
- **Navbar**: Fixed/sticky top, height ~72px, flex justify-between:
  - Kiri: Logo (icon + wordmark "QRONOS", uppercase, letter-spacing lebar)
  - Tengah: Nav links (About, Features, Insights, Pricing, Testimonials)
  - Kanan: CTA button pill "GET STARTED »"
- **Hero Section**: Full-bleed, tinggi ~90–100vh, konten center-aligned (text-align: center), vortex sebagai background absolute/behind text.
- **Section spacing**: Padding vertikal besar antar section (~120–160px desktop).
- **Section pattern berulang**: Judul + subjudul kiri (atau center), lalu grid 2 kolom berisi card/screenshot produk (mockup UI dashboard dengan efek border glow tipis + shadow).
- **Grid**: 12-column grid, gap besar (~24–32px).
- **Card**: `border-radius: 12–16px`, border 1px `--border-subtle`, background sedikit lebih terang dari base (`--bg-surface`), inner shadow halus.

---

## 5. Komponen

### 5.1 Buttons
- **Primary (dark pill)**: Background hitam/near-black, border tipis abu, text putih, rounded-full, ada icon chevron (`»`) di kanan. Contoh: `GET STARTED »`.
- **Secondary (light pill)**: Background putih solid, text hitam, rounded-full, tanpa icon. Contoh: `REQUEST A DEMO`.
- Ukuran: padding horizontal ~24px, vertical ~12px, height ~44px.

### 5.2 Logo Bar (Social Proof)
- Baris logo partner (Vercel, Google BigQuery, Slack, Supabase, GitHub, HubSpot, Zapier, Snowflake, AWS) — grayscale/low-opacity, disusun horizontal dengan spacing merata, di bawah hero.

### 5.3 Product Mockup Cards
- Screenshot dashboard aplikasi (dark UI) ditampilkan dalam frame card dengan border-radius, sedikit perspective/shadow, sebagai bukti visual fitur (Stateful execution, Durable autonomy, Track agent insights).
- Di dalam mockup: sidebar kiri gelap, area konten dengan chart bar minimal, list item dengan status badge kecil (label pill berwarna soft).

### 5.4 Feature Highlight (2–4 kolom)
- Grid kecil berisi icon + judul singkat + deskripsi 1 baris (contoh: "Multi Agent Pipelines", "Flexible scheduling", "Built-in guardrails", "Agent Inbox").
- Card dengan background sedikit beda, border tipis.

### 5.5 Pricing Cards
- 4 kolom: `$0`, `$19/mo`, `$19/mo` (highlighted/border lebih terang, kemungkinan "Popular"), `Custom`.
- Tiap card: harga besar di atas, list fitur dengan checkmark, tombol CTA di bawah.

### 5.6 Testimonial Cards
- 2 kolom card gelap, quote singkat + avatar/nama + role, dengan logo perusahaan kecil.

### 5.7 CTA Section (penutup)
- Center-aligned, heading besar ("Stop babysitting agents. Let them own the work."), 2 tombol (dark pill + light pill), background masih vortex/particle halus.

### 5.8 Footer
- Multi-kolom (Product, Company, Resources, Legal), logo + tagline di kiri, copyright di bawah, semua teks kecil & muted.

---

## 6. Efek & Animasi

- **Hero background**: Vortex 3D garis-garis (bisa dibuat dengan `<canvas>`/WebGL, Three.js, atau SVG path animasi) — garis-garis melengkung membentuk corong (hyperboloid), warna gradasi abu → putih, ada partikel titik-titik kecil tersebar (starfield effect).
- **Hover state**: Tombol sedikit scale/brightness up saat hover.
- **Scroll reveal**: Kemungkinan fade-in + slide-up halus per section saat masuk viewport.
- **Card glow**: Border/shadow tipis dengan sedikit glow putih pada mockup card untuk kesan "elevated".

---

## 7. Rekomendasi Implementasi (Next.js + Tailwind)

```
Font: Inter / Geist (via next/font)
Base:
  bg-black text-white
  
Tailwind tokens custom (contoh):
  colors: {
    surface: '#0A0A0B',
    surfaceAlt: '#18181B',
    border: '#2A2A2E',
    muted: '#8B8B93',
  }

Button pill:
  rounded-full px-6 py-3 text-sm font-semibold tracking-wide

Hero vortex:
  - Three.js / react-three-fiber untuk efek 3D garis, ATAU
  - SVG/Canvas 2D dengan animasi rotasi + noise untuk versi ringan
```

**Library pendukung yang relevan**: `framer-motion` (scroll reveal), `three.js` / `@react-three/fiber` (vortex 3D), `lucide-react` (icon).

---

## 8. Ringkasan Tone

> Dark, technical, confident, minim warna — kontras dibangun murni dari grayscale + tipografi besar. Kesan "infrastruktur serius untuk AI agent", bukan playful/consumer.
