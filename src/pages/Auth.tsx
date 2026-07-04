import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import type { TokenResponse } from "../entities/types";

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const data = await apiFetch<TokenResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      localStorage.setItem("token", data.access_token);
      navigate("/characters");
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <main className="page">
      <h1 className="page__title">Sign in</h1>
      <p className="page__subtitle">
        Email and password. Backend will return a JWT after login.
      </p>

      {error && (
        <p className="page__error">
          {error}
        </p>
      )}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
