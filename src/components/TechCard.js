import React from "react";
import "./Languages.css";

export default function TechCard({ name, description, reference, logo }) {
  return (
    <div className="tech-card">
      <div className="tech-logo">
        {logo ? <img src={logo} alt={`${name} logo`} /> : <div className="logo-placeholder">{name[0]}</div>}
      </div>
      <div className="tech-info">
        <h2>{name}</h2>
        <p>{description}</p>
        <a href={reference} target="_blank" rel="noopener noreferrer" className="tech-link">
          Official Docs 🔗
        </a>
      </div>
    </div>
  );
}