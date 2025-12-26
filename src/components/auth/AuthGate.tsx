import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { AuthScreen } from "./AuthScreen";

type Props = {
  children: React.ReactNode;
};

export function AuthGate({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let active = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) {
        setSession(session);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
        }}
      >
        <div className="loading-container">
          <div className="spinner" />
          <div style={{ color: "var(--muted)", fontWeight: 500, fontSize: 14 }}>
            Checking authentication…
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <>{children}</>;
}
