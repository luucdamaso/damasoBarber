import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { servicesApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { toast } from 'sonner';

interface ServiceFormData {
  name: string;
  price: number;
  durationMinutes?: number;
}

export default function ServiceForm() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/services/:id');
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    price: 0,
    durationMinutes: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const serviceId = params?.id;

  useEffect(() => {
    if (serviceId && serviceId !== 'new') {
      loadService();
    }
  }, [serviceId, token]);

  const loadService = async () => {
    if (!token || !serviceId || serviceId === 'new') return;

    try {
      const service = await servicesApi.getById(serviceId, token) as ServiceFormData;
      setFormData(service);
      setIsEditing(true);
    } catch (error) {
      toast.error('Erro ao carregar serviço');
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
      if (isEditing && serviceId && serviceId !== 'new') {
        await servicesApi.update(serviceId, formData, token);
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await servicesApi.create(formData, token);
        toast.success('Serviço criado com sucesso!');
      }
      setLocation('/services');
    } catch (error) {
      toast.error('Erro ao salvar serviço');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
        </h1>

        <Card className="p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Nome *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Nome do serviço"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-foreground">
                Preço *
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="durationMinutes" className="text-foreground">
                Duração (minutos)
              </Label>
              <Input
                id="durationMinutes"
                type="number"
                placeholder="30"
                value={formData.durationMinutes || ''}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value ? parseInt(e.target.value) : undefined })}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/services')}
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
