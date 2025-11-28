import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { clientsApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export default function ClientList() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, [token]);

  const loadClients = async () => {
    if (!token) return;

    try {
      const data = await clientsApi.list(token);
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      await clientsApi.delete(id, token);
      toast.success('Cliente deletado com sucesso!');
      loadClients();
    } catch (error) {
      toast.error('Erro ao deletar cliente');
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <Button
            onClick={() => setLocation('/clients/new')}
            className="gap-2"
          >
            <Plus size={18} />
            Novo Cliente
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Carregando...</div>
        ) : clients.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            Nenhum cliente cadastrado. Clique em "Novo Cliente" para adicionar um.
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Telefone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-foreground">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{client.phone}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{client.email || '-'}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/clients/${client.id}`)}
                        className="gap-2"
                      >
                        <Edit2 size={16} />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
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
