import { Link } from "react-router-dom";

const CharacterForm = () => {
  return (
    <main className="page">
      <h1 className="page__title">Create character</h1>
      <p className="page__subtitle">
        Structured character card — maps to POST /characters on the backend.
      </p>

      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Character name" required />
        </div>

        <div className="form-field">
          <label htmlFor="persona">Persona</label>
          <textarea
            id="persona"
            name="persona"
            rows={4}
            placeholder="Personality, tone, background..."
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="greeting">Greeting</label>
          <textarea
            id="greeting"
            name="greeting"
            rows={3}
            placeholder="First message when chat starts"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="exampleDialogue">Example dialogue</label>
          <textarea
            id="exampleDialogue"
            name="exampleDialogue"
            rows={4}
            placeholder="A few lines showing how they speak"
          />
        </div>

        <div className="form-field">
          <label htmlFor="avatarUrl">Avatar URL (optional)</label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            placeholder="https://..."
          />
        </div>

        <button type="submit" className="btn">
          Save character
        </button>
      </form>

      <div className="page__actions">
        <Link to="/characters" className="btn btn--secondary">
          Back to list
        </Link>
      </div>
    </main>
  );
};

export default CharacterForm;
