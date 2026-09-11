import { FiArrowUpRight, FiBriefcase } from "react-icons/fi";
import Link from "next/link";
import { portfolioData } from "../../data/portfolioData";

export default function ExperienceSection() {
  return (
    <section className="experience-section" id="experience">
      <div className="section-shell split-section experience-inner">
        <div className="section-heading">
          <div className="section-kicker"><FiBriefcase /> 03 / Experience</div>
          <h2>Things I&apos;ve<br /><em>worked on.</em></h2>
        </div>
        <div className="experience-list">
          {portfolioData.experience.slice(0, 3).map((item) => (
            <article className="experience-item" key={item.role}>
              <p className="item-meta">{item.period}</p>
              <div><h3>{item.role}</h3><p className="company-name">{item.company}</p><p className="item-description">{item.description}</p></div>
            </article>
          ))}
          <Link className="experience-detail-link" href="/experience">View full experience <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
