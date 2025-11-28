import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { bookingsApi, clientsApi, servicesApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { toast } from 'sonner';

interface BookingFormData {
  clientId: string;
  start: string;
  end: string;
  service: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

export default function BookingForm() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/bookings/:id');
  const [formData, setFormData] = useState<BookingFormData>({
    clientId: '',
    start: '',
    end: '',
    service: '',
    status: 'scheduled',
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const bookingId = params?.id;

  useEffect(() => {
    loadClientsAndServices();
    if (bookingId && bookingId !== 'new') {
      loadBooking();
    }
  }, [bookingId, token]);

  const loadClientsAndServices = async () => {
    if (!token) return;

    try {
      const [clientsData, servicesData] = await Promise.all([
        clientsApi.list(token),
        servicesApi.list(token),
      ]);

      setClients(Array.isArray(clientsData) ? clientsData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      toast.error('Erro ao carregar clientes e serviços');
      console.error(error);
    }
  };

  const loadBooking = async () => {
    if (!token || !bookingId || bookingId === 'new') return;

    try {
      const booking = await bookingsApi.getById(bookingId, token) as any;
      setFormData({
        clientId: booking.clientId,
        start: booking.start.substring(0, 16), // Formato para input datetime-local
        end: booking.end.substring(0, 16),
        service: booking.service,
        status: booking.status,
      });
      setIsEditing(true);
    } catch (error) {
      toast.error('Erro ao carregar agendamento');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error('Token não encontrado');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        clientId: formData.clientId,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
        service: formData.service,
        status: formData.status,
      };

      if (isEditing && bookingId && bookingId !== 'new') {
        await bookingsApi.update(bookingId, submitData, token);
        toast.success('Agendamento atualizado com sucesso!');
      } else {
        await bookingsApi.create(submitData, token);
        toast.success('Agendamento criado com sucesso!');
      }
      setLocation('/bookings');
    } catch (error) {
      toast.error('Erro ao salvar agendamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
        </h1>

        <Card className="p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="clientId" className="text-foreground">
                Cliente *
              </Label>
              <select
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="service" className="text-foreground">
                Serviço *
              </Label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="start" className="text-foreground">
                Data/Hora Início *
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="end" className="text-foreground">
                Data/Hora Fim *
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-foreground">
                Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="scheduled">Agendado</option>
                <option value="done">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/bookings')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
