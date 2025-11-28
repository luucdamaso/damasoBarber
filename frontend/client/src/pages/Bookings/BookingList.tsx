import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { bookingsApi, clientsApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Booking {
  id: string;
  clientId: string;
  start: string;
  end: string;
  service: string;
  status: string;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
}

export default function BookingList() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [token]);

  const loadBookings = async () => {
    if (!token) return;

    try {
      const [bookingsData, clientsData] = await Promise.all([
        bookingsApi.list(token),
        clientsApi.list(token),
      ]);

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

      // Criar mapa de clientes para referência rápida
      const clientMap = new Map<string, string>();
      if (Array.isArray(clientsData)) {
        clientsData.forEach((client: Client) => {
          clientMap.set(client.id, client.name);
        });
      }
      setClients(clientMap);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Tem certeza que deseja deletar este agendamento?')) return;

    try {
      await bookingsApi.delete(id, token);
      toast.success('Agendamento deletado com sucesso!');
      loadBookings();
    } catch (error) {
      toast.error('Erro ao deletar agendamento');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
          <Button
            onClick={() => setLocation('/bookings/new')}
            className="gap-2"
          >
            <Plus size={18} />
            Novo Agendamento
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Carregando...</div>
        ) : bookings.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            Nenhum agendamento cadastrado. Clique em "Novo Agendamento" para adicionar um.
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Serviço</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-foreground">
                      {clients.get(booking.clientId) || 'Cliente não encontrado'}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{booking.service}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{formatDate(booking.start)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'done' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/bookings/${booking.id}`)}
                        className="gap-2"
                      >
                        <Edit2 size={16} />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(booking.id)}
                        className="gap-2"
                      >
                        <Trash2 size={16} />
                        Deletar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
