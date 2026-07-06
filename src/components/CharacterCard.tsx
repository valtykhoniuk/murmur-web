import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Character, Chat } from "../entities/types";
import { apiFetch } from "../lib/api";
import CharacterAvatar from "./CharacterAvatar";

interface CharacterCardProps {
  character: Character;
  onDeleted: (characterId: number) => void;
}

const CharacterCard = ({ character, onDeleted }: CharacterCardProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function startChat() {
    setLoading(true);
    try {
      const chat = await apiFetch<Chat>("/chats", {
        method: "POST",
        body: { character_id: character.id },
      });
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start chat.";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${character.name}"? All chats with this character will be removed.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await apiFetch<void>(`/characters/${character.id}`, { method: "DELETE" });
      onDeleted(character.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete character.";
      alert(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li>
      <div className="list-item__content">
        <CharacterAvatar name={character.name} avatarUrl={character.avatar_url} />
        <div className="list-item__body">
          <strong>{character.name}</strong>
          <p title={character.start_message}>{character.start_message}</p>
        </div>
      </div>
      <div className="list-item__actions">
        <button
          type="button"
          className="btn"
          onClick={startChat}
          disabled={loading || deleting}
        >
          {loading ? "..." : "Chat"}
        </button>
        <Link
          to={`/characters/${character.id}/edit`}
          className="btn btn--secondary"
        >
          Edit
        </Link>
        <button
          type="button"
          className="btn btn--danger"
          onClick={handleDelete}
          disabled={loading || deleting}
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>
    </li>
  );
};

export default CharacterCard;
