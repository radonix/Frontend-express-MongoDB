import React from 'react';
import ItemList from '../components/Items/ItemList';
import LogoutButton from '../components/Auth/LogoutButton';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h2>Área Logada</h2>
      <ItemList /> {/* Exemplo de listagem */}
      {/* Adicione outros componentes para criar, editar, deletar itens */}
      <LogoutButton />
    </div>
  );
};

export default DashboardPage;