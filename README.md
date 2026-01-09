<div align="center">

# 💧 Fonte Flow

### Sistema de Gestão para Distribuidores de Água

*Controle completo de estoque, vendas e prestação de contas*

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19.2.0-61dafb)](https://reactjs.org)

</div>

---

## 📋 Sobre o Projeto

**Fonte Flow** é uma solução web completa desenvolvida para facilitar a gestão operacional e financeira de distribuidores de água. O sistema oferece controle de estoque, cadastro de clientes, registro de vendas e geração de relatórios automatizados para prestação de contas.

### 🎯 Objetivo do MVP

Desenvolver um sistema funcional e intuitivo que permita:
- ✅ Cadastro e gerenciamento de clientes
- ✅ Registro de vendas com preços personalizados
- ✅ Controle de estoque de garrafões
- ✅ Dashboard com indicadores em tempo real
- ✅ Relatórios mensais automatizados para fornecedores

### 💼 Caso de Uso Inicial

Sistema otimizado para um transportador que gerencia:
- **1.000 garrafões/mês** com custo de **R$ 2,00** por unidade
- Vendas diárias com **preços variáveis** por cliente
- Prestação de contas mensal com fornecedora

---

## 🚀 Status do Desenvolvimento

| Fase | Descrição | Status |
|:----:|-----------|:------:|
| **1** | Setup do ambiente (Vite + React + Tailwind + Backend) | ✅ Concluída |
| **2** | Backend – Express + SQLite + JWT + rotas básicas | 🔄 Em andamento |
| **3** | Frontend – Telas principais + integração com API | ⏳ Pendente |
| **4** | Integração completa + testes end-to-end | ⏳ Pendente |
| **5** | Deploy (Vercel frontend + Railway backend) | ⏳ Pendente |

---

## 🛠️ Stack Tecnológica

### **Frontend**
```
⚛️  React 19.2.0 + TypeScript
🎨 Tailwind CSS
🧭 React Router
📡 Axios
📝 React Hook Form + Zod
📊 Chart.js + react-chartjs-2
🎯 Lucide Icons
⚡ Vite
```

### **Backend**
```
🟢 Node.js + Express
💾 SQLite (desenvolvimento)
🔐 JWT (autenticação)
🔒 bcryptjs (hash de senhas)
```

### **Deploy (Planejado)**
```
🌐 Frontend → Vercel
🚂 Backend + Banco → Railway
```

---

## 📁 Estrutura do Projeto

```
fonte-flow/
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── backend/           # API REST
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── middlewares/
    └── package.json
```

---

## 🎯 Funcionalidades Planejadas

### 📱 Módulos Principais

- **🔐 Autenticação**
  - Login seguro com JWT
  - Controle de sessão

- **📊 Dashboard**
  - Estoque atual de garrafões
  - Vendas recentes
  - Gráficos de desempenho
  - Indicadores financeiros

- **👥 Gestão de Clientes**
  - Cadastro completo
  - Histórico de compras
  - Preços personalizados

- **💰 Registro de Vendas**
  - Lançamento de vendas diárias
  - Controle de retiradas
  - Cálculo automático de valores

- **📈 Relatórios**
  - Relatório mensal consolidado
  - Prestação de contas automática
  - Exportação de dados

---

## 🗺️ Roadmap

### ✅ Fase 1 - Setup (Concluída)
- [x] Configuração do ambiente de desenvolvimento
- [x] Setup Vite + React + TypeScript
- [x] Configuração Tailwind CSS
- [x] Estrutura inicial do backend

### 🔄 Fase 2 - Backend (Em Andamento)
- [ ] Implementar rotas de clientes
- [ ] Implementar rotas de vendas
- [ ] Implementar rotas de estoque
- [ ] Implementar dashboard endpoints
- [ ] Implementar geração de relatórios
- [ ] Configurar autenticação JWT

### ⏳ Fase 3 - Frontend
- [ ] Tela de Login
- [ ] Dashboard principal
- [ ] CRUD de Clientes
- [ ] Registro de Vendas
- [ ] Tela de Relatórios
- [ ] Integração com API

### ⏳ Fase 4 - Testes
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes end-to-end

### ⏳ Fase 5 - Deploy
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway)
- [ ] Configuração de domínio
- [ ] Monitoramento

---

## 🚀 Como Executar

### Pré-requisitos
```bash
Node.js >= 18.0.0
npm ou yarn
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Desenvolvido com 💙 para facilitar a gestão de distribuidores de água**

*Última atualização: Janeiro 2026*

</div>