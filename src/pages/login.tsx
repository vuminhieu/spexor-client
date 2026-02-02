import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAuthStore } from '../stores/authStore';

// localStorage key for saved credentials
const SAVED_CREDENTIALS_KEY = 'spexor_saved_credentials';

interface SavedCredentials {
  username: string;
  password: string;
}

function loadSavedCredentials(): SavedCredentials | null {
  try {
    const saved = localStorage.getItem(SAVED_CREDENTIALS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveCredentials(username: string, password: string): void {
  localStorage.setItem(
    SAVED_CREDENTIALS_KEY,
    JSON.stringify({ username, password })
  );
}

function clearSavedCredentials(): void {
  localStorage.removeItem(SAVED_CREDENTIALS_KEY);
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  // Load saved credentials on mount
  useEffect(() => {
    const saved = loadSavedCredentials();
    if (saved) {
      setUsername(saved.username);
      setPassword(saved.password);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await invoke<{
        id: number;
        username: string;
        name: string;
        role: string;
        email: string;
      }>('login', { username, password });

      // Save or clear credentials based on rememberMe
      if (rememberMe) {
        saveCredentials(username, password);
      } else {
        clearSavedCredentials();
      }

      setUser({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'investigator' | 'viewer',
      });
    } catch (err) {
      setError('Sai tên đăng nhập hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel - Blue with branding */}
      <div className="login-left-panel">
        <div className="login-branding">
          <h1 className="login-title">
            SPEXOR
            <br />
            <span>Audio Investigation</span>
          </h1>
          <p className="login-subtitle">
            Hệ thống phân tích và quản lý phiên âm chuyên nghiệp
          </p>
          <div className="login-features">
            <div className="feature-item">✅ Phiên âm AI tự động</div>
            <div className="feature-item">✅ Nhận dạng người nói</div>
            <div className="feature-item">✅ Phát hiện từ khóa nhạy cảm</div>
            <div className="feature-item">✅ Xuất báo cáo đa định dạng</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-right-panel">
        <div className="login-form-container">
          {/* Logo */}
          <div className="login-logo">
            <img src="/icons/logo.png" alt="SPEXOR" className="login-logo-img" />
            <span className="logo-text">SPEXOR</span>
          </div>

          {/* Login Title */}
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng bạn quay trở lại hệ thống!</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Username Input */}
            <div className="form-group">
              <label>Tài khoản</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                autoComplete="username"
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Lưu mật khẩu</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading || !username || !password}
            >
              {loading ? '⏳ Đang xử lý...' : '🔐 Đăng nhập'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>Phát triển bởi <strong>SPEXOR Team</strong></p>
            <p className="version">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
