import React from "react";
import { useState } from "react";

import "./Profile.css";

import profileData from "../data/ProfileData";
import profilePhoto from "../photo/profile_photo.jpg";


import GitHubLogo from "../logo/GitHubLogo.svg";
import TelegramLogo from "../logo/TelegramLogo.svg";
import GmailLogo from "../logo/GmailLogo.png";
import LinkedInLogo from "../logo/LinkedInLogo.svg";

import ProfileTechnologies from './ProfileTechnologies';

const Profile = () => {

  const {
    name, role, cvFile,
    summary, education, researchInterests,
    workTimeline, companies, publications, contacts
  } = profileData;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profilePhoto} alt="Profile" className="profile-photo"/>
        <div>
          <h1>{name}</h1>
          <h2>{role}</h2>
          {profileData.orcid && (
            <p className="orcid">
                ORCID: <a href={profileData.orcidLink} target="_blank" rel="noopener noreferrer">{profileData.orcid}</a>
            </p>
          )}
          {cvFile.map((cv, i) => (
            <a key={i} href={cv.path} download className="cv-download">
                Download {cv.name} (PDF)
            </a>))}
        </div>
      </div>

      <section>
        <h3>Professional Summary</h3>
        <p>{summary}</p>
      </section>

      <section>
        <h3>Education</h3>
        {education.map((edu, i) => (
          <div key={i} className="profile-card">
            <span className="period">{edu.period}</span>
            <div>
              <strong>{edu.title}</strong>
              <p>{edu.institution}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h3>Research Interests</h3>
        <div className="tag-container">
          {researchInterests.map((r, i) => (
            <span key={i} className="profile-tag">{r}</span>
          ))}
        </div>
      </section>

      <section>
        <h3>Work Experience</h3>
        <div className="timeline">
          {workTimeline.map((job, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot"></div>
              <div>
                <span className="period">{job.period}</span>
                <strong>{job.title}</strong>
                <p>{job.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Companies & Collaborations</h3>
        <div className="companies-container">
            {companies.map((company, i) => (
            <a 
                key={i} 
                href={company.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="company-card"
            >
                {company.logo && (
                <img src={company.logo} alt={company.name} className="company-logo"/>
                )}
                <div className="company-info">
                <strong>{company.name}</strong>
                <p>{company.role}</p>
                <span className="period">{company.period}</span>
                </div>
            </a>
            ))}
        </div>
      </section>

      <section>
        <h3>Publications</h3>
        <ul>
            {profileData.publications.map((pub, i) => (
            <li key={i}>
                <strong>{pub.title}</strong> — {pub.venue} &nbsp;
                <a href={pub.file} download>Download PDF</a>
            </li>
            ))}
        </ul>
      </section>

      
      <ProfileTechnologies />


      <section>
        <h3>Contacts</h3>
        <div className="contact-container">

          <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">
            <img src={LinkedInLogo} alt="LinkedIn"/> LinkedIn ↗
          </a>

          <a href={contacts.github} target="_blank" rel="noopener noreferrer">
            <img src={GitHubLogo} alt="GitHub"/> GitHub ↗
          </a>

          <a href={contacts.telegram} target="_blank" rel="noopener noreferrer">
            <img src={TelegramLogo} alt="Telegram"/> Telegram ↗
          </a>

          <a href={contacts.gmail}>
            <img src={GmailLogo} alt="Gmail"/> Gmail ↗
          </a>

        </div>
      </section>

    </div>
  );
};

export default Profile;