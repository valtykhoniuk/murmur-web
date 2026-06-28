import { Link } from "react-router-dom";

const Chat = () => {
  return (
    <main className="page">
      <header>
        <h1 className="page__title">Chat</h1>
        <p className="page__subtitle">
          Character name here · streaming replies via SSE later
        </p>
      </header>

      <section className="chat-layout">
        <div className="card chat-messages" aria-label="Message history">
          <div className="message message--assistant">
            Greeting from the character will appear here.
          </div>
          <div className="message message--user">User message example.</div>
          <div className="message message--assistant">
            Assistant reply — token stream will append here.
          </div>
        </div>

        <form className="card" onSubmit={(e) => e.preventDefault()}>
          <div className="form-field">
            <label htmlFor="message">Your message</label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Type a message..."
            />
          </div>
          <button type="submit" className="btn">
            Send
          </button>
        </form>
      </section>

      <div className="page__actions">
        <Link to="/chat/demo/settings" className="btn btn--secondary">
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

export default Chat;
