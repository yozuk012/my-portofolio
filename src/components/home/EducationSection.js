import { FiBookOpen } from "react-icons/fi";
import { portfolioData } from "../../data/portfolioData";

export default function EducationSection() {
  return (
    <section className="section-shell split-section" id="education">
      <div className="section-heading">
        <div className="section-kicker"><FiBookOpen /> 02 / Education</div>
        <h2>A little bit<br /><em>of background.</em></h2>
      </div>
      <div className="education-list">
        {portfolioData.education.map((item) => (
          <article className="education-item" key={item.title}>
            <div className={`education-icon icon-${item.accent}`}><FiBookOpen /></div>
            <div><p className="item-meta">{item.year}</p><h3>{item.title}</h3><p className="item-description">{item.description}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
