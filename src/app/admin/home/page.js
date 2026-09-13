"use client";

import { useEffect, useState } from "react";
import { FiArrowUpRight, FiExternalLink, FiGrid, FiLogOut, FiLayers, FiBookOpen, FiBriefcase, FiCode } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Daftar section yang ada di dalam /admin/home/
const homeSections = [
  { 
    label: "Hero Section", 
    href: "/admin/home/section_hero", 
    icon: FiGrid, 
    desc: "Edit nama, bio, foto profil, & sosial media" 
  },
  { 
    label: "Skills Section", 
    href: "/admin/home/section_skills", 
    icon: FiCode, 
    desc: "Kelola daftar keahlian & tools" 
  },
  { 
    label: "Education Section", 
    href: "/admin/home/section_education", 
    icon: FiBookOpen, 
    desc: "Edit riwayat pendidikan & akademik" 
  },
  { 
    label: "Experience Section", 
    href: "/admin/home/section_experience", 
    icon: FiBriefcase, 
    desc: "Kelola pengalaman kerja & project" 
  },
  { 
    label: "Project Showcase", 
    href: "/admin/home/section_project", 
    icon: FiLayers, 
    desc: "Atur project unggulan di halaman depan" 
  },
];

export default function AdminHomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Cek autentikasi user
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      if (!data.user) {
        router.replace("/auth");
        return;
      }
      setUser(data.user);
      setIsChecking(false);
    });
    return () => { isMounted = false; };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  if (isChecking) {
    return <main className="admin-loading">Memeriksa akses...</main>;
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        {/* Header */}
        <header className="admin-header">
          <Link className="admin-brand" href="/admin" aria-label="Kembali ke dashboard utama">
            <span className="brand-mark">A</span>
            <span>
              <strong>Achmad Aldino</strong>
              <small>Admin Edit Home</small>
            </span>
          </Link>
          <div className="admin-account">
            <span>{user?.email}</span>
            <button type="button" onClick={handleLogout}>
              <FiLogOut aria-hidden="true" /> Keluar
            </button>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="admin-welcome">
          <div>
            <span className="admin-kicker"><span /> Halaman Utama</span>
            <h1>Kelola bagian<br /><em>Home.</em></h1>
            <p>Pilih section di bawah ini untuk mengedit konten spesifik pada halaman utama portfolio Anda.</p>
          </div>
          <Link className="admin-preview-link" href="/" target="_blank">
            <FiExternalLink aria-hidden="true" /> Lihat hasil di web
          </Link>
        </section>

        {/* Grid Menu Section */}
        <section className="admin-menu-section" aria-labelledby="home-sections-title">
          <div className="admin-section-heading">
            <span id="home-sections-title">Pilih Section untuk Diedit</span>
            <small>01 / 05</small>
          </div>
          
          <div className="admin-menu-grid">
            {homeSections.map(({ label, href, icon: Icon, desc }, index) => (
              <Link className="admin-menu-card" href={href} key={label}>
                <span className="admin-menu-index">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <div>
                  <strong>{label}</strong>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{desc}</p>
                </div>
                <FiArrowUpRight className="admin-menu-arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}