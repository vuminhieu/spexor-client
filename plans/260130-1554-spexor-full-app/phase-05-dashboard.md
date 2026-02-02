---
description: Dashboard Page with Stats, Charts, Recent Activities
status: pending
priority: P1
effort: 3h
---

# Phase 05: Dashboard Page

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 82-405
- Depends on: [Phase 04](phase-04-sidebar-layout.md)

## Overview

Implement Dashboard page with stats cards, charts (bar, donut, monthly), and recent activities table.

## Related Files

```
src/
├── components/
│   └── features/
│       └── dashboard/
│           ├── stats-grid.tsx      # 5 stat cards
│           ├── overview-chart.tsx  # Horizontal bar chart
│           ├── user-chart.tsx      # Donut chart
│           ├── monthly-chart.tsx   # Vertical bar chart
│           └── activity-table.tsx  # Recent activities
└── pages/
    └── dashboard.tsx
```

## Implementation Steps

### Step 1: Create Dashboard Page
```tsx
// src/pages/dashboard.tsx
import { StatsGrid } from '../components/features/dashboard/stats-grid';
import { OverviewChart } from '../components/features/dashboard/overview-chart';
import { UserChart } from '../components/features/dashboard/user-chart';
import { MonthlyChart } from '../components/features/dashboard/monthly-chart';
import { ActivityTable } from '../components/features/dashboard/activity-table';

export function Dashboard() {
  return (
    <div id="page-dashboard" className="page active">
      <div className="page-header">
        <h1>Dashboard</h1>
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
```

### Step 2: Create Stats Grid
```tsx
// src/components/features/dashboard/stats-grid.tsx
import { useUIStore } from '../../../stores';

interface StatCard {
  icon: string;
  value: string | number;
  label: string;
  page: string;
}

const stats: StatCard[] = [
  { icon: '📁', value: '2,847', label: 'Tổng vụ việc', page: 'cases' },
  { icon: '🎵', value: '12,459', label: 'Tổng file ghi âm', page: 'workspace' },
  { icon: '📚', value: '156', label: 'Tổng số từ vựng', page: 'alert-words' },
  { icon: '🎤', value: '14', label: 'Tổng số người nói', page: 'speakers' },
  { icon: '👥', value: '14', label: 'Tổng số người dùng', page: 'users' },
];

export function StatsGrid() {
  const { setPage } = useUIStore();

  return (
    <div className="stats-grid-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card-new clickable"
          onClick={() => setPage(stat.page as any)}
        >
          <div className="stat-card-icon">
            <span>{stat.icon}</span>
          </div>
          <div className="stat-card-content">
            <span className="stat-number">{stat.value}</span>
            <span className="stat-text">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Step 3: Create Overview Chart
```tsx
// src/components/features/dashboard/overview-chart.tsx
interface BarData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

const barData: BarData[] = [
  { label: 'Sự vụ', value: 598, color: 'yellow', percentage: 85 },
  { label: 'File âm thanh', value: 567, color: 'orange', percentage: 80 },
  { label: 'Từ ngữ cảnh báo', value: 773, color: 'blue', percentage: 95 },
  { label: 'Từ ngữ thay thế', value: 464, color: 'red', percentage: 60 },
  { label: 'Người nói', value: 222, color: 'green', percentage: 35 },
  { label: 'Người dùng hệ thống', value: 484, color: 'pink', percentage: 58 },
];

