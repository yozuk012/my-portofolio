import { FiArrowDown, FiArrowUpRight, FiGithub, FiInstagram, FiMessageCircle, FiMail } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/lib/supabase";

// Helper function untuk menentukan ikon berdasarkan nama platform/url
const getSocialIcon = (platform, url) => {
  // Ubah semua ke huruf kecil agar pengecekan konsisten
  const text = (platform + " " + url).toLowerCase();
  
  if (text.includes("github")) return <FiGithub />;
  if (text.includes("instagram")) return <FiInstagram />;
  if (text.includes("whatsapp") || text.includes("wa.me")) return <FiMessageCircle />;
  
  // PERBAIKAN: Gunakan huruf kecil "gmail" atau "mailto", dan kembalikan FiMail
  if (text.includes("gmail") || text.includes("mailto")) return <FiMail />;
  
  return <FiArrowUpRight />; // Fallback icon untuk LinkedIn, Twitter, dll
};

export default async function HeroSection() {
  // 1. Ambil data dari database (berjalan di server)
  const profile = await getProfile();
  const data = profile;

  if (!data) {
    return null;
  }

  // 2. Pisahkan nama untuk menjaga styling <em> pada nama belakang
  const rawName = data.full_name ? String(data.full_name).trim() : "Guest";
  const nameParts = rawName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  // 3. Ambil maksimal 3 skills utama
  const topSkills = Array.isArray(data.skills) ? data.skills.slice(0, 3) : [];

  // 4. Cek apakah ada avatar URL yang valid
  const hasAvatar = data.avatar_url && String(data.avatar_url).trim() !== "";
  
  // PERBAIKAN CACHE: Tambahkan query parameter unik agar browser mengambil gambar terbaru
  const avatarSrc = hasAvatar ? `${data.avatar_url}?v=${Date.now()}` : "";

  return (
    <section className="hero section-shell" id="about">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> Hello, I&apos;m</p>
        
        {/* Nama dinamis */}
        <h1>{firstName}<br /><em>{lastName}</em></h1>
        
        {/* Bio dinamis dengan fallback */}
        <p className="hero-intro">
          {data.bio || "Building digital experiences with a focus on UI/UX and modern web technologies."}
        </p>
        
        {/* Skills dinamis (Maksimal 3) */}
        <div className="hero-skills" aria-label="Core skills">
          {topSkills.map((skill, index) => (
            <span key={index}>{skill}</span>
          ))}
        </div>
        
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">View projects <FiArrowUpRight aria-hidden="true" /></a>
          <Link className="text-link" href="/contact">Let&apos;s talk <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
        
        {/* Social links dinamis berdasarkan array social_links */}
        <div className="social-row" aria-label="Social links">
          {Array.isArray(data.social_links) && data.social_links.map((social, index) => {
            if (!social.url) return null;
            
            return (
              <a 
                key={index} 
                href={social.url} 
                // Hapus target="_blank" jika ini adalah link mailto
                target={social.url.startsWith("mailto:") ? "_self" : "_blank"}
                rel={social.url.startsWith("mailto:") ? undefined : "noreferrer"} 
                aria-label={social.platform || "Social Link"}
              >
                {getSocialIcon(social.platform, social.url)}
              </a>
            );
          })}
        </div>
      </div>
      
      <div className="hero-art" aria-label="Foto Profil" role="img">
        {/* Foto dinamis atau Placeholder No Profile */}
        <div className="hero-photo relative w-full h-full">
          {hasAvatar && avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={`Foto ${data.full_name || "Profil"}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 350px, 430px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-1/2 h-1/2 text-gray-400"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
        
        {/* Role ditampilkan secara dinamis dengan fallback */}
        <span className="art-caption">{data.role || "Developer"}<br />Creative Builder</span>
      </div>
      
      <a className="scroll-cue" href="#skills" aria-label="Scroll to skills">
        <FiArrowDown /> Scroll to explore
      </a>
    </section>
  );
}