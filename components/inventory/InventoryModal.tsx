import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: InventoryItem) => void;
    item: InventoryItem | null;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState<InventoryItem | null>(null);

    useEffect(() => {
        setFormData(item ? { ...item } : null);
    }, [item, isOpen]);

    const handleChange = (field: keyof InventoryItem, value: any) => {
        if (formData) {
            const numValue = ['quantity', 'lowStockThreshold'].includes(field) ? Number(value) : value;
            setFormData({ ...formData, [field]: numValue });
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
                        <h3 className="text-lg font-bold text-[#002C3C]">{isNew ? 'Adicionar Novo Item ao Estoque' : 'Editar Item'}</h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Item</label>
                            <input type="text" id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
                                <input type="text" id="category" value={formData.category} onChange={(e) => handleChange('category', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Fornecedor</label>
                                <input type="text" id="supplier" value={formData.supplier} onChange={(e) => handleChange('supplier', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade Atual</label>
                                <input type="number" id="quantity" value={formData.quantity} onChange={(e) => handleChange('quantity', e.target.value)} required min="0" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">Alerta de Estoque Baixo</label>
                                <input type="number" id="lowStockThreshold" value={formData.lowStockThreshold} onChange={(e) => handleChange('lowStockThreshold', e.target.value)} required min="0" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>

                         <div>
                            <label htmlFor="lastRestockDate" className="block text-sm font-medium text-gray-700">Data da Última Reposição</label>
                            <input type="date" id="lastRestockDate" value={formData.lastRestockDate} onChange={(e) => handleChange('lastRestockDate', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
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

export default InventoryModal;