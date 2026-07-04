import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CharacterCard from "../components/CharacterCard";
import type { Character } from "../entities/types";
import { apiFetch } from "../lib/api";

const Characters = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    async function loadCharacters() {
      try {
        const data = await apiFetch<Character[]>("/characters");
        setCharacters(data);
      } catch {
        setError("Could not load characters. Try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, [navigate]);

  return (
    <main className="page">
      <h1 className="page__title">Your characters</h1>
      <p className="page__subtitle">
        Pick a character to chat with, or create a new one.
      </p>

      {loading && <p className="page__subtitle">Loading...</p>}
      {error && (
        <p className="page__error">
          {error}
        </p>
      )}

      {!loading && !error && characters.length === 0 && (
        <p className="page__subtitle">No characters yet. Create your first one.</p>
      )}

      <ul className="character-list">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </ul>

      <div className="page__actions">
        <Link to="/characters/new" className="btn">
          Create character
        </Link>
        <Link to="/" className="btn btn--secondary">
          Home
        </Link>
      </div>
    </main>
  );
};

export default Characters;
