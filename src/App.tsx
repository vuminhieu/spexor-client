import { useEffect } from 'react';
import { Layout } from './components/ui/layout';
import { useUIStore, useSettingsStore } from './stores';
import { useAuthStore } from './stores/authStore';

// Pages
import { Dashboard } from './pages/dashboard';
import { CasesPage } from './pages/cases';
import { WorkspacePage } from './pages/workspace';
import { UsersPage } from './pages/users';
import { SpeakersPage } from './pages/speakers';
import { AlertWordsPage } from './pages/alert-words';
import { ReplacementsPage } from './pages/replacements';
import { LogsPage } from './pages/logs';
import { NotificationsPage } from './pages/notifications';
import { SupportPage } from './pages/support';
import { LoginPage } from './pages/login';

import './styles.css';

const pages: Record<string, React.FC> = {
  dashboard: Dashboard,
  cases: CasesPage,
  workspace: WorkspacePage,
  users: UsersPage,
  speakers: SpeakersPage,
  'alert-words': AlertWordsPage,
  replacements: ReplacementsPage,
  logs: LogsPage,
  notifications: NotificationsPage,
  support: SupportPage,
};

export default function App() {
  const { currentPage } = useUIStore();
  const { theme } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const PageComponent = pages[currentPage] || Dashboard;

  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
}
