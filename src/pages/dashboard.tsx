import { StatsGrid } from '../components/features/dashboard/stats-grid';
import { OverviewChart } from '../components/features/dashboard/overview-chart';
import { UserChart } from '../components/features/dashboard/user-chart';
import { MonthlyChart } from '../components/features/dashboard/monthly-chart';
import { ActivityTable } from '../components/features/dashboard/activity-table';

export function Dashboard() {
  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Tổng quan hệ thống SPEXOR</p>
        </div>
      </div>

      <StatsGrid />

      <div className="dashboard-charts-row">
        <OverviewChart />
        <UserChart />
      </div>

      <MonthlyChart />

      <ActivityTable />
    </div>
  );
}
