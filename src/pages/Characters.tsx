import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import CharacterCard from "../components/CharacterCard";
import type { Character, User } from "../entities/types";
import { apiFetch } from "../lib/api";
import { clearSession, ensureSession } from "../lib/session";

const Characters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const [characters, setCharacters] = useState<Character[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const hasSession = await ensureSession({ demo: isDemo });
      if (!hasSession) {
        if (isDemo) {
          setError(
            "Demo login failed. The server may be waking up — go Home and try demo again in 30 seconds.",
          );
          setLoading(false);
          return;
        }
        navigate("/auth");
        return;
      }

      try {
        const [data, currentUser] = await Promise.all([
          apiFetch<Character[]>("/characters"),
          apiFetch<User>("/auth/me"),
        ]);
        setCharacters(data);
        setUser(currentUser);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load characters. Try logging in again.",
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [navigate, isDemo]);

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  return (
    <main className="page">
      <h1 className="page__title">Your characters</h1>
      <p className="page__subtitle">
        Pick a character to chat with, or create a new one.
      </p>

      {user && (
        <p className="page__subtitle account-banner">
          Signed in as <strong>{user.email}</strong>
          {user.role === "public" && (
            <>
              {" "}
              · Shared demo account (same characters for all demo visitors)
            </>
          )}
        </p>
      )}

      {loading && <p className="page__subtitle">Loading...</p>}
      {error && <p className="page__error">{error}</p>}

      {!loading && !error && characters.length === 0 && (
        <p className="page__subtitle">No characters yet. Create your first one.</p>
      )}

      <ul className="character-list">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onDeleted={(id) =>
              setCharacters((prev) => prev.filter((item) => item.id !== id))
            }
          />
        ))}
      </ul>

      <div className="page__actions">
        <Link to="/characters/new" className="btn">
          Create character
        </Link>
        <Link to="/chats" className="btn btn--secondary">
          Your chats
        </Link>
        <button type="button" className="btn btn--secondary" onClick={handleLogout}>
          Log out
        </button>
        <Link to="/" className="btn btn--secondary">
          Home
        </Link>
      </div>
    </main>
  );
};

export default Characters;
