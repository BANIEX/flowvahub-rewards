type Props = {
  title: string;
  subtitle: string;
  notificationCount?: number;
};

export default function DashboardHeader({
  title,
  subtitle,
  notificationCount = 3,
}: Props) {
  return (
    <div className="headerRow">
      <div>
        <h1 className="pageTitle">{title}</h1>
        <p className="pageSub">{subtitle}</p>
      </div>

      <div className="bell" aria-label="Notifications">
        <span style={{ fontSize: 18 }}>🔔</span>
        <span className="bell__badge">{notificationCount}</span>
      </div>
    </div>
  );
}
