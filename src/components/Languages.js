import React from "react";
import TechCard from "../components/TechCard";
import { languagesData } from "../data/LanguagesData";
import "./Languages.css";

export default function Languages() {
  return (
    <main className="languages-page">
      <header className="languages-header">
        <h1>Programming Languages</h1>
        <p>
          Explore the programming languages commonly used across <strong>systems programming</strong>,
          <strong> web development</strong>, <strong>machine learning</strong>, 
          <strong> distributed systems</strong> and <strong>embedded computing</strong>.
        </p>
      </header>

      <section className="tech-grid">
        {languagesData.map(lang => (
          <TechCard
            key={lang.name}
            name={lang.name}
            description={lang.description}
            reference={lang.reference}
            logo={lang.logo}
          />
        ))}
      </section>
    </main>
  );
}