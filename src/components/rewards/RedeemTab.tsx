import { useMemo, useState, useEffect } from "react";
import { type Profile } from "../../types/profile";
import { fetchRewards, redeemReward, type Reward } from "../../lib/rewards";

type FilterKey = "all" | "unlocked" | "locked" | "coming";

export default function RedeemTab({ profile, onRefresh }: { profile: Profile; onRefresh: () => void }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    async function loadRewards() {
      try {
        const data = await fetchRewards();
        setRewards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, []);

  const handleRedeem = async (reward: Reward) => {
    if (profile.points < reward.points_required) {
      alert("You don't have enough points yet!");
      return;
    }

    setRedeeming(reward.id);
    try {
      await redeemReward(profile.id, reward.id, reward.points_required);
      alert(`Success! You've redeemed ${reward.title}. Check your email for details.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Redemption failed");
    } finally {
      setRedeeming(null);
    }
  };

  interface RewardUI extends Reward {
    uiStatus: "unlocked" | "locked" | "coming_soon";
  }

  const rewardsWithStatus = useMemo<RewardUI[]>(() => {
    return rewards.map(r => {
      let status: "unlocked" | "locked" | "coming_soon" = "locked";
      if (r.status === "coming_soon") {
        status = "coming_soon";
      } else {
        status = profile.points >= r.points_required ? "unlocked" : "locked";
      }
      return { ...r, uiStatus: status } as RewardUI;
    });
  }, [rewards, profile.points]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return rewardsWithStatus;
    if (activeFilter === "unlocked")
      return rewardsWithStatus.filter((r) => r.uiStatus === "unlocked");
    if (activeFilter === "locked")
      return rewardsWithStatus.filter((r) => r.uiStatus === "locked");
    return rewardsWithStatus.filter((r) => r.uiStatus === "coming_soon");
  }, [activeFilter, rewardsWithStatus]);

  const counts = useMemo(() => {
    const all = rewardsWithStatus.length;
    const unlocked = rewardsWithStatus.filter((r) => r.uiStatus === "unlocked").length;
    const locked = rewardsWithStatus.filter((r) => r.uiStatus === "locked").length;
    const coming = rewardsWithStatus.filter((r) => r.uiStatus === "coming_soon").length;
    return { all, unlocked, locked, coming };
  }, [rewardsWithStatus]);

  if (loading) return (
    <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
      <div className="loading-container">
        <div className="spinner" />
        <div style={{ color: "var(--muted)", fontWeight: 500, fontSize: 13 }}>Fetching rewards...</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="sectionHeading">
        <div className="sectionHeading__bar" />
        <h2 className="sectionHeading__text">Redeem Your Points</h2>
      </div>

      <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
        <FilterPill
          label="All Rewards"
          count={counts.all}
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        />
        <FilterPill
          label="Unlocked"
          count={counts.unlocked}
          active={activeFilter === "unlocked"}
          onClick={() => setActiveFilter("unlocked")}
        />
        <FilterPill
          label="Locked"
          count={counts.locked}
          active={activeFilter === "locked"}
          onClick={() => setActiveFilter("locked")}
        />
        <FilterPill
          label="Coming Soon"
          count={counts.coming}
          active={activeFilter === "coming"}
          onClick={() => setActiveFilter("coming")}
        />
      </div>

      <div className="redeemGrid">
        {filtered.map((r) => (
          <div key={r.id} className="card card--padded card--hoverable">
            <div
              style={{ display: "grid", placeItems: "center", marginTop: 10 }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: "#f0e7ff",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--primary)",
                  fontWeight: 900,
                }}
              >
                🎁
              </div>
            </div>

            <h3 style={{ marginTop: 18, textAlign: "center", fontSize: 18 }}>
              {r.title}
            </h3>
            <p
              style={{
                marginTop: 8,
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {r.description}
            </p>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                justifyContent: "center",
                gap: 8,
                alignItems: "center",
                color: "var(--primary)",
                fontWeight: 800,
              }}
            >
              ⭐ <span>{r.points_required} pts</span>
            </div>

            <button
              type="button"
              onClick={() => handleRedeem(r)}
              style={{
                marginTop: 16,
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "none",
                background: r.uiStatus === "unlocked" ? "var(--primary)" : "#e7edf6",
                color: r.uiStatus === "unlocked" ? "white" : "#94a3b8",
                fontWeight: 800,
                cursor: r.uiStatus === "unlocked" ? "pointer" : "default",
                opacity: redeeming === r.id ? 0.7 : 1,
              }}
              disabled={r.uiStatus !== "unlocked" || redeeming !== null}
            >
              {redeeming === r.id ? "Processing..." : r.uiStatus === "unlocked" ? "Redeem Now" : r.uiStatus === "coming_soon" ? "Coming Soon" : "Locked"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        padding: "10px 0",
        cursor: "pointer",
        position: "relative",
        color: active ? "var(--primary)" : "#334155",
        fontWeight: active ? 700 : 500,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        {label}
        <span
          style={{
            minWidth: 22,
            height: 22,
            borderRadius: 999,
            padding: "0 8px",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            background: active ? "var(--primary-100)" : "#eef2f7",
            color: active ? "var(--primary)" : "#64748b",
            fontWeight: 800,
          }}
        >
          {count}
        </span>
      </span>

      {active && (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -2,
            height: 3,
            background: "var(--primary)",
            borderRadius: 999,
          }}
        />
      )}
    </button>
  );
}
