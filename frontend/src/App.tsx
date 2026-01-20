import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vendas from './pages/Vendas';
import Clientes from './pages/Clientes';
import Relatorio from './pages/Relatorio';
import Layout from './components/Layout';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    return isAuthenticated() ? (
      <Layout>{children}</Layout>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendas" 
          element={
            <ProtectedRoute>
              <Vendas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clientes" 
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorio" 
          element={
            <ProtectedRoute>
              <Relatorio />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

