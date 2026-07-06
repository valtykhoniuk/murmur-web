import { Link } from "react-router-dom";

const Start = () => {
  return (
    <main className="page">
      <h1 className="page__title">Murmur</h1>
      <p className="page__subtitle">
        Choose how you want to enter. Demo is rate-limited; owner and friend
        accounts use login.
      </p>

      <div className="choice-grid">
        <Link to="/auth?mode=login" className="choice-card">
          <strong>Owner</strong>
          <span>Sign in with email and password.</span>
        </Link>

        <Link to="/auth?mode=login" className="choice-card">
          <strong>For friends</strong>
          <span>Sign in with email and password.</span>
        </Link>

        <Link to="/characters?demo=1" className="choice-card">
          <strong>Try demo</strong>
          <span>
            Public demo account — 20 messages total, no signup required.
          </span>
        </Link>
      </div>
    </main>
  );
};

export default Start;
