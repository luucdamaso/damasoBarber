import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { clientsApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { toast } from 'sonner';

interface ClientFormData {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export default function ClientForm() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/clients/:id');
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const clientId = params?.id;

  useEffect(() => {
    if (clientId && clientId !== 'new') {
      loadClient();
    }
  }, [clientId, token]);

  const loadClient = async () => {
    if (!token || !clientId || clientId === 'new') return;

    try {
      const client = await clientsApi.getById(clientId, token) as ClientFormData;
      setFormData(client);
      setIsEditing(true);
    } catch (error) {
      toast.error('Erro ao carregar cliente');
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
      if (isEditing && clientId && clientId !== 'new') {
        await clientsApi.update(clientId, formData, token);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await clientsApi.create(formData, token);
        toast.success('Cliente criado com sucesso!');
      }
      setLocation('/clients');
    } catch (error) {
      toast.error('Erro ao salvar cliente');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
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
                placeholder="Nome do cliente"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground">
                Telefone *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@example.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-foreground">
                Notas
              </Label>
              <textarea
                id="notes"
                placeholder="Observações sobre o cliente"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/clients')}
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
