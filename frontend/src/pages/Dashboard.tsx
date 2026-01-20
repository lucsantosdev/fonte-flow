import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardData {
  estoqueAtual: number;
  vendasHoje: number;
  vendasMes: number;
  faturamentoHoje: number;
  faturamentoMes: number;
  vendasDiarias: Array<{
    data: string;
    total: number;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Preparar dados do gráfico
  const chartData = {
    labels: data.vendasDiarias.map(v => {
      const date = new Date(v.data);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }),
    datasets: [
      {
        label: 'Vendas Diárias',
        data: data.vendasDiarias.map(v => v.total),
        borderColor: '#285487',
        backgroundColor: 'rgba(40, 84, 135, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vendas dos Últimos 7 Dias',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Dashboard</h1>
      
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
        <DashboardCard
          title="Estoque Atual"
          value={data.estoqueAtual}
          Icon={Package}
          subtitle="unidades em estoque"
          gradient="from-primary-300 to-primary-200"
        />
        <DashboardCard
          title="Vendas Hoje"
          value={data.vendasHoje}
          Icon={ShoppingBag}
          subtitle={`R$ ${data.faturamentoHoje.toFixed(2)}`}
          gradient="from-primary-200 to-secondary-100"
        />
        <DashboardCard
          title="Vendas do Mês"
          value={data.vendasMes}
          Icon={TrendingUp}
          subtitle={`R$ ${data.faturamentoMes.toFixed(2)}`}
          gradient="from-secondary-100 to-secondary-200"
        />
        <DashboardCard
          title="Faturamento Mensal"
          value={`R$ ${data.faturamentoMes.toFixed(2)}`}
          Icon={DollarSign}
          subtitle={`${data.vendasMes} vendas`}
          gradient="from-primary-400 to-primary-300"
        />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 border border-primary-100">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
