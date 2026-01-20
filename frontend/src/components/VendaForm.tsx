import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingCart } from 'lucide-react';
import api from '../services/api';

const vendaSchema = z.object({
  cliente_id: z.number({ required_error: 'Selecione um cliente' }).min(1, 'Selecione um cliente'),
  quantidade: z.number({ required_error: 'Quantidade é obrigatória' }).min(1, 'Quantidade deve ser no mínimo 1'),
  preco_unitario: z.number({ required_error: 'Preço é obrigatório' }).min(0.01, 'Preço deve ser maior que zero'),
  observacoes: z.string().optional(),
});

type VendaFormData = z.infer<typeof vendaSchema>;

interface Cliente {
  id: number;
  nome: string;
}

interface VendaFormProps {
  onSuccess?: () => void;
}

export default function VendaForm({ onSuccess }: VendaFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<VendaFormData>({
    resolver: zodResolver(vendaSchema),
  });

  const quantidade = watch('quantidade', 0);
  const precoUnitario = watch('preco_unitario', 0);
  const total = quantidade * precoUnitario;

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err: any) {
      setError('Erro ao carregar clientes');
    }
  };

  const onSubmit = async (data: VendaFormData) => {
    setLoading(true);
    setError('');

    try {
      await api.post('/vendas', {
        ...data,
        total: data.quantidade * data.preco_unitario,
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao registrar venda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 border border-primary-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-300 to-secondary-200">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Nova Venda</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cliente *
          </label>
          <select
            {...register('cliente_id', { valueAsNumber: true })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200"
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {errors.cliente_id && (
            <p className="text-red-600 text-sm mt-2 font-medium">{errors.cliente_id.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantidade *
            </label>
            <input
              {...register('quantidade', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200"
            />
            {errors.quantidade && (
              <p className="text-red-600 text-sm mt-2 font-medium">{errors.quantidade.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preço Unitário *
            </label>
            <input
              {...register('preco_unitario', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0.01"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200"
              placeholder="0.00"
            />
            {errors.preco_unitario && (
              <p className="text-red-600 text-sm mt-2 font-medium">{errors.preco_unitario.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            {...register('observacoes')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-300 outline-none transition-all duration-200 resize-none"
            rows={3}
            placeholder="Observações adicionais..."
          />
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-primary-100/50 to-secondary-100/30 p-5 rounded-xl border-2 border-primary-200">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Total:</span>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-300 to-secondary-200 bg-clip-text text-transparent">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-300 to-secondary-200 hover:from-primary-400 hover:to-secondary-200 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Registrando...' : 'Registrar Venda'}
        </button>
      </form>
    </div>
  );
}
