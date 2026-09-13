import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const links = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
];

export default async function Navbar() {
  // 1. Ambil status dari database
  const { data: profile } = await supabase
    .from("profile")
    .select("status")
    .limit(1)
    .maybeSingle();

  // 2. Tentukan apakah statusnya available (default ke true jika data belum ada)
  const isAvailable = profile?.status === "available" || !profile;

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Achmad Aldino home">
          <span className="brand-mark">A</span>
          <span className="brand-copy">
            <strong>Achmad Aldino</strong>
            <small>Web Developer / Portfolio</small>
          </span>
        </Link>
        
        <div className="nav-links">
          {/* 3. Status Dinamis */}
          <span className="nav-status">
            {/* Dot indikator dengan warna dinamis */}
            <span 
              style={{ 
                background: isAvailable ? 'var(--green)' : 'var(--muted)', 
                boxShadow: isAvailable ? '0 0 0 4px rgba(52, 168, 83, .14)' : 'none' 
              }} 
            />
            {isAvailable ? "Available for work" : "Not available"}
          </span>

          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          
          <Link className="nav-contact" href="/contact">
            Contact <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}