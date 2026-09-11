import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";

const links = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Achmad Aldino home">
          <span className="brand-mark">A</span>
          <span className="brand-copy"><strong>Achmad Aldino</strong><small>Web Developer / Portfolio</small></span>
        </Link>
        <div className="nav-links">
          <span className="nav-status"><span /> Available for work</span>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
          <Link className="nav-contact" href="/contact">
            Contact <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
