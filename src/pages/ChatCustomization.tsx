import { Link } from "react-router-dom";

const ChatCustomization = () => {
  return (
    <main className="page">
      <h1 className="page__title">Chat settings</h1>
      <p className="page__subtitle">
        MVP: temperature and reply length. Saved per chat in settings_json.
      </p>

      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <div className="form-field">
          <label htmlFor="temperature">
            Temperature <span>(0 = focused, 1 = creative)</span>
          </label>
          <input
            id="temperature"
            name="temperature"
            type="range"
            min={0}
            max={1}
            step={0.1}
            defaultValue={0.7}
          />
        </div>

        <div className="form-field">
          <label htmlFor="replyLength">Reply length</label>
          <select id="replyLength" name="replyLength" defaultValue="medium">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <button type="submit" className="btn">
          Save settings
        </button>
      </form>

      <div className="page__actions">
        <Link to="/chat/demo" className="btn btn--secondary">
          Back to chat
        </Link>
      </div>
    </main>
  );
};

export default ChatCustomization;
