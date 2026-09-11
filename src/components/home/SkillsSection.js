"use client";

import { FiArrowUpRight, FiCode } from "react-icons/fi";
import Link from "next/link";
import { portfolioData } from "../../data/portfolioData";

export default function SkillsSection() {
  return (
    <section className="skills-band" id="skills">
      <div className="section-shell skills-inner">
        <div className="section-kicker"><FiCode /> 01 / Skills</div>
        <div className="skills-marquee" aria-label="Skills and tools">
          <div className="skills-marquee-track">
            {[...portfolioData.skills, ...portfolioData.skills].map((skill, index) => (
              <span className={`skill-chip chip-${index % 3}`} key={`${skill}-${index}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
        <Link className="skills-detail-link" href="/skills">View all skills <FiArrowUpRight aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
