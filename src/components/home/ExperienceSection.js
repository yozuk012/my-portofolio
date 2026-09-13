import { FiArrowUpRight, FiBriefcase } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ExperienceSection() {
  // 1. Ambil experiences yang di-set untuk homepage (maksimal 3)
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .eq("show_on_homepage", true)
    .order("homepage_order", { ascending: true })
    .limit(3);

  const displayExperiences = experiences || [];

  return (
    <section className="experience-section" id="experience">
      <div className="section-shell split-section experience-inner">
        <div className="section-heading">
          <div className="section-kicker">
            <FiBriefcase /> 03 / Experience
          </div>
          <h2>
            Things I&apos;ve<br />
            <em>worked on.</em>
          </h2>
        </div>
        <div className="experience-list">
          {displayExperiences.slice(0, 3).map((item, index) => (
            <article className="experience-item" key={item.id || index}>
              <p className="item-meta">PROJECT {String(index + 1).padStart(2, "0")}</p>
              <div>
                <h3>{item.title}</h3>
                <p className="company-name">{item.category}</p>
                <p className="item-description">{item.description}</p>
              </div>
            </article>
          ))}
          <Link className="experience-detail-link" href="/experience">
            View full experience <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}