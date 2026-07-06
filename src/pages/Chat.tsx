import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import CharacterAvatar from "../components/CharacterAvatar";
import MessageBubble from "../components/MessageBubble";
import type { Chat, Message, SendMessageResponse, User } from "../entities/types";
import { apiFetch } from "../lib/api";

const ChatPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoBlocked =
    user?.role === "public" &&
    Boolean(error?.includes("Demo limit reached"));

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
        const [chat, messageList, currentUser] = await Promise.all([
          apiFetch<Chat>(`/chats/${chatId}`),
          apiFetch<Message[]>(`/chats/${chatId}/messages`),
          apiFetch<User>("/auth/me"),
        ]);

        setChatInfo(chat);
        setMessages(messageList);
        setUser(currentUser);
      } catch {
        setError("Could not load chat. Try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    loadChat();
  }, [chatId, navigate, location.key]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || !chatId || sending || demoBlocked) return;

    setSending(true);
    setError(null);
    setInput("");

    const tempUserId = -Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: tempUserId,
        chat_id: Number(chatId),
        role: "user",
        content,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const result = await apiFetch<SendMessageResponse>(
        `/chats/${chatId}/message`,
        {
          method: "POST",
          body: { content },
        },
      );

      setMessages((prev) => [
        ...prev.filter((message) => message.id !== tempUserId),
        result.user_message,
        result.assistant_message,
      ]);
    } catch (err) {
      setMessages((prev) =>
        prev.filter((message) => message.id !== tempUserId),
      );
      setInput(content);
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteChat() {
    if (!chatId || !chatInfo) return;

    const confirmed = window.confirm(
      `Delete chat #${chatInfo.id} with ${chatInfo.character_name}?`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await apiFetch<void>(`/chats/${chatId}`, { method: "DELETE" });
      navigate("/chats");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete chat.");
      setDeleting(false);
    }
  }

  return (
    <main className="page">
      <header className="chat-header">
        {chatInfo && (
          <CharacterAvatar
            name={chatInfo.character_name}
            avatarUrl={chatInfo.character_avatar_url}
            size={56}
          />
        )}
        <div>
          <h1 className="page__title">
            {chatInfo?.character_name ?? `Chat #${chatId}`}
          </h1>
          {chatInfo && (
            <p className="page__subtitle chat-header__meta">
              Chat #{chatInfo.id} · Powered by GPT
            </p>
          )}
          {chatInfo?.chat_settings && (
            <p className="page__subtitle">
              Active settings: temp {chatInfo.chat_settings.temperature.toFixed(1)}
              {" · "}
              {chatInfo.chat_settings.reply_length} replies
              {" · "}
              {chatInfo.chat_settings.speech_style} speech
              {" · "}
              {chatInfo.chat_settings.initiativity} plot
              {" · "}
              {chatInfo.chat_settings.max_messages} msgs memory
            </p>
          )}
          {user?.role === "public" && (
            <p className="page__subtitle demo-banner">
              Demo mode: limited to 20 messages total across all chats.
            </p>
          )}
        </div>
      </header>

      {loading && <p className="page__subtitle">Loading...</p>}
      {error && <p className="page__error">{error}</p>}

      <section className="chat-layout">
        <div
          className="card chat-messages"
          aria-label="Message history"
          aria-busy={sending}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {sending && (
            <p className="page__subtitle chat-messages__pending">
              Waiting for reply…
            </p>
          )}
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
              placeholder={
                demoBlocked
                  ? "Demo limit reached"
                  : "Type a message or paste an image URL..."
              }
              disabled={loading || sending || demoBlocked}
            />
          </div>
          <button
            type="submit"
            className="btn"
            disabled={loading || sending || demoBlocked}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </section>

      <div className="page__actions">
        <Link to={`/chat/${chatId}/settings`} className="btn btn--secondary">
          Chat settings
        </Link>
        <button
          type="button"
          className="btn btn--danger"
          onClick={handleDeleteChat}
          disabled={loading || deleting}
        >
          {deleting ? "Deleting..." : "Delete chat"}
        </button>
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
