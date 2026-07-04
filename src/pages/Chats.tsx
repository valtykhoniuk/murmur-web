import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ChatCard from "../components/ChatCard";
import type { Chat } from "../entities/types";
import { apiFetch } from "../lib/api";

const Chats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    async function loadChats() {
      try {
        const data = await apiFetch<Chat[]>("/chats");
        setChats(data);
      } catch {
        setError("Could not load chats. Try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    loadChats();
  }, [navigate]);

  return (
    <main className="page">
      <h1 className="page__title">Your chats</h1>
      <p className="page__subtitle">All your conversations.</p>

      {loading && <p className="page__subtitle">Loading...</p>}
      {error && (
        <p className="page__subtitle" style={{ color: "#b00020" }}>
          {error}
        </p>
      )}

      {!loading && !error && chats.length === 0 && (
        <p className="page__subtitle">
          No chats yet. Pick a character and start talking.
        </p>
      )}

      <ul className="character-list">
        {chats.map((chat) => (
          <ChatCard key={chat.id} chat={chat} />
        ))}
      </ul>

      <div className="page__actions">
        <Link to="/characters" className="btn btn--secondary">
          Characters
        </Link>
        <Link to="/" className="btn btn--secondary">
          Home
        </Link>
      </div>
    </main>
  );
};

export default Chats;
