import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="section-shell footer-inner">
        <div className="footer-topline">
          <div className="footer-brand"><span className="brand-mark">A</span><div><strong>Achmad Aldino</strong><p>Web Developer &amp; Creative Builder</p></div></div>
          <p className="footer-note">Let&apos;s make something<br /><em>meaningful.</em></p>
        </div>
        <div className="footer-bottomline">
          <div className="footer-nav">
            <span>Explore</span>
            <Link href="/#about">About</Link>
            <Link href="/#skills">Skills</Link>
            <Link href="/#experience">Experience</Link>
            <Link href="/#projects">Projects</Link>
          </div>
          <Link className="footer-email" href="/contact">Let&apos;s talk <FiArrowUpRight /></Link>
          <p className="copyright">© 2026 Achmad Aldino. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
