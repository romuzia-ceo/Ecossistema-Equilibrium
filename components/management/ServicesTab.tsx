import React, { useState, useEffect } from 'react';
import { ClinicService } from '../../types';
import { getServices, saveService } from '../../services/managementService';

interface ServicesTabProps {
    onDataChange: () => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ onDataChange }) => {
    const [services, setServices] = useState<ClinicService[]>([]);
    const [selectedService, setSelectedService] = useState<ClinicService | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const emptyService: ClinicService = { id: '', name: '', price: 0, instructions: '' };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getServices();
        setServices(data);
        setIsLoading(false);
    };

    const handleSelectService = (service: ClinicService) => {
        setSelectedService({ ...service });
    };

    const handleAddNew = () => {
        setSelectedService({ ...emptyService, id: `new-${Date.now()}` });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService) return;
        
        await saveService(selectedService);
        onDataChange();
    };

    const handleCancel = () => {
        setSelectedService(null);
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando serviços...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[#002C3C]">Catálogo de Serviços</h3>
                    <button
                        onClick={handleAddNew}
                        className="bg-teal-50 text-[#1B7C75] font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-teal-100"
                    >
                         <i className="ph ph-plus"></i> Novo Serviço
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-[#004D5A] uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Nome do Serviço</th>
                                <th className="px-4 py-3 text-right">Preço</th>
                                <th className="px-4 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{service.name}</td>
                                    <td className="px-4 py-3 text-right">
                                        {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleSelectService(service)}
                                            className="font-medium text-[#1B7C75] hover:underline"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedService && (
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="font-bold text-lg text-[#002C3C] mb-4">
                        {selectedService.id.startsWith('new') ? 'Adicionar Novo Serviço' : 'Editar Serviço'}
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="service-name" className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                id="service-name"
                                value={selectedService.name}
                                onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="service-price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                            <input
                                type="number"
                                id="service-price"
                                value={selectedService.price}
                                onChange={(e) => setSelectedService({ ...selectedService, price: parseFloat(e.target.value) || 0 })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                             <label htmlFor="service-instructions" className="block text-sm font-medium text-gray-700">Instruções / Preparo</label>
                             <textarea
                                id="service-instructions"
                                value={selectedService.instructions || ''}
                                onChange={(e) => setSelectedService({ ...selectedService, instructions: e.target.value })}
                                rows={5}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Instruções para o paciente (opcional)..."
                             />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                            <button type="submit" className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg">Salvar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ServicesTab;