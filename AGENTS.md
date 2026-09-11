Berikut adalah blueprint (rancangan arsitektur dan instruksi) dalam bentuk `AGENTS.MD` yang bisa digunakan oleh AI Agent atau developer untuk membangun halaman Home sesuai dengan spesifikasi yang Anda minta.

```markdown
# AGENTS.MD - Frontend Blueprint

## 1. Project Overview
**Tujuan**: Membangun landing page / halaman Home personal portofolio yang bersih, profesional, modern, dan terstruktur.
**Tech Stack**: Next.js (App Router), Tailwind CSS, React Icons.
**Design Language**: "Google Theme" (Terinspirasi dari Material Design 3) - Putih bersih, abu-abu terang untuk surface, shadow lembut, border-radius agak membulat (rounded-2xl/3xl), tipografi sans-serif (Inter/Roboto), dan warna aksen khas Google (Biru, Merah, Kuning, Hijau) secara proporsional.
**Anti-AI Slop**: Hindari desain yang terlalu ramai, neon glow berlebihan, atau tata letak grid yang tidak beraturan. Gunakan whitespace (ruang kosong) yang melimpah dan hierarki visual yang jelas.
**Data**: Hanya gunakan text *Lorem Ipsum*.

---

## 2. Design & Animation System (Tailwind & CSS)
**Warna Utama (Tailwind Custom Colors):**
- Background: `bg-slate-50` atau `bg-[#F8F9FA]` (Google Search Background).
- Surface/Card: `bg-white` dengan border sangat tipis `border-gray-200` atau shadow lembut `shadow-sm`.
- Text Primary: `text-gray-900`.
- Text Secondary: `text-gray-600`.
- Aksen (Google Brand Colors): 
  - Blue: `text-blue-500` / `bg-blue-50`
  - Red: `text-red-500`
  - Yellow: `text-yellow-500`
  - Green: `text-green-500`

**Animasi Tipis-Tipis (Tailwind Utilities):**
- Transisi dasar: `transition-all duration-300 ease-in-out`
- Hover state pada card: `hover:-translate-y-1 hover:shadow-md`
- Fade in (bisa menggunakan class custom di global.css atau Framer Motion ringan): `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` dengan utility class `animate-fade-in`.

---

## 3. Folder Architecture
Pecah struktur komponen agar modular (Satu komponen, satu tanggung jawab).

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx          # Menggabungkan semua section Home
│   └── globals.css       # Konfigurasi Tailwind & Custom Animations
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── home/
│       ├── HeroSection.tsx
│       ├── EducationSection.tsx
│       ├── SkillsSection.tsx
│       ├── ExperienceSection.tsx
│       └── ProjectShowcase.tsx
└── data/
    └── dummyData.ts      # Menyimpan variabel berisi Lorem Ipsum

```

---

## 4. Component Specifications (Home Page)

### A. Navbar (`components/layout/Navbar.tsx`)

* **Desain**: Sticky di atas, background putih semi-transparan dengan `backdrop-blur-md`, border bawah tipis `border-b border-gray-100`.
* **Isi**: Logo teks simpel di kiri, navigasi (Home, About, Projects) di kanan.
* **Interaksi**: Link berubah warna (aksen biru) saat di-hover.

### B. Hero Section (`components/home/HeroSection.tsx`)

* **Desain**: Layout 2 kolom (Desktop) atau 1 kolom (Mobile).
* **Kiri (Teks)**:
* Badge kecil bertuliskan "Hello, World" dengan background biru sangat muda.
* Heading besar (H1): *Lorem ipsum dolor sit amet consectetur.*
* Paragraf singkat (P): *Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos, voluptate.*
* Deretan Ikon Social Media (React Icons: FaGithub, FaLinkedin, FaTwitter) yang memiliki efek hover `hover:scale-110` dan `hover:text-blue-600`.


* **Kanan (Visual)**:
* Kotak atau lingkaran asimetris (rounded-3xl) berisi foto/placeholder abu-abu.
* Animasi: Gambar masuk dengan `animate-fade-in`.



### C. Skills Section (`components/home/SkillsSection.tsx`)

* **Desain**: Menggunakan gaya "Pills" atau "Chips" (khas pencarian Google).
* **Isi**: Kumpulan badge berisi teks *Lorem Ipsum*, contoh: "Lorem", "Ipsum", "Dolor".
* **Styling Chip**: `px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-default`.

### D. Education Section (`components/home/EducationSection.tsx`)

* **Desain**: Format list vertikal yang rapi.
* **Isi (Card tanpa border tebal)**:
* Tahun (Kiri atau di atas).
* Nama Institusi (*Lorem Ipsum University*).
* Deskripsi (*Lorem ipsum dolor sit amet...*).


* **Elemen UI**: Gunakan React Icons (FaGraduationCap) dengan lingkaran background berwarna aksen kuning/hijau.

### E. Experience Section (`components/home/ExperienceSection.tsx`)

* **Desain**: Timeline vertikal simpel atau deretan baris yang jelas.
* **Detail**:
* Posisi (*Lorem Ipsum Role*).
* Perusahaan (*Sit Amet Corp*).
* Bullet points pengalaman (berisi kalimat *lorem ipsum*).



### F. Project Showcase (`components/home/ProjectShowcase.tsx`)

* **Desain**: Grid layout (1 kolom mobile, 2 atau 3 kolom desktop).
* **Card**:
* Background putih, `rounded-2xl`, `border border-gray-100`.
* Bagian atas: Placeholder gambar project (div `bg-gray-100 aspect-video`).
* Bagian bawah: Judul project, deskripsi singkat *lorem ipsum*, dan deretan chips kecil untuk teknologi yang digunakan.


* **Interaksi**: `hover:shadow-lg hover:-translate-y-2 transition-all duration-300`.
* **Ikon**: Tambahkan ikon panah kecil (FaArrowRight) di pojok kanan bawah card yang bergeser ke kanan saat card di-hover (efek "tidak pasaran").

### G. Footer (`components/layout/Footer.tsx`)

* **Desain**: Simpel, rata tengah, background `bg-gray-50`, teks `text-gray-500` berukuran kecil.
* **Isi**: *© 2024 Lorem Ipsum. All rights reserved.*

---

## 5. Execution Instructions (Untuk AI / Developer)

1. **Inisialisasi**: Buat project Next.js baru (`npx create-next-app@latest`).
2. **Install Dependencies**: `npm install react-icons`.
3. **Konfigurasi CSS**: Tambahkan utility animasi di `tailwind.config.ts` untuk `fade-in` dan `slide-up`.
4. **Pembuatan Komponen**:
* Bangun struktur file sesuai section 3.
* Buat file `dummyData.ts` terpusat agar teks *Lorem Ipsum* mudah diganti nantinya.
* Rakit setiap komponen menjadi satu halaman utuh di `app/page.tsx`.


5. **Quality Control**:
* Pastikan *padding* antar section konsisten (misal: `py-16` atau `py-24`).
* Hindari warna yang bertabrakan; jaga dominasi warna putih/abu terang.
* Pastikan responsifitas berjalan mulus dari layar HP ke Monitor Lebar.



```

### Panduan Menggunakan Blueprint Ini:
Anda bisa menyalin teks di dalam blok kode di atas, menyimpannya sebagai file `AGENTS.MD` di root folder proyek Anda, atau langsung memberikannya kepada AI Coding Assistant (seperti Cursor, GitHub Copilot, atau ChatGPT) dengan prompt: *"Buatkan kode frontend Next.js sesuai dengan spesifikasi pada file AGENTS.MD berikut."*

```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
