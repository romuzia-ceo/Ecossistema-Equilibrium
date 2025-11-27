import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentStatus } from '../types';
import { getEquipment, saveEquipment } from '../services/patrimonyService';
import EquipmentModal from '../components/patrimony/EquipmentModal';

const getStatusStyles = (status: EquipmentStatus) => {
    switch (status) {
        case EquipmentStatus.OPERATIONAL:
            return 'bg-green-100 text-green-800';
        case EquipmentStatus.IN_MAINTENANCE:
            return 'bg-yellow-100 text-yellow-800';
        case EquipmentStatus.NEEDS_ATTENTION:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const PatrimonyView: React.FC = () => {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getEquipment();
        setEquipmentList(data);
        setIsLoading(false);
    };

    const handleAddNew = () => {
        setSelectedEquipment({
            id: `new-${Date.now()}`,
            name: '',
            location: '',
            status: EquipmentStatus.OPERATIONAL,
            lastMaintenance: '',
            nextMaintenance: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsModalOpen(true);
    };

    const handleSave = async (equipment: Equipment) => {
        await saveEquipment(equipment);
        setIsModalOpen(false);
        setSelectedEquipment(null);
        await loadData();
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando equipamentos...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#002C3C]">Gestão de Patrimônio</h2>
                    <button
                        onClick={handleAddNew}
                        className="bg-teal-50 text-[#1B7C75] font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-teal-100"
                    >
                        <i className="ph ph-plus"></i> Novo Equipamento
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-[#004D5A] uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Equipamento</th>
                                <th className="px-4 py-3">Localização</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Última Manutenção</th>
                                <th className="px-4 py-3">Próxima Manutenção</th>
                                <th className="px-4 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipmentList.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3">{item.location}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyles(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{new Date(item.lastMaintenance).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                    <td className="px-4 py-3">{new Date(item.nextMaintenance).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleEdit(item)} className="font-medium text-[#1B7C75] hover:underline">
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <EquipmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                equipment={selectedEquipment}
            />
        </div>
    );
};

export default PatrimonyView;