import { FiArrowDown, FiArrowUpRight, FiGithub, FiInstagram, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero section-shell" id="about">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> Hello, I&apos;m</p>
        <h1>Achmad<br /><em>Aldino.</em></h1>
        <p className="hero-intro">Saya adalah seorang Web Developer yang membangun website modern, responsif, dan mudah digunakan. Saya memadukan teknologi, desain visual, serta perhatian pada detail untuk menciptakan pengalaman digital yang fungsional dan nyaman bagi setiap pengguna.</p>
        <div className="hero-skills" aria-label="Core skills">
          <span>Web Development</span><span>UI / UX</span><span>Figma</span><span>Video Editing</span>
        </div>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">View projects <FiArrowUpRight aria-hidden="true" /></a>
          <Link className="text-link" href="/contact">Let&apos;s talk <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="social-row" aria-label="Social links">
          <a href="https://github.com/yozuk012" target="_blank" rel="noreferrer" aria-label="Github yozuk012"><FiGithub /></a>
          <a href="https://instagram.com/achmad.aldino" target="_blank" rel="noreferrer" aria-label="Instagram achmad.aldino"><FiInstagram /></a>
          <a href="https://wa.me/6289683027911" target="_blank" rel="noreferrer" aria-label="WhatsApp 089683027911"><FiMessageCircle /></a>
        </div>
      </div>
      <div className="hero-art" aria-label="Foto Achmad Aldino" role="img">
        <div className="hero-photo" />
        <span className="art-caption">Web Developer<br />Creative Builder</span>
      </div>
      <a className="scroll-cue" href="#skills" aria-label="Scroll to skills"><FiArrowDown /> Scroll to explore</a>
    </section>
  );
}
