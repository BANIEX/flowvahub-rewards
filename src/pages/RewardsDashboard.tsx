import { useState, useEffect } from "react";
import { 
  Home, 
  Compass, 
  Library, 
  Layers, 
  CreditCard, 
  Gem, 
  Settings,
  LogOut
} from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import RewardsHeader from "../components/rewards/RewardsHeader";
import EarnTab from "../components/rewards/EarnTab";
import RedeemTab from "../components/rewards/RedeemTab";
import PageContainer from "../layout/PageContainer";
import { supabase } from "../lib/supabase";
import { fetchProfile, getOrCreateProfile } from "../lib/profile";
import { type Profile } from "../types/profile";

type TabKey = "earn" | "redeem";

export default function RewardsDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("earn");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;
        setUser(user);

        const data = await getOrCreateProfile(user.id);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (!profile) return;
    const data = await fetchProfile(profile.id);
    setProfile(data);
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', width: '100vw'  }}>
          <div className="loading-container">
            <div className="spinner" />
            <div style={{ color: "var(--muted)", fontWeight: 500, fontSize: 14 }}>
              Loading your rewards dashboard…
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer>
        <div style={{ padding: 40 }}>Profile not found.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="logo-icon" style={{ marginBottom: 20 }}>
            <img 
              src="/flowva_logo-xVpZI3-U.png" 
              alt="Flowva Logo" 
              style={{ width: 150, height: 'auto'}} 
            />
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__item">
            <Home size={20} /> Home
          </div>
          <div className="sidebar__item">
            <Compass size={20} /> Discover
          </div>
          <div className="sidebar__item">
            <Library size={20} /> Library
          </div>
          <div className="sidebar__item">
            <Layers size={20} /> Tech Stack
          </div>
          <div className="sidebar__item">
            <CreditCard size={20} /> Subscriptions
          </div>
          <div className="sidebar__item sidebar__item--active">
            <Gem size={20} /> Rewards Hub
          </div>
          <div className="sidebar__item">
            <Settings size={20} /> Settings
          </div>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__divider" />
          
          <div className="sidebar__profile">
            <div className="sidebar__avatar">
              <img 
                src={ `https://ui-avatars.com/api/?name=${user?.email || 'User'}`} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="sidebar__user-email" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <DashboardHeader
          title="Rewards Hub"
          subtitle="Earn points, unlock rewards, and celebrate your progress!"
          notificationCount={3}
        />

        <RewardsHeader activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "earn" ? (
          <EarnTab profile={profile} onRefresh={refreshProfile} />
        ) : (
          <RedeemTab profile={profile} onRefresh={refreshProfile} />
        )}
      </main>
    </PageContainer>
  );
}
