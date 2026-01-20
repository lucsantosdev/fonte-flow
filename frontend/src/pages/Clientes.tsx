import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';

const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ClienteFormData) => {
    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, data);
      } else {
        await api.post('/clientes', data);
      }
      fetchClientes();
      reset();
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar cliente');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingId(cliente.id);
    reset(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    
    try {
      await api.delete(`/clientes/${id}`);
      fetchClientes();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao excluir cliente');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  if (loading) {
    return <div className="text-gray-600 text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-300 to-secondary-200 hover:from-primary-400 hover:to-secondary-200 text-white px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center font-semibold"
        >
          <UserPlus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 mb-6 sm:mb-8 border border-primary-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {editingId ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  {...register('nome')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200"
                  placeholder="Nome completo"
                />
                {errors.nome && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  {...register('telefone')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200"
                  placeholder="(11) 99999-9999"
                />
                {errors.telefone && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.telefone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200"
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  {...register('endereco')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200"
                  placeholder="Rua, número, bairro"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition font-semibold order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-primary-300 to-secondary-200 hover:from-primary-400 hover:to-secondary-200 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl order-1 sm:order-2 font-semibold"
              >
                {editingId ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Clientes */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-primary-100">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-100">
            <thead className="bg-gradient-to-r from-primary-100/30 to-secondary-100/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Nenhum cliente cadastrado
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {cliente.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cliente.telefone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cliente.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="text-primary-300 hover:text-primary-400 mr-4 inline-flex items-center gap-1.5 font-semibold"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1.5 font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {clientes.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Nenhum cliente cadastrado
            </div>
          ) : (
            clientes.map((cliente) => (
              <div key={cliente.id} className="p-5 hover:bg-gray-50 transition">
                <h3 className="font-bold text-gray-900 mb-3 text-base">{cliente.nome}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="text-primary-500">📱</span>
                    {cliente.telefone}
                  </p>
                  {cliente.email && (
                    <p className="flex items-center gap-2">
                      <span className="text-success-500">✉️</span>
                      {cliente.email}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-primary-300 bg-primary-100/50 hover:bg-primary-100 rounded-xl transition text-sm font-semibold"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
