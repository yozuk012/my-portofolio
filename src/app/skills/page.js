import { FiArrowLeft, FiCode } from "react-icons/fi";
import Link from "next/link";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import { portfolioData } from "../../data/portfolioData";

export const metadata = {
  title: "Skills | Achmad Aldino",
  description: "Keahlian Achmad Aldino dalam web development, desain, video editing, dan teknologi kreatif.",
};

const skillLevels = portfolioData.skills.map(() => 8);

export default function SkillsPage() {
  return (
    <div id="top">
      <Navbar />
      <main className="skills-page">
        <section className="section-shell skills-page-hero">
          <Link className="back-link" href="/"><FiArrowLeft aria-hidden="true" /> Back home</Link>
          <div className="section-kicker"><FiCode /> 01 / Skills</div>
          <h1>Things I <em>know.</em></h1>
          <p className="skills-page-intro">Keahlian yang saya gunakan untuk membangun website, merancang pengalaman pengguna, dan membuat konten digital yang menarik.</p>
        </section>
        <section className="section-shell skills-detail-grid" aria-label="Skills list">
          {portfolioData.skills.map((skill, index) => (
            <article className={`skill-detail-card chip-${index % 3}`} key={skill}>
              <span className="skill-detail-number">0{index + 1}</span>
              <h2>{skill}</h2>
              <p>Keahlian yang saya gunakan dalam berbagai project digital.</p>
              <div className="skill-score-row">
                <span>Level</span>
                <strong>{skillLevels[index]} / 10</strong>
              </div>
              <div className="skill-progress" role="progressbar" aria-label={`${skill} level`} aria-valuemin="1" aria-valuemax="10" aria-valuenow={skillLevels[index]}>
                <span style={{ width: `${skillLevels[index] * 10}%` }} />
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}