import { useState } from "react";
import { supabase } from "../../lib/supabase";

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f7f8fc",
      }}
    >
      <div className="card" style={{ width: 360 }}>
        <h2>Sign in to continue</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}

        <button onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
