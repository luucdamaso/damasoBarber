import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { servicesApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes?: number;
  createdAt: string;
}

export default function ServiceList() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [token]);

  const loadServices = async () => {
    if (!token) return;

    try {
      const data = await servicesApi.list(token);
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Tem certeza que deseja deletar este serviço?')) return;

    try {
      await servicesApi.delete(id, token);
      toast.success('Serviço deletado com sucesso!');
      loadServices();
    } catch (error) {
      toast.error('Erro ao deletar serviço');
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <Button
            onClick={() => setLocation('/services/new')}
            className="gap-2"
          >
            <Plus size={18} />
            Novo Serviço
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Carregando...</div>
        ) : services.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            Nenhum serviço cadastrado. Clique em "Novo Serviço" para adicionar um.
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Preço</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Duração</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-foreground">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">R$ {service.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {service.durationMinutes ? `${service.durationMinutes} min` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/services/${service.id}`)}
                        className="gap-2"
                      >
                        <Edit2 size={16} />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
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
