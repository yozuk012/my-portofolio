import { FiArrowLeft, FiArrowUpRight, FiInstagram, FiMail, FiMapPin, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

export const metadata = {
  title: "Contact | Achmad Aldino",
  description: "Hubungi Achmad Aldino untuk membicarakan website, desain, dan proyek digital.",
};

export default function ContactPage() {
  return (
    <div id="top">
      <Navbar />
      <main className="contact-page">
        <section className="section-shell contact-shell">
          <div className="contact-intro">
            <Link className="back-link" href="/"><FiArrowLeft aria-hidden="true" /> Back home</Link>
            <div className="section-kicker"><FiMessageCircle /> 05 / Contact</div>
            <h1>Let&apos;s make<br /><em>something.</em></h1>
            <p>Saya terbuka untuk membicarakan website, desain antarmuka, dan proyek digital yang ingin Anda kembangkan.</p>
            <div className="contact-details">
              <a href="mailto:lorem@example.com"><FiMail aria-hidden="true" /><span><small>Email</small>lorem@example.com</span><FiArrowUpRight aria-hidden="true" /></a>
              <a href="https://instagram.com/achmad.aldino" target="_blank" rel="noreferrer"><FiInstagram aria-hidden="true" /><span><small>Instagram</small>@achmad.aldino</span><FiArrowUpRight aria-hidden="true" /></a>
              <a href="https://wa.me/6289683027911" target="_blank" rel="noreferrer"><FiMessageCircle aria-hidden="true" /><span><small>WhatsApp</small>089683027911</span><FiArrowUpRight aria-hidden="true" /></a>
              <div><FiMapPin aria-hidden="true" /><span><small>Based in</small>Banyuwangi, Indonesia</span></div>
            </div>
          </div>
          <div className="contact-form-wrap">
            <div className="contact-form-heading"><span>Start a conversation</span><strong>01 — 03</strong></div>
            <form className="contact-form" action="mailto:lorem@example.com" method="post" encType="text/plain">
              <label htmlFor="name">Your name<input id="name" name="name" type="text" placeholder="Nama Anda" required /></label>
              <label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="you@example.com" required /></label>
              <label htmlFor="message">Tell me about it<textarea id="message" name="message" rows="5" placeholder="Ceritakan tentang proyek Anda..." required /></label>
              <button className="contact-submit" type="submit">Send message <FiArrowUpRight aria-hidden="true" /></button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}