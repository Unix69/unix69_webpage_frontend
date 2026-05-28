import React, { useState, useEffect } from "react";
import "./RepositoriesSearchBar.css";

export default function RepositoriesSearchBar({ repos, onSearchChange }) {

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    language: [],
    stars: 0,
    visibility: "all",
    fork: "all",
    archived: false,
    topics: [],
    license: "all",
    issues: false,
    size: 0,
    activity: "all"
  });

  const [availableFilters, setAvailableFilters] = useState({
    language: [],
    topics: [],
    licenses: []
  });

  const [suggestions, setSuggestions] = useState([]);

  /* ---------------- FILTRI DINAMICI ---------------- */
  useEffect(() => {

    const languages = [...new Set(repos.flatMap(r => r.languages))];

    const topics = [...new Set(repos.flatMap(r => r.topics || []))];

    const licenses = [...new Set(
      repos.map(r => r.license?.name).filter(Boolean)
    )];

    setAvailableFilters({ language: languages, topics, licenses });

  }, [repos]);

  /* ---------------- SEARCH ---------------- */
  const handleChange = (value) => {
    setQuery(value);

    if (value.length > 1) {
      setSuggestions(
        repos.filter(r => r.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }

    onSearchChange(value, activeFilters);
  };

  const updateFilter = (key, value) => {
    const updated = { ...activeFilters, [key]: value };
    setActiveFilters(updated);
    onSearchChange(query, updated);
  };

  const toggleArrayFilter = (key, value) => {
    const arr = activeFilters[key];
    const updated = arr.includes(value)
      ? arr.filter(v => v !== value)
      : [...arr, value];

    updateFilter(key, updated);
  };

  return (
    <div className="repositories-searchbar-container">

      {/* INPUT */}
      <div className="repositories-searchbar-main">
        <input
          type="text"
          placeholder="Search repositories..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
        />
        <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
          ⚙️
        </button>
      </div>

      {/* AUTOCOMPLETE */}
      {suggestions.length > 0 && (
        <div className="autocomplete-box">
          {suggestions.map(repo => (
            <div key={repo.id} onClick={() => handleChange(repo.name)}>
              {repo.name}
            </div>
          ))}
        </div>
      )}

      {/* PANEL FILTRI */}
      {showFilters && (
    <div className="filters-panel">

      {/* ⭐ STARS */}
      <div className="filter-group">
        <span>Stars:</span>
        {[1,2,3,4,5].map(n => (
          <span
            key={n}
            className={activeFilters.stars >= n ? "star active" : "star"}
            onClick={() => updateFilter("stars", n)}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* 🌍 VISIBILITY */}
      <div className="filter-group inline-filters">
        <span>Visibility:</span>
        {["all", "public", "private"].map(v => (
          <button
            key={v}
            className={`filter-option ${activeFilters.visibility === v ? "active" : ""}`}
            onClick={() => updateFilter("visibility", v)}
          >
            {v}
          </button>
        ))}
      </div>

      {/* 🔀 FORK */}
      <div className="filter-group inline-filters">
        <span>Fork:</span>
        {["all", "forked", "original"].map(v => (
          <button
            key={v}
            className={`filter-option ${activeFilters.fork === v ? "active" : ""}`}
            onClick={() => updateFilter("fork", v)}
          >
            {v}
          </button>
        ))}
      </div>

      {/* 📦 ARCHIVED */}
      <div className="filter-group">
        <span>Archived:</span>
        <input
          type="checkbox"
          checked={activeFilters.archived}
          onChange={(e) => updateFilter("archived", e.target.checked)}
        />
      </div>

      {/* 🏷️ TOPICS */}
      <div className="filter-group">
        <span>Topics:</span>
        {availableFilters.topics.map(t => (
          <button
            key={t}
            className={activeFilters.topics.includes(t) ? "active" : ""}
            onClick={() => toggleArrayFilter("topics", t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 📜 LICENSE */}
      <div className="filter-group">
        <span>License:</span>
        <select
          value={activeFilters.license}
          onChange={(e) => updateFilter("license", e.target.value)}
        >
          <option value="all">All</option>
          {availableFilters.licenses.map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* 🐛 ISSUES */}
      <div className="filter-group">
        <span>Has Issues:</span>
        <input
          type="checkbox"
          checked={activeFilters.issues}
          onChange={(e) => updateFilter("issues", e.target.checked)}
        />
      </div>

      {/* 📊 SIZE */}
      <div className="filter-group">
        <span>Size:</span>
        <input
          type="range"
          min="0"
          max="1000"
          value={activeFilters.size}
          onChange={(e) => updateFilter("size", e.target.value)}
        />
      </div>

      {/* ⏱️ ACTIVITY */}
      <div className="filter-group inline-filters">
        <span>Activity:</span>
        {["all","recent","active","stale"].map(v => (
          <button
            key={v}
            className={`filter-option ${activeFilters.activity === v ? "active" : ""}`}
            onClick={() => updateFilter("activity", v)}
          >
            {v}
          </button>
        ))}
      </div>

    </div>
  )}
      </div>
    );
  }