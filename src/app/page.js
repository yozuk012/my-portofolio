import { getProfile, getProjects, getExperiences } from "@/lib/supabase";
import EducationSection from "../components/home/EducationSection";
import ExperienceSection from "../components/home/ExperienceSection";
import HeroSection from "../components/home/HeroSection";
import ProjectShowcase from "../components/home/ProjectShowcase";
import SkillsSection from "../components/home/SkillsSection";

export default async function Home() {
  try {
    console.log("=== SUPABASE CONNECTION TEST ===");
    console.log("🔗 Testing connection...");

    const profile = await getProfile();
    console.log("👤 Profile:", profile ? "✅ Found" : "⚠️ Not found (empty table)");
    if (profile) console.log("   Data:", profile);

    const projects = await getProjects(3, true);
    console.log("📁 Projects:", `${projects.length} record(s) found`);
    if (projects.length > 0) console.log("   Sample:", projects[0]);

    const experiences = await getExperiences();
    console.log(" Experiences:", `${experiences.length} record(s) found`);
    if (experiences.length > 0) console.log("   Sample:", experiences[0]);

    console.log("================================");
  } catch (error) {
    console.error(" Supabase Connection Error:", error.message);
  }

  return (
    <div className="home-page" id="top">
      <main>
        <HeroSection />
        <SkillsSection />
        <EducationSection />
        <ExperienceSection />
        <ProjectShowcase />
      </main>
    </div>
  );
}