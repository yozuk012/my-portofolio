"use client";

import { useEffect, useState } from "react";
import { FiArrowUpRight, FiBriefcase, FiCode, FiExternalLink, FiGrid, FiLogOut, FiMessageCircle, FiSettings, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toggleProfileStatus } from "@/app/actions/toggleProfileStatus";

const adminMenu = [
  { label: "Edit Halaman Home", href: "/admin/home", icon: FiGrid },
  { label: "Skills", href: "/admin/skills", icon: FiCode },
  { label: "Experience", href: "/admin/experience", icon: FiBriefcase },
  { label: "Projects", href: "/admin/projects", icon: FiSettings },
  { label: "Contact", href: "/admin/contact", icon: FiMessageCircle },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  
  // State untuk jumlah data dan status
  const [counts, setCounts] = useState({ skills: 0, experience: 0, projects: 0 });
  const [workStatus, setWorkStatus] = useState("available");
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthAndData() {
      // 1. Cek autentikasi
      const { data: authData } = await supabase.auth.getUser();
      if (!isMounted) return;
      
      if (!authData.user) {
        router.replace("/auth");
        return;
      }
      setUser(authData.user);

      // 2. Ambil status profil
      const { data: profile } = await supabase
        .from("profile")
        .select("status")
        .limit(1)
        .maybeSingle();
      
      if (profile && profile.status) {
        setWorkStatus(profile.status);
      }

      // 3. Ambil jumlah data dari database secara paralel
      const [skillsRes, expRes, projRes] = await Promise.all([
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("experiences").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true })
      ]);

      if (isMounted) {
        setCounts({
          skills: skillsRes.count || 0,
          experience: expRes.count || 0,
          projects: projRes.count || 0,
        });
        setIsChecking(false);
      }
    }

    checkAuthAndData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  // Handler untuk toggle status
  async function handleToggleStatus() {
    setIsToggling(true);
    const result = await toggleProfileStatus();
    if (result.success) {
      setWorkStatus(result.newStatus);
    }
    setIsToggling(false);
  }

  if (isChecking) {
    return <main className="admin-loading">Memeriksa akses...</main>;
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="admin-brand" href="/" aria-label="Kembali ke portfolio">
            <span className="brand-mark">A</span>
            <span>
              <strong>Achmad Aldino</strong>
              <small>Portfolio admin</small>
            </span>
          </Link>
          <div className="admin-account">
            <span>{user?.email}</span>
            <button type="button" onClick={handleLogout}>
              <FiLogOut aria-hidden="true" /> Keluar
            </button>
          </div>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="admin-kicker"><span /> Dashboard</span>
            <h1>Selamat datang<br /><em>di ruang kerja.</em></h1>
            <p>Kelola dan tinjau bagian portfolio Achmad Aldino dari satu dashboard.</p>
            
            {/* --- TOMBOL TOGGLE STATUS - SESUAI TEMA --- */}
            <div className="mt-6 p-5 bg-[#fafafa] border border-[#e5e5e5] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  workStatus === "available" 
                    ? "bg-[#e3fcef] border-2 border-[#4fd69c]" 
                    : "bg-[#f5f5f5] border-2 border-[#d4d4d4]"
                }`}>
                  {workStatus === "available" ? (
                    <FiCheckCircle className="text-[#2d9d70] text-lg" />
                  ) : (
                    <FiXCircle className="text-[#888] text-lg" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1a1a] text-sm mb-0.5">Status Ketersediaan</h3>
                  <p className="text-xs text-[#666] leading-relaxed">
                    {workStatus === "available" 
                      ? "Portfolio menampilkan status \"Available for work\"" 
                      : "Portfolio menampilkan status \"Not Available\""}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`px-5 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wide transition-all duration-300 disabled:opacity-50 border-2 ${
                  workStatus === "available"
                    ? "bg-[#2d9d70] text-white border-[#2d9d70] hover:bg-[#248a62] hover:shadow-lg hover:shadow-[#2d9d70]/20"
                    : "bg-white text-[#666] border-[#d4d4d4] hover:bg-[#f5f5f5] hover:border-[#999]"
                }`}
              >
                {isToggling ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      workStatus === "available" ? "bg-white animate-pulse" : "bg-[#666]"
                    }`} />
                    {workStatus === "available" ? "Available for Work" : "Not Available"}
                  </span>
                )}
              </button>
            </div>
            {/* ------------------------------------------- */}
            
          </div>
          <Link className="admin-preview-link" href="/" target="_blank">
            <FiExternalLink aria-hidden="true" /> Lihat portfolio
          </Link>
        </section>

        <section className="admin-menu-section" aria-labelledby="admin-menu-title">
          <div className="admin-section-heading">
            <span id="admin-menu-title">Navigasi portfolio</span>
            <small>01 / 05</small>
          </div>
          <div className="admin-menu-grid">
            {adminMenu.map(({ label, href, icon: Icon }, index) => (
              <Link className="admin-menu-card" href={href} key={label}>
                <span className="admin-menu-index">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <strong>{label}</strong>
                <FiArrowUpRight className="admin-menu-arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-summary" aria-label="Portfolio summary">
          <article>
            <span>Skills</span>
            <strong>{counts.skills}</strong>
            <small>Keahlian terdaftar</small>
          </article>
          <article>
            <span>Experience</span>
            <strong>{counts.experience}</strong>
            <small>Pengalaman dan project</small>
          </article>
          <article>
            <span>Projects</span>
            <strong>{counts.projects}</strong>
            <small>Project portfolio</small>
          </article>
        </section>
      </div>
    </main>
  );
}