import { useEffect, useState } from "react";

export const useGitHubRepos = (username) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await response.json();
        // Ordina per data di aggiornamento decrescente
        data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setRepos(data);
      } catch (err) {
        console.error("Errore fetch GitHub:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  return { repos, loading };
};