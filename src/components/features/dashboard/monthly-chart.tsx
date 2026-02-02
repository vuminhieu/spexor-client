const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

// Mock data - replace with real data later
const processed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const exported = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export function MonthlyChart() {
  const maxValue = Math.max(...processed, ...exported, 1) * 1.2;

  const getHeight = (value: number) => {
    return Math.max((value / maxValue) * 100, 2); // Minimum 2% for visibility
  };

  return (
    <div className="card chart-card chart-card-full">
      <div className="card-header-row">
        <h3>Thống kê theo tháng</h3>
        <select className="chart-filter">
          <option>📅 Năm 2026</option>
          <option>Năm 2025</option>
        </select>
      </div>
      <div className="monthly-chart">
        <div className="chart-y-axis">
          {[50, 40, 30, 20, 10, 0].map(v => (
            <span key={v}>{v}</span>
          ))}
        </div>
        <div className="chart-bars-container">
          {months.map((month, i) => (
            <div key={month} className="month-group">
              <div className="month-bars">
                <div
                  className="v-bar bar-blue"
                  style={{ height: `${getHeight(processed[i])}%` }}
                  title={`Đã xử lý: ${processed[i]}`}
                />
                <div
                  className="v-bar bar-lightblue"
                  style={{ height: `${getHeight(exported[i])}%` }}
                  title={`Đã xuất: ${exported[i]}`}
                />
              </div>
              <span className="month-label">{month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-legend-center">
        <span className="legend-item">
          <span className="legend-dot blue"></span>
          File đã xử lý
        </span>
        <span className="legend-item">
          <span className="legend-dot lightblue"></span>
          File xuất báo cáo
        </span>
      </div>
    </div>
  );
}
