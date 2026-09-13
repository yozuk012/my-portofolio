import { FiArrowUpRight, FiCode } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function SkillsSection() {
  // 1. Ambil skills yang di-set untuk marquee
  const { data: skills } = await supabase
    .from("skills")
    .select("name, accent_color")
    .eq("show_in_marquee", true)
    .order("marquee_order", { ascending: true });

  const displaySkills = skills || [];

  // Helper untuk mapping accent_color ke class chip
  const getChipClass = (accentColor, index) => {
    if (accentColor === "red") return "chip-1";
    if (accentColor === "green") return "chip-2";
    return `chip-${index % 3}`;
  };

  return (
    <section className="skills-band" id="skills">
      <div className="section-shell skills-inner">
        <div className="section-kicker"><FiCode /> 01 / Skills</div>
        <div className="skills-marquee" aria-label="Skills and tools">
          <div className="skills-marquee-track">
            {/* Duplikasi untuk efek infinite scroll */}
            {[...displaySkills, ...displaySkills].map((skill, index) => (
              <span 
                className={`skill-chip ${getChipClass(skill.accent_color, index)}`} 
                key={`${skill.name}-${index}`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
        <Link className="skills-detail-link" href="/skills">
          View all skills <FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}