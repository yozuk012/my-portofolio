import { FiArrowUpRight, FiLayers } from "react-icons/fi";
import Link from "next/link";
import { portfolioData } from "../../data/portfolioData";

const statusLabels = {
  done: "Done",
  progress: "In Progress",
  inactive: "Inactive",
};

export default function ProjectShowcase() {
  return (
    <section className="section-shell projects-section" id="projects">
      <div className="projects-heading">
        <div><div className="section-kicker"><FiLayers /> 04 / Selected work</div><h2>Selected<br /><em>projects.</em></h2></div>
        <div className="projects-heading-side"><p>Beberapa project pilihan yang saya bangun untuk kebutuhan web, desain, dan pengalaman digital.</p><Link className="projects-all-link" href="/projects">View all projects <FiArrowUpRight aria-hidden="true" /></Link></div>
      </div>
      <div className="project-grid">
        {portfolioData.projects.slice(0, 3).map((project) => (
          <a className="project-card" href="#contact" key={project.title}>
            <div className={`project-visual visual-${project.color}`} style={{ backgroundImage: `url(${project.image})` }}><span>{project.number}</span><div className="visual-shape" /><FiArrowUpRight className="project-arrow" /></div>
            <div className="project-content"><div className={`project-status status-${project.status}`}><span /> {statusLabels[project.status]}</div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          </a>
        ))}
      </div>
    </section>
  );
}
