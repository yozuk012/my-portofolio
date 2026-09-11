import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import EducationSection from "../components/home/EducationSection";
import ExperienceSection from "../components/home/ExperienceSection";
import HeroSection from "../components/home/HeroSection";
import ProjectShowcase from "../components/home/ProjectShowcase";
import SkillsSection from "../components/home/SkillsSection";

export default function Home() {
  return (
    <div className="home-page" id="top">
      <Navbar />
      <main>
        <HeroSection />
        <SkillsSection />
        <EducationSection />
        <ExperienceSection />
        <ProjectShowcase />
      </main>
      <Footer />
    </div>
  );
}