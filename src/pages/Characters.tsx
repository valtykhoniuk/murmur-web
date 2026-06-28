import { Link } from "react-router-dom";

const Characters = () => {
  return (
    <main className="page">
      <h1 className="page__title">Your characters</h1>
      <p className="page__subtitle">
        Pick a character to chat with, or create a new one.
      </p>

      <ul className="character-list">
        <li>
          <div>
            <strong>Demo character</strong>
            <p>Placeholder — load from GET /characters later.</p>
          </div>
          <Link to="/chat/demo" className="btn">
            Chat
          </Link>
        </li>
      </ul>

      <div className="page__actions">
        <Link to="/characters/new" className="btn">
          Create character
        </Link>
        <Link to="/" className="btn btn--secondary">
          Home
        </Link>
      </div>
    </main>
  );
};

export default Characters;
