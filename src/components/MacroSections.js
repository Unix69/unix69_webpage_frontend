import React from "react";
import { useNavigate } from "react-router-dom";
import './MacroSections.css';

const MacroSections = () => {
  const navigate = useNavigate();

  // Macro-sezioni aggiornate
  const sections = [
    {
      title: "Projects",
      description: "Explore my personal and research projects, from AI to embedded systems.",
      path: "#projects"
    },
    {
      title: "Repositories",
      description: "Access code repositories, demos, and open-source contributions.",
      path: "#repositories"
    },
    {
      title: "Documentation",
      description: "Find detailed technical documentation, API references, and specifications.",
      path: "#documentation"
    },
    {
      title: "Learning",
      description: "Educational resources, tutorials, and guides for developers at all levels.",
      path: "#learning"
    },
    {
      title: "Guides",
      description: "Step-by-step guides to help you implement projects and solutions.",
      path: "#guides"
    },
    {
      title: "How-To",
      description: "Practical how-to articles and examples for solving common programming tasks.",
      path: "#howto"
    },
    {
      title: "Downloads",
      description: "Downloadable files, scripts, datasets, and software tools.",
      path: "#downloads"
    },
  ];

  return (
    <section className="macro-sections-container">
      {sections.map((section, idx) => (
        <div 
          key={idx} 
          className="macro-section-card"
          onClick={() => {
            if(section.path.startsWith("#")){
              const el = document.querySelector(section.path);
              if(el) el.scrollIntoView({ behavior: "smooth" });
            } else {
              navigate(section.path);
            }
          }}
        >
          <h2 className="macro-section-title">{section.title}</h2>
          <p className="macro-section-description">{section.description}</p>
        </div>
      ))}
    </section>
  );
};

export default MacroSections;