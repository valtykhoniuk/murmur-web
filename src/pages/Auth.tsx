import { Link } from "react-router-dom";

const AuthPage = () => {
  return (
    <main className="page">
      <h1 className="page__title">Sign in</h1>
      <p className="page__subtitle">
        Email and password. Backend will return a JWT after login.
      </p>

      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn">
          Continue
        </button>
      </form>

      <div className="page__actions">
        <Link to="/" className="btn btn--secondary">
          Back
        </Link>
        <Link to="/characters" className="btn btn--secondary">
          Skip to characters (dev)
        </Link>
      </div>
    </main>
  );
};

export default AuthPage;
