import { FiArrowUpRight, FiLayers, FiFileText } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const statusLabels = {
  done: "Done",
  progress: "In Progress",
  inactive: "Inactive",
};

export default async function ProjectShowcase() {
  // 1. Ambil projects yang di-set untuk homepage (is_featured = true)
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("order_index", { ascending: true })
    .limit(3);

  const displayProjects = projects || [];

  return (
    <section className="section-shell projects-section" id="projects">
      <div className="projects-heading">
        <div>
          <div className="section-kicker">
            <FiLayers /> 04 / Selected work
          </div>
          <h2>
            Selected<br />
            <em>projects.</em>
          </h2>
        </div>
        <div className="projects-heading-side">
          <p>Beberapa project pilihan yang saya bangun untuk kebutuhan web, desain, dan pengalaman digital.</p>
          <Link className="projects-all-link" href="/projects">
            View all projects <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      
      <div className="project-grid">
        {displayProjects.slice(0, 3).map((project, index) => (
          <Link 
            className="project-card" 
            href={`/projects#${project.id || index}`}
            key={project.id || index}
          >
            <div 
              className={`project-visual visual-${project.color || 'blue'} ${!project.thumbnail_url ? 'project-visual-no-image' : ''}`}
            >
              {project.thumbnail_url ? (
                <div className="project-visual-media">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title || "Project thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="project-visual-img"
                    unoptimized={true}
                  />
                </div>
              ) : (
                <FiFileText className="project-no-image-icon" aria-hidden="true" />
              )}
              <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="visual-shape" />
              <FiArrowUpRight className="project-arrow" aria-hidden="true" />
            </div>
            <div className="project-content">
              <div className={`project-status status-${project.status || 'done'}`}>
                <span /> {statusLabels[project.status] || "Done"}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="tag-row">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}