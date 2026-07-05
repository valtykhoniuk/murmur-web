import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import MessageBubble from "../components/MessageBubble";
import type { Chat, Message, SendMessageResponse } from "../entities/types";
import { apiFetch } from "../lib/api";

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }

    if (!chatId) {
      navigate("/chats");
      return;
    }

    async function loadChat() {
      try {
        const [chat, messageList] = await Promise.all([
          apiFetch<Chat>(`/chats/${chatId}`),
          apiFetch<Message[]>(`/chats/${chatId}/messages`),
        ]);

        setChatInfo(chat);
        setMessages(messageList);
      } catch {
        setError("Could not load chat. Try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    loadChat();
  }, [chatId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || !chatId || sending) return;

    setSending(true);
    setError(null);

    try {
      const data = await apiFetch<SendMessageResponse>(
        `/chats/${chatId}/message`,
        {
          method: "POST",
          body: { content },
        },
      );
      setMessages((prev) => [
        ...prev,
        data.user_message,
        data.assistant_message,
      ]);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page">
      <header>
        <h1 className="page__title">
          {chatInfo?.character_name ?? `Chat #${chatId}`}
        </h1>
        <p className="page__subtitle">Powered by GPT</p>
      </header>

      {loading && <p className="page__subtitle">Loading...</p>}
      {error && <p className="page__error">{error}</p>}

      <section className="chat-layout">
        <div className="card chat-messages" aria-label="Message history">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="message">Your message</label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading || sending}
            />
          </div>
          <button type="submit" className="btn" disabled={loading || sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </section>

      <div className="page__actions">
        <Link to={`/chat/${chatId}/settings`} className="btn btn--secondary">
          Chat settings
        </Link>
        <Link to="/chats" className="btn btn--secondary">
          All chats
        </Link>
        <Link to="/characters" className="btn btn--secondary">
          Characters
        </Link>
      </div>
    </main>
  );
};

export default ChatPage;
