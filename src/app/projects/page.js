import { FiArrowLeft, FiArrowUpRight, FiLayers, FiFileText } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Projects | Achmad Aldino",
  description: "Kumpulan project Achmad Aldino dalam pengembangan web, desain, animasi, dan teknologi interaktif.",
};

const statusLabels = {
  done: "Done",
  progress: "In Progress",
  inactive: "Inactive",
};

export default async function ProjectsPage() {
  // 1. Ambil data projects dari database (hanya yang published)
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  const displayProjects = projects || [];

  return (
    <div id="top">
      <main className="projects-page">
        <section className="section-shell projects-page-hero">
          <Link className="back-link" href="/">
            <FiArrowLeft aria-hidden="true" /> Back home
          </Link>
          <div className="section-kicker">
            <FiLayers /> 04 / Selected work
          </div>
          <h1>
            All my <em>projects.</em>
          </h1>
          <p>
            Kumpulan project yang saya kerjakan dalam pengembangan web, desain antarmuka, animasi, dan teknologi interaktif.
          </p>
        </section>

        <section className="section-shell projects-page-grid" aria-label="All projects">
          {displayProjects.map((project, index) => (
            <article className="projects-page-card" key={project.id || index}>
              {/* Visual / Thumbnail */}
              <div 
                className={`project-visual visual-${project.color || 'blue'} ${!project.thumbnail_url ? 'project-visual-no-image' : ''}`}
              >
                {project.thumbnail_url ? (
                  <div className="project-visual-media">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title || "Project thumbnail"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      className="project-visual-img"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <FiFileText className="project-no-image-icon" aria-hidden="true" />
                )}
                <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="visual-shape" />
                
                {/* --- PERUBAHAN DI SINI: Arrow menjadi Link jika ada demo_url --- */}
                {project.demo_url ? (
                  <a 
                    href={project.demo_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-arrow-link"
                    aria-label={`Lihat demo project ${project.title}`}
                  >
                    <FiArrowUpRight className="project-arrow" aria-hidden="true" />
                  </a>
                ) : (
                  <FiArrowUpRight className="project-arrow" aria-hidden="true" />
                )}
                {/* ------------------------------------------------------------- */}
              </div>

              {/* Content */}
              <div className="projects-page-card-content">
                <div className={`project-status status-${project.status || 'done'}`}>
                  <span /> {statusLabels[project.status] || "Done"}
                </div>
                <h2>{project.title}</h2>
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
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}