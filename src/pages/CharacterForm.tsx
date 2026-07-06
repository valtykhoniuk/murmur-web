import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CharacterAvatar from "../components/CharacterAvatar";
import type { Character, CharacterCreateInput } from "../entities/types";
import { apiFetch } from "../lib/api";

const CharacterForm = () => {
  const navigate = useNavigate();
  const { characterId } = useParams();
  const isEditing = Boolean(characterId);

  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");
  const [startMessage, setStartMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    if (!characterId) return;

    async function loadCharacter() {
      try {
        const character = await apiFetch<Character>(`/characters/${characterId}`);
        setName(character.name);
        setPersona(character.persona);
        setStartMessage(character.start_message);
        setAvatarUrl(character.avatar_url);
      } catch {
        setError("Could not load character.");
      } finally {
        setLoading(false);
      }
    }

    loadCharacter();
  }, [characterId]);

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
      if (isEditing && characterId) {
        await apiFetch<Character>(`/characters/${characterId}`, {
          method: "PUT",
          body,
        });
      } else {
        await apiFetch<Character>("/characters", {
          method: "POST",
          body,
        });
      }
      navigate("/characters");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Could not ${isEditing ? "update" : "create"} character.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p className="page__subtitle">Loading...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h1 className="page__title">
        {isEditing ? "Edit character" : "Create character"}
      </h1>
      <p className="page__subtitle">
        Paste an image URL to show an avatar in the character list and chat
        header.
      </p>

      {error && <p className="page__error">{error}</p>}

      <form className="card" onSubmit={handleSubmit}>
        {name && (
          <div className="form-preview">
            <CharacterAvatar name={name} avatarUrl={avatarUrl} size={72} />
            <span className="form-preview__label">Avatar preview</span>
          </div>
        )}

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
            placeholder="https://example.com/avatar.png"
          />
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save changes" : "Save character"}
        </button>
      </form>

      <div className="page__actions">
        <Link to="/characters" className="btn btn--secondary">
          Back to list
        </Link>
        <Link to="/chats" className="btn btn--secondary">
          Your chats
        </Link>
      </div>
    </main>
  );
};

export default CharacterForm;
