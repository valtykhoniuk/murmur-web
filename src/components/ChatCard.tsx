import { useState } from "react";
import { Link } from "react-router-dom";

import type { Chat } from "../entities/types";
import { apiFetch } from "../lib/api";
import CharacterAvatar from "./CharacterAvatar";

interface ChatCardProps {
  chat: Chat;
  onDeleted: (chatId: number) => void;
}

const ChatCard = ({ chat, onDeleted }: ChatCardProps) => {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete chat #${chat.id} with ${chat.character_name}?`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await apiFetch<void>(`/chats/${chat.id}`, { method: "DELETE" });
      onDeleted(chat.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete chat.";
      alert(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li>
      <div className="list-item__content">
        <CharacterAvatar
          name={chat.character_name}
          avatarUrl={chat.character_avatar_url}
        />
        <div className="list-item__body">
          <strong>
            {chat.character_name}{" "}
            <span className="list-item__meta">#{chat.id}</span>
          </strong>
          <p className="list-item__meta">
            {new Date(chat.created_at).toLocaleString()} · {chat.message_count}{" "}
            messages
          </p>
          {chat.preview && (
            <p title={chat.preview}>{chat.preview}</p>
          )}
        </div>
      </div>
      <div className="list-item__actions">
        <Link to={`/chat/${chat.id}`} className="btn">
          Open
        </Link>
        <button
          type="button"
          className="btn btn--danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>
    </li>
  );
};

export default ChatCard;
