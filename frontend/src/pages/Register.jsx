import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.detail || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };
   const handleKeyDown = (e) => {
  	if (e.key === "Enter") {
    	    handleRegister();
 	 }
    };

  

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .reg-root::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%);
          top: -200px; right: -200px;
          border-radius: 50%;
          pointer-events: none;
        }

        .reg-root::after {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
          bottom: -150px; left: -150px;
          border-radius: 50%;
          pointer-events: none;
        }

        .reg-card {
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

        .reg-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
          box-shadow: 0 8px 24px rgba(168,85,247,0.35);
        }

        .reg-icon svg { width: 24px; height: 24px; fill: white; }

        .reg-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .reg-sub {
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

        .field-wrap { margin-bottom: 20px; }

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
          border-color: rgba(168,85,247,0.6);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.12);
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

        .reg-btn {
          width: 100%;
          background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(168,85,247,0.35);
          letter-spacing: 0.02em;
          margin-top: 8px;
        }

        .reg-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(168,85,247,0.45);
        }

        .reg-btn:active:not(:disabled) { transform: translateY(0); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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

        .password-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          margin-top: 6px;
          padding-left: 2px;
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-card">
          <div className="reg-icon">
            <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>

          <h1 className="reg-title">Create account</h1>
          <p className="reg-sub">Start tracking your job applications</p>

          {error && (
            <div className="error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f87171"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {error}
            </div>
          )}

          <div className="field-wrap">
            <label className="field-label">Full Name</label>
            <input
              className="field-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

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
            <p className="password-hint">Minimum 6 characters</p>
          </div>

          <button className="reg-btn" onClick={handleRegister} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Job Application Tracker</span>
            <div className="divider-line" />
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#818cf8", fontWeight: 500, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;