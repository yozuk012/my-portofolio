import { FiArrowLeft, FiArrowUpRight, FiLayers } from "react-icons/fi";
import Link from "next/link";
import { portfolioData } from "../../data/portfolioData";

export const metadata = {
  title: "Projects | Achmad Aldino",
  description: "Kumpulan project Achmad Aldino dalam pengembangan web, desain, animasi, dan teknologi interaktif.",
};

const statusLabels = {
  done: "Done",
  progress: "In Progress",
  inactive: "Inactive",
};

export default function ProjectsPage() {
  return (
    <div id="top">
      <main className="projects-page">
        <section className="section-shell projects-page-hero">
          <Link className="back-link" href="/"><FiArrowLeft aria-hidden="true" /> Back home</Link>
          <div className="section-kicker"><FiLayers /> 04 / Selected work</div>
          <h1>All my <em>projects.</em></h1>
          <p>Kumpulan project yang saya kerjakan dalam pengembangan web, desain antarmuka, animasi, dan teknologi interaktif.</p>
        </section>
        <section className="section-shell projects-page-grid" aria-label="All projects">
          {portfolioData.projects.map((project) => (
            <article className="projects-page-card" key={project.title}>
              <div className={`project-visual visual-${project.color}`} style={{ backgroundImage: `url(${project.image})` }}><span>{project.number}</span><div className="visual-shape" /><FiArrowUpRight className="project-arrow" aria-hidden="true" /></div>
              <div className="projects-page-card-content">
                <div className={`project-status status-${project.status}`}><span /> {statusLabels[project.status]}</div>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}