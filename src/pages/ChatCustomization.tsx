import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";

import { apiFetch } from "../lib/api";
import type { Chat, Initiativity, ReplyLength, SpeechStyle } from "../entities/types";

const ChatCustomization = () => {
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState(0.7);
  const [replyLength, setReplyLength] = useState<ReplyLength>("medium");
  const [speechStyle, setSpeechStyle] = useState<SpeechStyle>("equal");
  const [initiativity, setInitiativity] = useState<Initiativity>("medium");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { chatId } = useParams();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }

    if (!chatId) {
      navigate("/chats");
      return;
    }

    async function loadChatSettings() {
      try {
        const chat = await apiFetch<Chat>(`/chats/${chatId}`);
        setTemperature(chat.chat_settings.temperature);
        setReplyLength(chat.chat_settings.reply_length);
        setSpeechStyle(chat.chat_settings.speech_style);
        setInitiativity(chat.chat_settings.initiativity);
      } catch {
        setError("Could not load chat settings. Try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    loadChatSettings();
  }, [navigate, chatId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chatId || saving) return;

    setSaving(true);
    setError(null);

    const body = {
      temperature,
      reply_length: replyLength,
      speech_style: speechStyle,
      initiativity,
    };

    try {
      await apiFetch<Chat>(`/chats/${chatId}`, {
        method: "PATCH",
        body,
      });
      navigate(`/chat/${chatId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save chat settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <h1 className="page__title">Chat settings</h1>
      <p className="page__subtitle">Saved per chat — affects how the character replies.</p>

      {loading && <p className="page__subtitle">Loading...</p>}
      {error && <p className="page__error">{error}</p>}

      {!loading && (
        <form className="card" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="temperature">
              Temperature <span>(0 = focused, 1 = creative) — {temperature.toFixed(1)}</span>
            </label>
            <input
              id="temperature"
              name="temperature"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              type="range"
              min={0}
              max={1}
              step={0.1}
              disabled={saving}
            />
          </div>

          <div className="form-field">
            <label htmlFor="replyLength">Reply length</label>
            <select
              id="replyLength"
              name="replyLength"
              value={replyLength}
              onChange={(e) => setReplyLength(e.target.value as ReplyLength)}
              disabled={saving}
            >
              <option value="short">Short (5 sentences)</option>
              <option value="medium">Medium (10 sentences)</option>
              <option value="long">Long (15 sentences)</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="speechStyle">Speech vs actions</label>
            <select
              id="speechStyle"
              name="speechStyle"
              value={speechStyle}
              onChange={(e) => setSpeechStyle(e.target.value as SpeechStyle)}
              disabled={saving}
            >
              <option value="talkative">
                More talkative (speaking &gt; actions)
              </option>
              <option value="equal">Equal (speaking = actions)</option>
              <option value="initiative">
                Less talkative (speaking &lt; actions)
              </option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="initiativity">Initiativity</label>
            <select
              id="initiativity"
              name="initiativity"
              value={initiativity}
              onChange={(e) => setInitiativity(e.target.value as Initiativity)}
              disabled={saving}
            >
              <option value="rock">Rock (doesn't move plot by themselves)</option>
              <option value="medium">Medium</option>
              <option value="long">
                Initiative (can move plot as they wish)
              </option>
            </select>
          </div>

          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </button>
        </form>
      )}

      <div className="page__actions">
        <Link to={`/chat/${chatId}`} className="btn btn--secondary">
          Back to chat
        </Link>
      </div>
    </main>
  );
};

export default ChatCustomization;
