interface BarData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

const barData: BarData[] = [
  { label: 'Sự vụ', value: 0, color: 'yellow', percentage: 0 },
  { label: 'File âm thanh', value: 0, color: 'orange', percentage: 0 },
  { label: 'Từ ngữ cảnh báo', value: 0, color: 'blue', percentage: 0 },
  { label: 'Từ ngữ thay thế', value: 0, color: 'red', percentage: 0 },
  { label: 'Người nói', value: 0, color: 'green', percentage: 0 },
  { label: 'Người dùng', value: 0, color: 'pink', percentage: 0 },
];

export function OverviewChart() {
  return (
    <div className="card chart-card">
      <div className="card-header-row">
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
                style={{ width: `${Math.max(bar.percentage, 5)}%` }}
              />
            </div>
            <span className="bar-value">{bar.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
