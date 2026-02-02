export function UserChart() {
  const activeUsers = 0;
  const inactiveUsers = 0;
  const total = activeUsers + inactiveUsers || 1;
  const activePercentage = Math.round((activeUsers / total) * 100);

  // Calculate stroke dasharray values for SVG donut
  const circumference = 2 * Math.PI * 40; // radius = 40
  const activeStroke = (activePercentage / 100) * circumference;
  const inactiveStroke = circumference - activeStroke;

  return (
    <div className="card chart-card chart-card-sm">
      <div className="card-header-row">
        <h3>Thống kê người dùng</h3>
        <select className="chart-filter">
          <option>📅 Chọn khoảng thời gian</option>
        </select>
      </div>
      <div className="donut-chart-container">
        <div className="donut-chart">
          <svg viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="var(--bg-hover)"
              strokeWidth="18"
            />
            {/* Active users arc */}
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="18"
              strokeDasharray={`${activeStroke} ${inactiveStroke}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
            {/* Inactive users arc */}
            {inactiveUsers > 0 && (
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#f472b6"
                strokeWidth="18"
                strokeDasharray={`${inactiveStroke} ${activeStroke}`}
                strokeDashoffset={`${-activeStroke}`}
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="donut-center">
            <span className="donut-icon">👥</span>
            <span className="donut-label">Tổng cộng</span>
            <span className="donut-value">{total === 1 && activeUsers === 0 ? 0 : total}</span>
          </div>
        </div>
        <div className="donut-legend">
          <div className="legend-item">
            <span className="legend-dot green"></span>
            <span>Kích hoạt ({activeUsers})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot pink"></span>
            <span>Vô hiệu hóa ({inactiveUsers})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
