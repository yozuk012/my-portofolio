import { FiBookOpen } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export default async function EducationSection() {
  // 1. Ambil data education dari database
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("order_index", { ascending: true });

  const displayEducation = education || [];

  // Helper untuk format tahun
  const formatYear = (item) => {
    if (item.end_label) {
      return `${item.start_year} - ${item.end_label}`;
    }
    if (item.end_year) {
      return `${item.start_year} - ${item.end_year}`;
    }
    return `${item.start_year} - Sekarang`;
  };

  return (
    <section className="section-shell split-section" id="education">
      <div className="section-heading">
        <div className="section-kicker">
          <FiBookOpen /> 02 / Education
        </div>
        <h2>
          A little bit<br />
          <em>of background.</em>
        </h2>
      </div>
      <div className="education-list">
        {displayEducation.map((item, index) => (
          <article className="education-item" key={item.id || index}>
            <div className={`education-icon icon-${item.accent_color || item.accent || "yellow"}`}>
              <FiBookOpen />
            </div>
            <div>
              <p className="item-meta">{formatYear(item)}</p>
              <h3>{item.institution}</h3>
              {item.degree && <p className="text-sm text-gray-600 mt-1">{item.degree}</p>}
              {item.description && <p className="item-description">{item.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}