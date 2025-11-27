import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-card border-r border-border transition-all duration-300 overflow-hidden md:w-64`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-8">Agendamentos</h1>
          <nav className="space-y-4">
            <a
              href="/dashboard"
              className="block px-4 py-2 rounded hover:bg-accent text-foreground"
            >
              Dashboard
            </a>
            <a
              href="/clients"
              className="block px-4 py-2 rounded hover:bg-accent text-foreground"
            >
              Clientes
            </a>
            <a
              href="/services"
              className="block px-4 py-2 rounded hover:bg-accent text-foreground"
            >
              Serviços
            </a>
            <a
              href="/bookings"
              className="block px-4 py-2 rounded hover:bg-accent text-foreground"
            >
              Agendamentos
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-accent rounded"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Sair
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
