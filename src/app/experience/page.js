import { FiArrowLeft, FiBriefcase } from "react-icons/fi";
import Link from "next/link";
import { portfolioData } from "../../data/portfolioData";

export const metadata = {
  title: "Experience | Achmad Aldino",
  description: "Pengalaman Achmad Aldino dalam pengembangan web, desain, dan pembuatan konten digital.",
};

export default function ExperiencePage() {
  return (
    <div id="top">
      <main className="experience-page">
        <div className="experience-page-shell">
          <aside className="experience-page-intro">
            <Link className="back-link experience-back-link" href="/"><FiArrowLeft aria-hidden="true" /> Back home</Link>
            <div className="section-kicker"><FiBriefcase /> 03 / Experience</div>
            <h1>Things I&apos;ve<br /><em>worked on.</em></h1>
            <p>Berbagai pengalaman dalam membangun sistem web, merancang antarmuka, membuat konten, dan mengembangkan proyek interaktif.</p>
          </aside>
          <section className="experience-page-list" aria-label="Work experience">
            {portfolioData.experience.map((item, index) => (
              <article className="experience-page-item" key={item.role}>
                <div className="experience-page-index">0{index + 1}</div>
                <div className="experience-page-date">{item.period}</div>
                <div className="experience-page-copy">
                  <h2>{item.role}</h2>
                  <span>{item.company}</span>
                  <p>{item.description}</p>
                  <div className="experience-evidence" role="img" aria-label={`Bukti ${item.role}`} style={{ backgroundImage: `url(${item.evidence})` }}>
                    <span>Evidence / {String(index + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}