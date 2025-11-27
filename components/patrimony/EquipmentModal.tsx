import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentStatus } from '../../types';

interface EquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (equipment: Equipment) => void;
    equipment: Equipment | null;
}

const EquipmentModal: React.FC<EquipmentModalProps> = ({ isOpen, onClose, onSave, equipment }) => {
    const [formData, setFormData] = useState<Equipment | null>(null);

    useEffect(() => {
        setFormData(equipment ? { ...equipment } : null);
    }, [equipment, isOpen]);

    const handleChange = (field: keyof Equipment, value: any) => {
        if (formData) {
            setFormData({ ...formData, [field]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };

    if (!isOpen || !formData) return null;

    const isNew = formData.id.startsWith('new-');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-bold text-[#002C3C]">{isNew ? 'Adicionar Novo Equipamento' : 'Editar Equipamento'}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Equipamento</label>
                            <input type="text" id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Localização</label>
                            <input type="text" id="location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" value={formData.status} onChange={(e) => handleChange('status', e.target.value as EquipmentStatus)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                {Object.values(EquipmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="lastMaintenance" className="block text-sm font-medium text-gray-700">Última Manutenção</label>
                                <input type="date" id="lastMaintenance" value={formData.lastMaintenance} onChange={(e) => handleChange('lastMaintenance', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="nextMaintenance" className="block text-sm font-medium text-gray-700">Próxima Manutenção</label>
                                <input type="date" id="nextMaintenance" value={formData.nextMaintenance} onChange={(e) => handleChange('nextMaintenance', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentModal;
