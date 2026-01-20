import { useEffect, useState } from 'react';
import api from '../services/api';
import VendaForm from '../components/VendaForm';

interface Venda {
  id: number;
  cliente_nome: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
  data_venda: string;
  observacoes?: string;
}

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    try {
      const response = await api.get('/vendas');
      setVendas(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  const handleVendaSuccess = () => {
    fetchVendas();
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Vendas</h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <VendaForm onSuccess={handleVendaSuccess} />
        </div>

        {/* Lista de Vendas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 border border-primary-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5">Vendas Recentes</h2>

            {loading ? (
              <div className="text-gray-600 text-center py-8">Carregando...</div>
            ) : vendas.length === 0 ? (
              <div className="text-gray-500 text-center py-10">
                Nenhuma venda registrada
              </div>
            ) : (
              <div className="space-y-4">
                {vendas.map((venda) => (
                  <div
                    key={venda.id}
                    className="border-2 border-primary-100 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-primary-300 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{venda.cliente_nome}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {new Date(venda.data_venda).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-300 to-secondary-200 bg-clip-text text-transparent">
                          R$ {venda.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      <span className="bg-primary-100 text-primary-400 px-3 py-1.5 rounded-lg font-medium">{venda.quantidade} un</span>
                      <span className="bg-secondary-100/50 text-secondary-200 px-3 py-1.5 rounded-lg font-medium">R$ {venda.preco_unitario.toFixed(2)}/un</span>
                    </div>
                    {venda.observacoes && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-3 italic bg-gray-50 p-3 rounded-lg">
                        {venda.observacoes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
