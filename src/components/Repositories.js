import React, { useEffect, useState } from "react";
import Repository from "./Repository";
import RepositoriesSearchBar from "./RepositoriesSearchBar";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";
import "./Repositories.css";

const COLORS = ["#4da6ff", "#339966", "#ff9933", "#ff6666", "#9966ff", "#66cccc"];

export default function Repositories() {

  const [repos, setRepos] = useState([]);
  const [langData, setLangData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    language: [],
    stars: [],
    forks: [],
    updated: [],
  });

  const username = "unix69";
  const controller = new AbortController();

  useEffect(() => {

    async function fetchRepos() {

      try {
        const fetchedRepos = await Repository.fetchAllByUsername(
          username,
          controller.signal
        );

        setRepos(fetchedRepos);
        computeLanguageStats(fetchedRepos);
        computeUpdateTimeline(fetchedRepos);

      } catch (err) {
        console.error("Errore fetch repository:", err);
      } finally {
        setLoading(false);
      }

    }

    fetchRepos();
    return () => controller.abort();

  }, []);

  /* ---------- STATISTICHE ---------- */

  const computeLanguageStats = (repos) => {
    const langCounts = {};
    repos.forEach(repo => {
      repo.languages.forEach(lang => {
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      });
    });
    const data = Object.keys(langCounts).map(lang => ({
      name: lang,
      value: langCounts[lang]
    }));
    setLangData(data);
  };

  const computeUpdateTimeline = (repos) => {
    const timeline = {};
    repos.forEach(repo => {
      const month = repo.lastUpdate.toISOString().slice(0, 7);
      timeline[month] = (timeline[month] || 0) + 1;
    });
    const data = Object.keys(timeline)
      .sort()
      .map(month => ({
        month,
        updates: timeline[month]
      }));
    setUpdateData(data);
  };

  const filteredRepos = repos.filter(r => {
    const matchText = r.name?.toLowerCase().includes(search.toLowerCase());

    const matchLang =
      !filters.language?.length ||
      filters.language.some(lang => (r.languages || []).includes(lang));

    const matchStars = !filters.stars || r.stars >= filters.stars;

    const matchFork =
      !filters.fork || filters.fork === "all" ||
      (filters.fork === "forked" ? r.fork : !r.fork);

    const matchVisibility =
      !filters.visibility || filters.visibility === "all" ||
      (filters.visibility === "public" && !r.private) ||
      (filters.visibility === "private" && r.private);

    const matchArchived =
      filters.archived === false || r.archived === filters.archived;

    const matchLicense =
      !filters.license || filters.license === "all" ||
      r.license?.name === filters.license;

    const matchIssues =
      filters.issues === false || r.hasIssues === filters.issues;

    const matchSize = !filters.size || r.size <= filters.size;

    const matchActivity = !filters.activity || filters.activity === "all" || (() => {
      const diffDays = (new Date() - new Date(r.lastUpdate)) / (1000*3600*24);
      if (filters.activity === "recent") return diffDays < 7;
      if (filters.activity === "active") return diffDays < 30;
      if (filters.activity === "stale") return diffDays >= 30;
      return true;
    })();

    return matchText && matchLang && matchStars && matchFork &&
          matchVisibility && matchArchived &&
          matchLicense && matchIssues && matchSize && matchActivity;
  });

  /* ---------- METRICHE DASHBOARD ---------- */

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks, 0);
  const totalIssues = repos.reduce((sum, r) => sum + r.openIssues, 0);
  const totalPR = repos.reduce((sum, r) => sum + r.pullRequests, 0);

  return (
    <main className="repositories">

      {/* INTRO */}
      <section className="intro-section">
        <h1 className="blue-title">Repositories</h1>
        <p>
          This dashboard provides a comprehensive view of your <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <strong>GitHub repositories</strong>
          </a>, including <strong>language statistics</strong>, 
          <strong>development activity</strong>, and detailed <strong>project metrics</strong>.
          <br /><br />
          It supports efficient <strong>exploration</strong> and <strong>analysis</strong>, using <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <strong>React</strong></a> and <a href="https://recharts.org" target="_blank" rel="noopener noreferrer">
            <strong>Recharts</strong></a> to deliver both <strong>high-level insights</strong> and <strong>granular details</strong>.
        </p>
      </section>

      {/* SEARCH */}
      <section className="search-section">
        <RepositoriesSearchBar
          repos={repos}
          onSearchChange={(text, selectedFilters) => {
            setSearch(text);
            setFilters(selectedFilters);
          }}
        />
      </section>

      {loading && <p style={{ textAlign: "center" }}>Loading repository...</p>}

      {!loading && filteredRepos.length > 0 && (
        <>
          {/* REPOS LIST */}
          <section className="repos-list">
            <div className="repo-cards">
              {filteredRepos.map(repo => (
                <div key={repo.id} className="repo-card-wrapper">
                  <div className="repo-card">
                    {/* COVER */}
                    {repo.coverImage ? (
                      <img
                        src={repo.coverImage}
                        alt={`${repo.name} cover`}
                        className="repo-cover"
                      />
                    ) : (
                      <div
                        className="repo-cover repo-cover-placeholder"
                        style={{ backgroundColor: repo.coverColor }}
                      >
                        {repo.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* HEADER */}
                    <div className="repo-header">
                      <img src={repo.ownerAvatar} alt={repo.owner} className="repo-owner-avatar" />
                      <div className="repo-name">{repo.name}</div>
                    </div>

                    {/* DESCRIPTION */}
                    {repo.description && <p className="repo-description">{repo.description}</p>}

                    {/* STATS */}
                    <div className="repo-stats">
                      ⭐ {repo.stars} 🍴 {repo.forks} 🐛 {repo.openIssues} 🔀 {repo.pullRequests}
                    </div>

                    {/* LANGUAGES */}
                    {repo.languages.length > 0 && (
                      <div className="repo-languages">
                        {repo.languages.map(lang => (
                          <span key={lang} className="repo-language">{lang}</span>
                        ))}
                      </div>
                    )}

                    {/* AZIONI */}
                    <div className="repo-actions">
                      <button onClick={(e) => { e.stopPropagation(); repo.copyGitClone(); }}>Copy git clone</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DASHBOARD */}
          <section className="stats-dashboard">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-value">{repos.length}</div>
                <div className="stat-title">Repositories</div>
                <div className="stat-desc">Numero totale di repository</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">{totalStars}</div>
                <div className="stat-title">Stars</div>
                <div className="stat-desc">Popularity indicator</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">{totalForks}</div>
                <div className="stat-title">Forks</div>
                <div className="stat-desc">Fork dei progetti</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">{totalIssues}</div>
                <div className="stat-title">Open Issues</div>
                <div className="stat-desc">Open Issues</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">{totalPR}</div>
                <div className="stat-title">Pull Requests</div>
                <div className="stat-desc">PR revisions</div>
              </div>
            </div>
          </section>

          {/* CHARTS */}
          <section className="charts-section">
            <div className="chart-wrapper">
              <h2 className="orange-title">Linguaggi utilizzati</h2>
              <PieChart width={400} height={300}>
                <Pie
                  data={langData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {langData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </div>

            <div className="chart-wrapper">
              <h2 className="blue-title">Attività sviluppo</h2>
              <BarChart width={500} height={300} data={updateData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="updates" fill="#3399ff" />
              </BarChart>
            </div>
          </section>
        </>
      )}

      {!loading && filteredRepos.length === 0 && (
        <p style={{ textAlign: "center" }}>Nessuna repository trovata.</p>
      )}

    </main>
  );
}