import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../../../stores';
import type { Page } from '../../../types';

interface StatData {
  icon: string;
  value: number;
  label: string;
  page: Page;
  loading?: boolean;
}

export function StatsGrid() {
  const { setPage } = useUIStore();
  const [stats, setStats] = useState<StatData[]>([
    { icon: '📁', value: 0, label: 'Tổng vụ việc', page: 'cases', loading: true },
    { icon: '🎵', value: 0, label: 'Tổng file ghi âm', page: 'workspace', loading: true },
    { icon: '⚠️', value: 0, label: 'Từ ngữ cảnh báo', page: 'alert-words', loading: true },
    { icon: '🎤', value: 0, label: 'Tổng số người nói', page: 'speakers', loading: true },
    { icon: '👥', value: 0, label: 'Tổng số người dùng', page: 'users', loading: true },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real data from Tauri commands
        const [cases, speakers, alertWords, users] = await Promise.allSettled([
          invoke<any[]>('get_cases'),
          invoke<any[]>('get_speakers'),
          invoke<any[]>('get_alert_words'),
          invoke<any[]>('get_users'),
        ]);

        setStats([
          {
            icon: '📁',
            value: cases.status === 'fulfilled' ? cases.value.length : 0,
            label: 'Tổng vụ việc',
            page: 'cases'
          },
          {
            icon: '🎵',
            value: 0, // Audio files need case context
            label: 'Tổng file ghi âm',
            page: 'workspace'
          },
          {
            icon: '⚠️',
            value: alertWords.status === 'fulfilled' ? alertWords.value.length : 0,
            label: 'Từ ngữ cảnh báo',
            page: 'alert-words'
          },
          {
            icon: '🎤',
            value: speakers.status === 'fulfilled' ? speakers.value.length : 0,
            label: 'Tổng số người nói',
            page: 'speakers'
          },
          {
            icon: '👥',
            value: users.status === 'fulfilled' ? users.value.length : 0,
            label: 'Tổng số người dùng',
            page: 'users'
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="stats-grid-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card-new clickable"
          onClick={() => setPage(stat.page)}
        >
          <div className="stat-card-icon">
            <span>{stat.icon}</span>
          </div>
          <div className="stat-card-content">
            <span className="stat-number">
              {stat.loading ? '...' : formatNumber(stat.value)}
            </span>
            <span className="stat-text">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
