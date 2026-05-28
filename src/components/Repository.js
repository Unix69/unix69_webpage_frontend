import { v4 as uuidv4 } from "uuid";
import React from "react";
import "./Repository.css";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export default class Repository {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name || "unknown";
    this.fullName = data.full_name || "";
    this.description = data.description || "";
    this.url = data.html_url || "";
    this.cloneUrl = data.clone_url || "";
    this.owner = data.owner?.login || "unknown";
    this.ownerUrl = data.owner?.html_url || "";
    this.ownerAvatar = data.owner?.avatar_url || "";

    this.license = data.license?.name || "MIT";
    this.visibility = data.private ? "private" : "public";
    this.status = data.archived ? "archived" : data.fork ? "fork" : "active";

    this.creationDate = data.created_at ? new Date(data.created_at) : new Date();
    this.lastUpdate = data.updated_at ? new Date(data.updated_at) : new Date();
    this.stars = data.stargazers_count || 0;
    this.forks = data.forks_count || 0;
    this.openIssues = data.open_issues_count || 0;
    this.pullRequests = 0; // verrà fetchato separatamente

    this.documentationLink = data.has_wiki ? `${this.url}/wiki` : null;
    this.liveDemoLink = data.liveDemoLink || null;
    this.screenshots = data.screenshots || [];

    this.languages = [];
    this.contributors = [];
    const firstLetter = (this.name || "R")[0].toUpperCase();

    this.coverColor = this.generateColorFromString(this.name);

    this.coverImage = data.coverImage || null;
  }

  generateColorFromString(str) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return `hsl(${hash % 360}, 40%, 70%)`;
  }

  // Copia git clone
  copyGitClone() {
    navigator.clipboard.writeText(`git clone ${this.cloneUrl}`);
    alert(`Git clone URL copied:\n${this.cloneUrl}`);
  }

  // Fetch dei linguaggi
  async fetchLanguages(signal) {
    const res = await fetch(`https://api.github.com/repos/${this.fullName}/languages`, {
      signal,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    });
    if (!res.ok) throw new Error(`Cannot fetch languages: ${res.status}`);
    const data = await res.json();
    this.languages = Object.keys(data);
  }

  // Fetch dei contributors
  async fetchContributors(signal) {
    const res = await fetch(`https://api.github.com/repos/${this.fullName}/contributors`, {
      signal,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    });
    if (!res.ok) return;
    const data = await res.json();
    this.contributors = data.map(c => ({
      login: c.login,
      url: c.html_url,
      avatar: c.avatar_url
    }));
  }

  // Fetch dei pull requests aperti
  async fetchPullRequests(signal) {
    const res = await fetch(`https://api.github.com/repos/${this.fullName}/pulls?state=open`, {
      signal,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    });
    if (!res.ok) return;
    const data = await res.json();
    this.pullRequests = data.length;
  }

  // STATIC fetch tutte le repos
  static async fetchAllByUsername(username, signal) {
    const res = await fetch(`https://api.github.com/users/${username}/repos`, {
      signal,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    });
    if (!res.ok) throw new Error(`Cannot fetch repos: ${res.status}`);
    const reposData = await res.json();

    const repos = await Promise.all(
      reposData.map(async (data) => {
        const repo = new Repository(data);

        try {
          console.log(process.env.REACT_APP_GITHUB_TOKEN);
          await repo.fetchLanguages(signal);
          await repo.fetchContributors(signal);
          await repo.fetchPullRequests(signal);
        } catch (err) {
          console.warn("Error fetching metadata:", repo.fullName, err);
        }

        return repo;
      })
    );

    return repos;
  }

  // Fetch README con autenticazione token
  async fetchReadme(signal) {
    const url = `https://api.github.com/repos/${this.fullName}/readme`;
    try {
      const res = await fetch(url, {
        signal,
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw"
        }
      });
      if (res.ok) {
        this.readme = await res.text();
        return this.readme;
      }
    } catch (err) {
      console.warn("Error fetching README:", err);
    }
    this.readme = "README not found";
    return this.readme;
  }

  async fetchFiles(signal) {
    const url = `https://api.github.com/repos/${this.fullName}/contents/`;
    try {
      const res = await fetch(url, {
        signal,
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      if (res.ok) {
        const data = await res.json();
        this.files = data.map(f => ({
          name: f.name,
          path: f.path,
          download_url: f.download_url
        }));
      }
    } catch (err) {
      console.warn("Error fetching repo files:", err);
      this.files = [];
    }
  }



  openPreview() {
    const event = new CustomEvent("openRepoPreview", { detail: this });
    window.dispatchEvent(event);
  }

  renderCard() {
    return (
      <a
        key={this.id}
        href={this.url}
        target="_blank"
        rel="noopener noreferrer"
        className="repo-card-link"
      >
        <div className="repo-card">
          {/* COVER SOPRA */}
          {this.coverImage ? (
            <img
              src={this.coverImage}
              alt={`${this.name} cover`}
              className="repo-cover"
            />
          ) : (
            <div
              className="repo-cover repo-cover-placeholder"
              style={{ backgroundColor: this.coverColor }}
            >
              {this.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* HEADER: titolo e avatar SOTTO */}
          <div className="repo-header">
            <div className="repo-name">{this.name}</div>
            <img
              src={this.ownerAvatar}
              alt={this.owner}
              className="repo-owner-avatar"
            />
          </div>

          {/* BODY: descrizione, stats, linguaggi, azioni */}
          <div className="repo-body">
            {this.description && (
              <p className="repo-description">{this.description}</p>
            )}

            <div className="repo-stats">
              ⭐ {this.stars} 🍴 {this.forks} 🐛 {this.openIssues} 🔀 {this.pullRequests}
            </div>

            {this.languages.length > 0 && (
              <div className="repo-languages">
                {this.languages.map((lang) => (
                  <span key={lang} className="repo-language">
                    {lang}
                  </span>
                ))}
              </div>
            )}

            <div className="repo-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  this.copyGitClone();
                }}
              >
                Copy git clone
              </button>

              {this.documentationLink && (
                <a
                  href={this.documentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-doc-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  Wiki / Docs
                </a>
              )}

              {this.liveDemoLink && (
                <a
                  href={this.liveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-demo-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Demo
                </a>
              )}

              <button
                className="repo-preview-button"
                onClick={(e) => {
                  e.stopPropagation();
                  this.openPreview();
                }}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </a>
    );
  }
}



