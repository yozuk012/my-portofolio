# 🌐 Portfolio — Achmad Aldino

Website portofolio pribadi yang dibangun dengan **Next.js**, **Tailwind CSS**, dan **Supabase** sebagai backend database. Menampilkan profil, skill, pendidikan, pengalaman, dan proyek secara dinamis.

---

## 🚀 Tech Stack

| Teknologi | Keterangan |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework React (App Router) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS |
| [Supabase](https://supabase.com/) | Database & Storage |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library |
| [Vercel](https://vercel.com/) | Hosting & Deployment |

---

## ✨ Fitur

- **Hero Section** — Profil dinamis dari database (nama, bio, avatar, social links)
- **Skills** — Marquee animasi dengan skill dari database
- **Education** — Riwayat pendidikan dengan timeline vertikal
- **Experience** — Pengalaman kerja/proyek yang dapat dikelola
- **Projects** — Showcase proyek unggulan dengan gambar thumbnail
- **Contact** — Form kontak langsung
- **Admin Dashboard** — Panel pengelolaan konten (CRUD) dengan autentikasi
- **Responsive** — Tampilan optimal di mobile, tablet, dan desktop

---

## 🛠️ Cara Menjalankan Lokal

### 1. Clone repository

```bash
git clone https://github.com/yozuk012/my-portofolio.git
cd my-portofolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── page.js              # Halaman utama (Home)
│   ├── globals.css          # Global styles
│   ├── experience/          # Halaman Experience
│   ├── projects/            # Halaman Projects
│   ├── skills/              # Halaman Skills
│   ├── contact/             # Halaman Contact
│   └── admin/               # Admin dashboard
├── components/
│   ├── layout/              # Navbar & Footer
│   └── home/                # Section komponen Home
└── lib/
    └── supabase.js          # Konfigurasi Supabase client
```

---

## 📦 Scripts

```bash
npm run dev      # Jalankan development server
npm run build    # Build untuk production
npm run start    # Jalankan production build
npm run lint     # Cek linting
```

---

## 🔗 Live Demo

👉 [https://my-portofolio-yozuk012.vercel.app](https://my-portofolio-yozuk012.vercel.app)

---

## 👤 Author

**Achmad Aldino**  
Mahasiswa D3 Manajemen Informatika — STIKOM PGRI Banyuwangi  
GitHub: [@yozuk012](https://github.com/yozuk012)
