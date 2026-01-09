require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');

// Importar rotas
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const vendasRoutes = require('./routes/vendas');
const retiradasRoutes = require('./routes/retiradas');
const dashboardRoutes = require('./routes/dashboard');

// Inicializar aplicação
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar banco de dados
initializeDatabase();

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Fonte Flow - Servidor rodando',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clientes: '/api/clientes',
      vendas: '/api/vendas',
      retiradas: '/api/retiradas',
      dashboard: '/api/dashboard'
    }
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api/retiradas', retiradasRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔐 Usuário padrão: admin@fonteflow.com / admin123`);
});

module.exports = app;
