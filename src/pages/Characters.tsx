import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import CharacterCard from "../components/CharacterCard";
import type { Character } from "../entities/types";
import { apiFetch } from "../lib/api";
import { ensureSession } from "../lib/session";

const Characters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const hasSession = await ensureSession({ demo: isDemo });
      if (!hasSession) {
        if (isDemo) {
          setError("Demo login failed. Start the backend: uvicorn on port 8000.");
          setLoading(false);
          return;
        }
        navigate("/auth");
        return;
      }

      try {
        const data = await apiFetch<Character[]>("/characters");
        setCharacters(data);
      } catch {
        setError("Could not load characters. Try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [navigate, isDemo]);

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
        <Link to="/chats" className="btn btn--secondary">
          Your chats
        </Link>
        <Link to="/" className="btn btn--secondary">
          Home
        </Link>
      </div>
    </main>
  );
};

export default Characters;