export function OverviewChart() {
  return (
    <div className="card chart-card">
      <div className="card-header">
        <h3>Thống kê tổng quan</h3>
        <select className="chart-filter">
          <option>📅 Chọn khoảng thời gian</option>
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>Năm nay</option>
        </select>
      </div>
      <div className="horizontal-bar-chart">
        {barData.map((bar) => (
          <div key={bar.label} className="bar-row">
            <span className="bar-label">{bar.label}</span>
            <div className="bar-container">
              <div 
                className={`bar bar-${bar.color}`} 
                style={{ width: `${bar.percentage}%` }}
              />
            </div>
            <span className="bar-value">{bar.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Create User Donut Chart
```tsx
// src/components/features/dashboard/user-chart.tsx
export function UserChart() {
  return (
    <div className="card chart-card chart-card-sm">
      <div className="card-header">
        <h3>Thống kê người dùng</h3>
        <select className="chart-filter">
          <option>📅 Chọn khoảng thời gian</option>
        </select>
      </div>
      <div className="donut-chart-container">
        <div className="donut-chart">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#2a2a4a" strokeWidth="20" />
            <circle 
              cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20"
              strokeDasharray="157 94" strokeDashoffset="0" transform="rotate(-90 50 50)" 
            />
            <circle 
              cx="50" cy="50" r="40" fill="none" stroke="#f472b6" strokeWidth="20"
              strokeDasharray="94 157" strokeDashoffset="-157" transform="rotate(-90 50 50)" 
            />
          </svg>
          <div className="donut-center">
            <span className="donut-icon">👆</span>
            <span className="donut-label">Connected</span>
            <span className="donut-value">12 (63%)</span>
          </div>
        </div>
        <div className="donut-legend">
          <div className="legend-item">
            <span className="legend-dot green"></span>
            <span>Kích hoạt</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot pink"></span>
            <span>Vô hiệu hóa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Create Monthly Chart
```tsx
// src/components/features/dashboard/monthly-chart.tsx
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const processed = [60, 80, 70, 85, 50, 40, 55, 30, 45, 90, 75, 35];
const exported = [40, 55, 45, 60, 30, 20, 35, 18, 25, 65, 50, 22];

export function MonthlyChart() {
  return (
    <div className="card chart-card chart-card-full">
      <div className="card-header">
        <h3>Thống kê theo sự vụ</h3>
        <select className="chart-filter">
          <option>📅 Chọn năm</option>
          <option selected>2026</option>
          <option>2025</option>
        </select>
      </div>
      <div className="monthly-chart">
        <div className="chart-y-axis">
          {[50, 40, 30, 20, 10, 0].map(v => <span key={v}>{v}</span>)}
        </div>
        <div className="chart-bars-container">
          {months.map((month, i) => (
            <div key={month} className="month-group">
              <div className="month-bars">
                <div className="v-bar bar-blue" style={{ height: `${processed[i]}%` }} />
                <div className="v-bar bar-lightblue" style={{ height: `${exported[i]}%` }} />
              </div>
              <span className="month-label">{month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-legend-center">
        <span className="legend-item">
          <span className="legend-dot blue"></span> File đã xử lý
        </span>
        <span className="legend-item">
          <span className="legend-dot lightblue"></span> File xuất báo cáo
        </span>
      </div>
    </div>
  );
}
```

### Step 6: Create Activity Table
```tsx
// src/components/features/dashboard/activity-table.tsx
interface Activity {
  id: string;
  event: string;
  creator: string;
  description: string;
  date: string;
}

const recentActivities: Activity[] = [
  { id: '01', event: 'Trần Văn A', creator: 'Trần Văn A', description: 'Trần Văn A', date: '2024-01-15' },
  { id: '02', event: 'Trần Văn B', creator: 'Trần Văn A', description: 'Trần Văn A', date: '2024-01-15' },
  { id: '03', event: 'Trần Văn C', creator: 'Quản trị viên', description: 'Trần Văn A', date: '2024-01-15' },
  { id: '04', event: 'Trần Văn D', creator: 'Quản trị viên', description: 'Trần Văn A', date: '2024-01-15' },
  { id: '05', event: 'Trần Văn E', creator: 'Quản trị viên', description: 'Trần Văn A', date: '2024-01-15' },
];

export function ActivityTable() {
  return (
    <div className="card activity-table-card">
      <div className="card-header">
        <h3>Hoạt động gần đây (5)</h3>
      </div>
      <table className="activity-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Sự kiện</th>
            <th>Người tạo</th>
            <th>Mô tả</th>
            <th>Thời gian tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {recentActivities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.id}</td>
              <td>{activity.event}</td>
              <td>{activity.creator}</td>
              <td>{activity.description}</td>
              <td>{activity.date}</td>
              <td><button className="btn-icon">👁️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Todo

- [ ] Create dashboard/ folder
- [ ] Create stats-grid.tsx
- [ ] Create overview-chart.tsx
- [ ] Create user-chart.tsx
- [ ] Create monthly-chart.tsx
- [ ] Create activity-table.tsx
- [ ] Create dashboard.tsx page
- [ ] Add dashboard CSS styles
- [ ] Connect to real data later

## Success Criteria

1. ✅ All 5 stat cards render
2. ✅ Cards navigate to correct pages
3. ✅ Horizontal bar chart displays
4. ✅ Donut chart with legend
5. ✅ Monthly chart with 12 months
6. ✅ Activity table with 5 rows

## Next Steps

After completing this phase:
1. Proceed to [Phase 06: Case Management](phase-06-case-management.md)
