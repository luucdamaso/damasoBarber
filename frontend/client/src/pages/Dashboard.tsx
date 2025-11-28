import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { bookingsApi, clientsApi, servicesApi } from '@/lib/api';

interface DashboardStats {
  clientsCount: number;
  servicesCount: number;
  bookingsCount: number;
}

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    clientsCount: 0,
    servicesCount: 0,
    bookingsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!token) return;

      try {
        const [clients, services, bookings] = await Promise.all([
          clientsApi.list(token),
          servicesApi.list(token),
          bookingsApi.list(token),
        ]);

        setStats({
          clientsCount: Array.isArray(clients) ? clients.length : 0,
          servicesCount: Array.isArray(services) ? services.length : 0,
          bookingsCount: Array.isArray(bookings) ? bookings.length : 0,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

        {loading ? (
          <div className="text-center text-muted-foreground">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total de Clientes</h3>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.clientsCount}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total de Serviços</h3>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.servicesCount}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total de Agendamentos</h3>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.bookingsCount}</p>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Bem-vindo ao Sistema de Agendamentos</h2>
          <p className="text-muted-foreground">
            Use o menu lateral para navegar entre as seções de Clientes, Serviços e Agendamentos.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
