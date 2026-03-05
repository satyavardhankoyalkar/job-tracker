import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await API.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = res.data.access_token;

      if (token) {
          localStorage.setItem("token", token);
          navigate("/dashboard");
      } else {
          setError("Login failed.");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: -200px; left: -200px;
          border-radius: 50%;
          pointer-events: none;
        }

        .login-root::after {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%);
          bottom: -150px; right: -150px;
          border-radius: 50%;
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 1;
          background: rgba(18, 18, 28, 0.85);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 48px 44px;
          width: 420px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }

        .login-icon svg { width: 24px; height: 24px; fill: white; }

        .login-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .login-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 36px;
          font-weight: 300;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .field-wrap {
          margin-bottom: 20px;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .field-input::placeholder { color: rgba(255,255,255,0.2); }

        .field-input:focus {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          background: rgba(255,255,255,0.07);
        }

        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          padding: 10px 14px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(99,102,241,0.35);
          letter-spacing: 0.02em;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(99,102,241,0.45);
        }

        .login-btn:active:not(:disabled) { transform: translateY(0); }

        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 28px 0 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 12px; color: rgba(255,255,255,0.2); }
      `}</style>

      <div className="login-root">
        <div className="login-card">
          <div className="login-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to your job tracker</p>

          {error && (
            <div className="error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f87171"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {error}
            </div>
          )}

          <div className="field-wrap">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-wrap">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Job Application Tracker</span>
            <div className="divider-line" />
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#818cf8", fontWeight: 500, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;