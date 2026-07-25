function DashboardCard({ title, value }) {
  return (
    <div className="dashboard-card">
      <h3 className="card-title">{title}</h3>
      <h1 className="card-value">{value}</h1>
    </div>
  );
}

export default DashboardCard;