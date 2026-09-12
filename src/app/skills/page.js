import { FiArrowLeft, FiCode } from "react-icons/fi";
import Link from "next/link";
import { portfolioData } from "../../data/portfolioData";

export const metadata = {
  title: "Skills | Achmad Aldino",
  description: "Keahlian Achmad Aldino dalam web development, desain, video editing, dan teknologi kreatif.",
};

const skillLevels = portfolioData.skills.map(() => 8);
const skillDescriptions = {
  Canva: "Membuat desain visual, presentasi, dan materi promosi dengan cepat.",
  CapCut: "Menyunting video pendek dengan transisi, teks, musik, dan efek visual.",
  Figma: "Merancang wireframe, prototype, dan antarmuka digital yang terstruktur.",
  "Adobe Photoshop": "Mengolah foto, membuat komposisi visual, dan menyempurnakan aset grafis.",
  "Adobe Illustrator": "Membuat ilustrasi, ikon, dan elemen visual berbasis vektor.",
  "UI Design": "Menyusun tampilan antarmuka yang jelas, konsisten, dan mudah digunakan.",
  "UX Research": "Memahami kebutuhan pengguna untuk membantu menentukan solusi produk.",
  "Video Editing": "Mengolah footage menjadi video informatif dan menarik untuk berbagai kebutuhan.",
  Branding: "Membangun identitas visual yang konsisten untuk memperkuat karakter sebuah brand.",
  "Content Design": "Menyusun visual dan pesan konten agar mudah dipahami oleh audiens.",
  Prototyping: "Mengubah ide menjadi simulasi interaktif sebelum masuk tahap pengembangan.",
  "Social Media": "Mempersiapkan konten digital yang relevan untuk mendukung komunikasi online.",
};

export default function SkillsPage() {
  return (
    <div id="top">
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
              <p>{skillDescriptions[skill]}</p>
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
    </div>
  );
}