import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import RewardsDashboard from "./pages/RewardsDashboard";
import { AuthGate } from "./components/auth/AuthGate";

function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("Session:", data);
      console.log("Error:", error);
    });
  }, []);

  // return <RewardsDashboard />;
    return (
      <AuthGate>
        <RewardsDashboard />
      </AuthGate>
    );


}

export default App;


