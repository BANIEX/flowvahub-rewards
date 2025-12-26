import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <img 
          src="/flowva_logo-xVpZI3-U.png" 
          alt="Flowva Logo" 
          style={{ width: 140, height: 'auto', filter: 'drop-shadow(0 10px 15px rgba(124, 58, 237, 0.2))' }} 
        />
      </div>

      <div className="card" style={{ 
        width: "100%", 
        maxWidth: 400, 
        padding: "40px",
        borderRadius: "24px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}>
        <h2 style={{ 
          fontSize: "24px", 
          fontWeight: 700, 
          color: "#1e1b4b", 
          marginBottom: "8px",
          textAlign: "center" 
        }}>
          Welcome Back
        </h2>
        <p style={{ 
          fontSize: "14px", 
          color: "#64748b", 
          marginBottom: "32px",
          textAlign: "center" 
        }}>
          Sign in to access your rewards
        </p>

        <div style={{ display: "grid", gap: "20px" }}>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ 
              position: "absolute", 
              left: "14px", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "#94a3b8"
            }} />
            <input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 44px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                background: "white",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ 
              position: "absolute", 
              left: "14px", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "#94a3b8"
            }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 44px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                background: "white",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {error && (
            <div style={{ 
              padding: "12px", 
              background: "#fff1f2", 
              border: "1px solid #fecaca", 
              borderRadius: "10px",
              color: "#e11d48",
              fontSize: "13px",
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <button 
            onClick={handleSignIn} 
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: loading ? "#9333ea90" : "var(--primary)",
              color: "white",
              border: "none",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "transform 0.1s active",
            }}
          >
            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <LogIn size={18} />}
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ padding: "0 10px", fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: "white",
              color: "#1e1b4b",
              border: "1px solid #e2e8f0",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <UserPlus size={18} />
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
