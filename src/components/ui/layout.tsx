import { Sidebar } from './sidebar';
import { Toast } from './toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <Toast />
    </div>
  );
}
