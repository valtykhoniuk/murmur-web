import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Character, Chat } from "../entities/types";
import { apiFetch } from "../lib/api";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard = ({ character }: CharacterCardProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function startChat() {
    setLoading(true);
    try {
      const chat = await apiFetch<Chat>("/chats", {
        method: "POST",
        body: { character_id: character.id },
      });
      navigate(`/chat/${chat.id}`);
    } catch {
      alert("Could not start chat. Are you logged in?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <li>
      <div>
        <strong>{character.name}</strong>
        <p title={character.start_message}>{character.start_message}</p>
      </div>
      <button
        type="button"
        className="btn"
        onClick={startChat}
        disabled={loading}
      >
        {loading ? "..." : "Chat"}
      </button>
    </li>
  );
};

export default CharacterCard;
