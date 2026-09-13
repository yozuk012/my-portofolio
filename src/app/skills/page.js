import { FiArrowLeft, FiCode } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Skills | Achmad Aldino",
  description: "Keahlian Achmad Aldino dalam web development, desain, video editing, dan teknologi kreatif.",
};

// 1. DEFINISI WARNA YANG SAMA PERSIS DENGAN ADMIN PANEL
// Ini memastikan mapping warna konsisten di seluruh aplikasi
const colorMap = {
  blue: "chip-0",    // Biru
  red: "chip-1",     // Merah  
  green: "chip-2",   // Hijau
  indigo: "chip-3",  // Indigo (tambahkan class chip-3 di CSS jika perlu)
  purple: "chip-4",  // Ungu
  orange: "chip-5",  // Oranye
  teal: "chip-6",    // Teal
  slate: "chip-7",   // Slate/Abu-abu
};

// Helper untuk mendapatkan class chip berdasarkan accent_color dari database
const getChipClass = (accentColor) => {
  // Jika warna ada di map, gunakan itu. Jika tidak, fallback ke chip-0 (biru)
  return colorMap[accentColor] || "chip-0";
};

export default async function SkillsPage() {
  // 1. Ambil data skills dari database
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  const displaySkills = skills || [];

  return (
    <div id="top">
      <main className="skills-page">
        <section className="section-shell skills-page-hero">
          <Link className="back-link" href="/">
            <FiArrowLeft aria-hidden="true" /> Back home
          </Link>
          <div className="section-kicker">
            <FiCode /> 01 / Skills
          </div>
          <h1>
            Things I <em>know.</em>
          </h1>
          <p className="skills-page-intro">
            Keahlian yang saya gunakan untuk membangun website, merancang pengalaman pengguna, dan membuat konten digital yang menarik.
          </p>
        </section>

        <section className="section-shell skills-detail-grid" aria-label="Skills list">
          {displaySkills.map((skill, index) => (
            <article 
              // PERBAIKAN: Gunakan helper getChipClass yang sudah diperbarui
              className={`skill-detail-card ${getChipClass(skill.accent_color)}`} 
              key={skill.id || skill.name}
            >
              <span className="skill-detail-number">0{index + 1}</span>
              <h2>{skill.name}</h2>
              <p>{skill.description}</p>
              <div className="skill-score-row">
                <span>Level</span>
                <strong>{skill.level} / 10</strong>
              </div>
              <div 
                className="skill-progress" 
                role="progressbar" 
                aria-label={`${skill.name} level`} 
                aria-valuemin="1" 
                aria-valuemax="10" 
                aria-valuenow={skill.level}
              >
                <span style={{ width: `${skill.level * 10}%` }} />
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}