import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Character, CharacterCreateInput } from "../entities/types";
import { apiFetch } from "../lib/api";

const CharacterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");
  const [startMessage, setStartMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const body: CharacterCreateInput = {
      name: name.trim(),
      persona: persona.trim(),
      start_message: startMessage.trim(),
      avatar_url: avatarUrl.trim(),
    };

    try {
      await apiFetch<Character>("/characters", {
        method: "POST",
        body,
      });
      navigate("/characters");
    } catch {
      setError("Could not create character. Check you are logged in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <h1 className="page__title">Create character</h1>
      <p className="page__subtitle">
        Structured character card — maps to POST /characters on the backend.
      </p>

      {error && (
        <p className="page__error">
          {error}
        </p>
      )}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Character name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="persona">Persona</label>
          <textarea
            id="persona"
            name="persona"
            rows={4}
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Personality, tone, background..."
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="startMessage">Start message</label>
          <textarea
            id="startMessage"
            name="startMessage"
            rows={3}
            value={startMessage}
            onChange={(e) => setStartMessage(e.target.value)}
            placeholder="First message when chat starts"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="avatarUrl">Avatar URL</label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://... (leave empty if none)"
          />
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Saving..." : "Save character"}
        </button>
      </form>

      <div className="page__actions">
        <Link to="/characters" className="btn btn--secondary">
          Back to list
        </Link>
      </div>
    </main>
  );
};

export default CharacterForm;
