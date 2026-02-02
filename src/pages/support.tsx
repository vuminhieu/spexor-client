export function SupportPage() {
  const shortcuts = [
    { keys: 'Space', desc: 'Play/Pause audio' },
    { keys: 'Ctrl + S', desc: 'Lưu transcript' },
    { keys: 'Ctrl + F', desc: 'Tìm kiếm' },
    { keys: '←/→', desc: 'Tua 5 giây' },
    { keys: 'Shift + ←/→', desc: 'Tua 30 giây' },
    { keys: 'Ctrl + Z', desc: 'Hoàn tác' },
    { keys: 'Ctrl + Shift + Z', desc: 'Làm lại' },
    { keys: 'Escape', desc: 'Đóng modal/hủy' },
  ];

  const guides = [
    { icon: '🚀', title: 'Bắt đầu nhanh', desc: 'Hướng dẫn làm quen với SPEXOR' },
    { icon: '📁', title: 'Quản lý sự vụ', desc: 'Tạo, sửa, xóa và quản lý sự vụ' },
    { icon: '🎵', title: 'Xử lý audio và transcript', desc: 'Upload, phân tích và chỉnh sửa' },
    { icon: '📊', title: 'Xuất báo cáo', desc: 'Export PDF, Word, Excel' },
    { icon: '👤', title: 'Quản lý người nói', desc: 'Thêm và nhận dạng người nói' },
    { icon: '⚙️', title: 'Cài đặt hệ thống', desc: 'Tùy chỉnh giao diện và đồng bộ' },
  ];

  const faqs = [
    { q: 'Làm sao để upload file audio?', a: 'Vào Workspace, nhấn nút Upload hoặc kéo thả file vào vùng upload.' },
    { q: 'Hỗ trợ định dạng file nào?', a: 'WAV, MP3, FLAC, M4A, OGG với độ dài tối đa 4 giờ.' },
    { q: 'Dữ liệu được lưu ở đâu?', a: 'Tất cả dữ liệu được mã hóa và lưu trữ cục bộ trên máy tính.' },
  ];

  return (
    <div className="page support-page">
      <div className="page-header">
        <div>
          <h1>❓ Hỗ trợ</h1>
          <p className="page-description">
            Tìm hiểu cách sử dụng SPEXOR hiệu quả nhất
          </p>
        </div>
      </div>

      <div className="support-content">
        {/* Guides Section */}
        <div className="support-section guides-section">
          <h3>📖 Hướng dẫn sử dụng</h3>
          <div className="guide-grid">
            {guides.map((guide, i) => (
              <a key={i} href="#" className="guide-card">
                <span className="guide-icon">{guide.icon}</span>
                <div className="guide-text">
                  <h4>{guide.title}</h4>
                  <p>{guide.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Shortcuts Section */}
        <div className="support-section shortcuts-section">
          <h3>⌨️ Phím tắt</h3>
          <div className="shortcuts-list">
            {shortcuts.map((shortcut, i) => (
              <div key={i} className="shortcut-item">
                <span className="shortcut-keys">{shortcut.keys}</span>
                <span className="shortcut-desc">{shortcut.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="support-section faq-section">
          <h3>❓ Câu hỏi thường gặp</h3>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Info Section */}
        <div className="support-section system-section">
          <h3>ℹ️ Thông tin hệ thống</h3>
          <div className="system-info">
            <div className="info-row">
              <span className="info-label">Phiên bản:</span>
              <span className="info-value">SPEXOR v1.0.0</span>
            </div>
            <div className="info-row">
              <span className="info-label">AI Model:</span>
              <span className="info-value">Whisper Large-v3</span>
            </div>
            <div className="info-row">
              <span className="info-label">Database:</span>
              <span className="info-value">SQLite (Encrypted)</span>
            </div>
            <div className="info-row">
              <span className="info-label">Framework:</span>
              <span className="info-value">Tauri 2.x + React 19</span>
            </div>
            <div className="info-row">
              <span className="info-label">Build:</span>
              <span className="info-value">{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="support-section contact-section">
          <h3>📞 Liên hệ hỗ trợ</h3>
          <div className="contact-info">
            <p>📧 Email: <a href="mailto:support@spexor.vn">support@spexor.vn</a></p>
            <p>📱 Hotline: <a href="tel:1900xxxx">1900-XXXX</a></p>
            <p>🌐 Website: <a href="https://spexor.vn" target="_blank">spexor.vn</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
