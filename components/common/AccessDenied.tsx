import React from 'react';

const AccessDenied: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-4">
      <i className="ph-bold ph-lock-key-open text-7xl text-red-400 mb-4"></i>
      <h2 className="text-2xl font-bold text-[#002C3C] mb-2">Acesso Negado</h2>
      <p className="text-gray-600 max-w-md">
        Você não tem permissão para visualizar esta página. Por favor, selecione um perfil com acesso ou contate o administrador do sistema.
      </p>
    </div>
  );
};

export default AccessDenied;
