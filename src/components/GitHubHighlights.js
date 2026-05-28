import React from "react";
import { useGitHubRepos } from "./hooks/useGitHubRepos";
import './GitHubHighlights.css';

const GitHubHighlights = ({ username = "Unix69", maxItems = 6 }) => {
  const { repos, loading } = useGitHubRepos(username);

  if (loading) return <p>Loading GitHub repositories...</p>;

  // Ordina per data di aggiornamento decrescente
  const sortedRepos = [...repos].sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );

  return (
    <section className="github-highlights-container">
      <h2 className="highlights-title">GitHub Highlights</h2>
      <div className="highlights-grid">
        {sortedRepos.slice(0, maxItems).map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="highlight-card"
          >
            <h3 className="repo-name">{repo.name}</h3>
            {repo.description && <p className="repo-description">{repo.description}</p>}
            <div className="repo-info">
              {repo.language && <span className="repo-language">{repo.language}</span>}
              <span className="repo-stars">⭐ {repo.stargazers_count}</span>
              <span className="repo-forks">🍴 {repo.forks_count}</span>
            </div>
            <div className="repo-updated">
              Updated: {new Date(repo.updated_at).toLocaleDateString()}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default GitHubHighlights;