type TabKey = "earn" | "redeem";

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function RewardsHeader({ activeTab, onChange }: Props) {
  return (
    <div className="topTabs">
      <button
        className={`topTab ${activeTab === "earn" ? "topTab--active" : ""}`}
        onClick={() => onChange("earn")}
        type="button"
      >
        Earn Points
      </button>

      <button
        className={`topTab ${activeTab === "redeem" ? "topTab--active" : ""}`}
        onClick={() => onChange("redeem")}
        type="button"
      >
        Redeem Rewards
      </button>
    </div>
  );
}
