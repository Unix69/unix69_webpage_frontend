import React from "react";
import profileData from "../data/ProfileData";

import GitHubLogo from "../logo/GitHubLogo.svg";
import LinkedInLogo from "../logo/LinkedInLogo.svg";
import GmailLogo from "../logo/GmailLogo.png";

import ReactLogo from "../logo/ReactLogo.svg";
import JSLogo from "../logo/JSLogo.svg";
import HTMLLogo from "../logo/HTMLLogo.svg";
import CSSLogo from "../logo/CSSLogo.svg";

import "./Footer.css";

const Footer = () => {

  const year = new Date().getFullYear();

  const {
    name,
    role,
    email,
    orcid,
    orcidLink,
    cvFile,
    contacts
  } = profileData;

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-about">
          <h3>{name}</h3>
          <p className="footer-role">{role}</p>

          <p className="footer-bio">
            Research engineer focused on intelligent systems,
            distributed architectures and system-level AI integration.
          </p>

          <p className="footer-quote">
            “Engineering intelligent systems that extend the capabilities of operating systems.”
          </p>
        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">
          <h4>Navigation</h4>

          <a href="/">Home</a>
          <a href="/profile">Profile</a>
          <a href="#projects">Projects</a>
          <a href="#resources">Resources</a>
          <a href="#contacts">Contact</a>
          <a href="#blog">Blog</a>
        </div>


        {/* PROFESSIONAL LINKS */}
        <div className="footer-professional">
          <h4>Professional</h4>

          <a href={orcidLink} target="_blank" rel="noopener noreferrer">
            ORCID: {orcid}
          </a>

          <a href={contacts.github} target="_blank" rel="noopener noreferrer">
            <img src={GitHubLogo} alt="GitHub"/>
            GitHub
          </a>

          <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">
            <img src={LinkedInLogo} alt="LinkedIn"/>
            LinkedIn
          </a>

          <a href={`mailto:${email}`}>
            <img src={GmailLogo} alt="Email"/>
            Email
          </a>

          {cvFile.map((cv, i) => (
            <a key={i} href={cv.path} download>
              Download CV
            </a>
          ))}

        </div>


        {/* TECH + SITE */}
        <div className="footer-site">
          <h4>Site</h4>
          <div className="footer-powered">
            <h4>Powered by</h4>
                <div className="footer-tech">

                    <span>
                    <img src={ReactLogo} alt="React"/>
                    React
                    </span>

                    <span>
                    <img src={JSLogo} alt="JavaScript"/>
                    JavaScript
                    </span>

                    <span>
                    <img src={HTMLLogo} alt="HTML5"/>
                    HTML5
                    </span>

                    <span>
                    <img src={CSSLogo} alt="CSS3"/>
                    CSS3
                    </span>

                </div>

                <a
                    href="https://github.com/Unix69"
                    target="_blank"
                    rel="noopener noreferrer">
                    Source Code ↗
                </a>
                </div>

        </div>

      </div>


      {/* BOTTOM BAR */}
      <div className="footer-bottom">

        <p>
          © {year} {name} — All rights reserved
        </p>

        <p className="footer-location">
          Turin · Italy
        </p>

      </div>

    </footer>
  );
};

export default Footer;