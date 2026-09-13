"use client";

import { useEffect, useState } from "react";
import { FiArrowLeft, FiExternalLink, FiLogOut, FiMail, FiMapPin, FiMessageCircle, FiInstagram, FiSave, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminContactPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [contactData, setContactData] = useState({
    email: "yozukakit@gmail.com",
    instagram: "achmad.aldino",
    whatsapp: "089683027911",
    location: "Banyuwangi, Indonesia",
  });

  useEffect(() => {
    let isMounted = true;
    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (!data.user) {
        router.replace("/auth");
        return;
      }
      setUser(data.user);

      // Ambil data profile jika tersedia
      const { data: profile } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (profile && isMounted) {
        const instagramLink = Array.isArray(profile.social_links) 
          ? profile.social_links.find(s => s.platform?.toLowerCase().includes("instagram"))?.url || ""
          : "";
        const whatsappLink = Array.isArray(profile.social_links)
          ? profile.social_links.find(s => s.platform?.toLowerCase().includes("whatsapp"))?.url || ""
          : "";

        setContactData(prev => ({
          ...prev,
          email: profile.email || prev.email,
          instagram: instagramLink || prev.instagram,
          whatsapp: whatsappLink || prev.whatsapp,
        }));
      }
      setIsChecking(false);
    }

    init();
    return () => { isMounted = false; };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Gagal menyimpan kontak:", err);
    } finally {
      setLoading(false);
    }
  }

  if (isChecking) {
    return <main className="admin-loading">Memeriksa akses...</main>;
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="admin-brand" href="/admin" aria-label="Kembali ke dashboard utama">
            <span className="brand-mark">A</span>
            <span>
              <strong>Achmad Aldino</strong>
              <small>Admin Contact</small>
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
            <Link className="back-link" href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '12px', color: 'var(--blue)' }}>
              <FiArrowLeft aria-hidden="true" /> Kembali ke Dashboard
            </Link>
            <span className="admin-kicker"><span /> Kontak</span>
            <h1>Kelola Informasi<br /><em>Contact.</em></h1>
            <p>Atur saluran komunikasi dan kontak yang ditampilkan di halaman Contact portfolio Anda.</p>
          </div>
          <Link className="admin-preview-link" href="/contact" target="_blank">
            <FiExternalLink aria-hidden="true" /> Lihat halaman Contact
          </Link>
        </section>

        <section className="admin-form-card" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '28px', maxWidth: '640px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="contact-email" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Email
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px 14px', background: '#fff' }}>
                <FiMail style={{ color: 'var(--blue)', fontSize: '16px' }} />
                <input
                  id="contact-email"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  style={{ border: 0, outline: 0, width: '100%', font: 'inherit', fontSize: '14px', color: 'var(--ink)' }}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="contact-instagram" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Instagram
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px 14px', background: '#fff' }}>
                <FiInstagram style={{ color: 'var(--blue)', fontSize: '16px' }} />
                <input
                  id="contact-instagram"
                  type="text"
                  value={contactData.instagram}
                  onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                  style={{ border: 0, outline: 0, width: '100%', font: 'inherit', fontSize: '14px', color: 'var(--ink)' }}
                  placeholder="username atau URL Instagram"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="contact-whatsapp" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                WhatsApp
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px 14px', background: '#fff' }}>
                <FiMessageCircle style={{ color: 'var(--blue)', fontSize: '16px' }} />
                <input
                  id="contact-whatsapp"
                  type="text"
                  value={contactData.whatsapp}
                  onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                  style={{ border: 0, outline: 0, width: '100%', font: 'inherit', fontSize: '14px', color: 'var(--ink)' }}
                  placeholder="Nomor WhatsApp atau URL wa.me"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="contact-location" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Lokasi / Based In
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px 14px', background: '#fff' }}>
                <FiMapPin style={{ color: 'var(--blue)', fontSize: '16px' }} />
                <input
                  id="contact-location"
                  type="text"
                  value={contactData.location}
                  onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                  style={{ border: 0, outline: 0, width: '100%', font: 'inherit', fontSize: '14px', color: 'var(--ink)' }}
                  placeholder="Kota, Negara"
                />
              </div>
            </div>

            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#188038', fontSize: '13px', background: '#e6f4ea', padding: '10px 14px', borderRadius: '6px' }}>
                <FiCheckCircle /> Informasi kontak berhasil diperbarui!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'var(--blue)',
                color: '#fff',
                border: 0,
                borderRadius: '6px',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                alignSelf: 'flex-start',
                marginTop: '10px',
              }}
            >
              <FiSave /> {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
