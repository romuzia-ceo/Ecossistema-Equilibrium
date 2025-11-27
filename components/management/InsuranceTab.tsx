import React, { useState, useEffect } from 'react';
import { HealthInsurancePlan, ClinicService } from '../../types';
import { getInsurancePlans, saveInsurancePlan, getServices } from '../../services/managementService';

interface InsuranceTabProps {
    onDataChange: () => void;
}

const InsuranceTab: React.FC<InsuranceTabProps> = ({ onDataChange }) => {
    const [plans, setPlans] = useState<HealthInsurancePlan[]>([]);
    const [services, setServices] = useState<ClinicService[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<HealthInsurancePlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const emptyPlan: HealthInsurancePlan = { id: '', name: '', priceTable: {} };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [plansData, servicesData] = await Promise.all([getInsurancePlans(), getServices()]);
        setPlans(plansData);
        setServices(servicesData);
        setIsLoading(false);
    };

    const handleSelectPlan = (plan: HealthInsurancePlan) => {
        setSelectedPlan({ ...plan });
    };

    const handleAddNew = () => {
        setSelectedPlan({ ...emptyPlan, id: `new-${Date.now()}` });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;
        
        await saveInsurancePlan(selectedPlan);
        onDataChange();
    };

    const handleCancel = () => {
        setSelectedPlan(null);
    };

    const handlePriceChange = (serviceId: string, value: string) => {
        if (!selectedPlan) return;
        
        const newPriceTable = { ...selectedPlan.priceTable };
        const price = parseFloat(value);
        if (!isNaN(price) && price > 0) {
            newPriceTable[serviceId] = price;
        } else {
            delete newPriceTable[serviceId]; // Remove if value is empty or invalid
        }

        setSelectedPlan({ ...selectedPlan, priceTable: newPriceTable });
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando convênios e serviços...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[#002C3C]">Convênios</h3>
                     <button onClick={handleAddNew} className="bg-teal-50 text-[#1B7C75] font-bold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-teal-100 text-sm">
                         <i className="ph ph-plus"></i> Novo
                    </button>
                </div>
                <ul className="space-y-2">
                    {plans.map(plan => (
                        <li key={plan.id}>
                            <button
                                onClick={() => handleSelectPlan(plan)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                    selectedPlan?.id === plan.id
                                        ? 'bg-[#004D5A] text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <p className="font-semibold">{plan.name}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md">
                {selectedPlan ? (
                    <form onSubmit={handleSave}>
                        <h3 className="font-bold text-lg text-[#002C3C] mb-4">
                            {selectedPlan.id.startsWith('new') ? 'Adicionar Convênio' : `Editando ${selectedPlan.name}`}
                        </h3>
                        <div className="mb-4">
                            <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700">Nome do Convênio</label>
                            <input
                                type="text"
                                id="plan-name"
                                value={selectedPlan.name}
                                onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <h4 className="font-semibold text-md text-[#002C3C] mb-2">Tabela de Preços</h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                           {services.map(service => (
                               <div key={service.id} className="grid grid-cols-3 items-center gap-4">
                                   <label htmlFor={`price-${service.id}`} className="col-span-2 text-sm text-gray-800">{service.name}</label>
                                   <input
                                       type="number"
                                       id={`price-${service.id}`}
                                       value={selectedPlan.priceTable[service.id] || ''}
                                       onChange={(e) => handlePriceChange(service.id, e.target.value)}
                                       className="col-span-1 block w-full p-2 border border-gray-300 rounded-md"
                                       placeholder={`Padrão: R$${service.price}`}
                                       step="0.01"
                                       min="0"
                                   />
                               </div>
                           ))}
                        </div>

                        <div className="flex gap-2 justify-end mt-6">
                            <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                            <button type="submit" className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg">Salvar Convênio</button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Selecione um convênio para editar ou adicione um novo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsuranceTab;