import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryItemStatus } from '../types';
import { getInventoryItems, saveInventoryItem } from '../services/inventoryService';
import InventoryModal from '../components/inventory/InventoryModal';

const getItemStatus = (item: InventoryItem): InventoryItemStatus => {
    if (item.quantity <= 0) {
        return InventoryItemStatus.OUT_OF_STOCK;
    }
    if (item.quantity <= item.lowStockThreshold) {
        return InventoryItemStatus.LOW_STOCK;
    }
    return InventoryItemStatus.IN_STOCK;
};

const getStatusStyles = (status: InventoryItemStatus) => {
    switch (status) {
        case InventoryItemStatus.IN_STOCK:
            return 'bg-green-100 text-green-800';
        case InventoryItemStatus.LOW_STOCK:
            return 'bg-yellow-100 text-yellow-800';
        case InventoryItemStatus.OUT_OF_STOCK:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const InventoryView: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getInventoryItems();
        setInventory(data);
        setIsLoading(false);
    };

    const handleAddNew = () => {
        setSelectedItem({
            id: `new-${Date.now()}`,
            name: '',
            category: 'Insumo Médico',
            quantity: 0,
            lowStockThreshold: 10,
            supplier: '',
            lastRestockDate: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const handleEdit = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleSave = async (item: InventoryItem) => {
        await saveInventoryItem(item);
        setIsModalOpen(false);
        setSelectedItem(null);
        await loadData();
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando inventário...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#002C3C]">Gestão de Estoque</h2>
                    <button
                        onClick={handleAddNew}
                        className="bg-teal-50 text-[#1B7C75] font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-teal-100"
                    >
                        <i className="ph ph-plus"></i> Adicionar Item
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-[#004D5A] uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Categoria</th>
                                <th className="px-4 py-3 text-center">Quantidade</th>
                                <th className="px-4 py-3 text-center">Limite Mín.</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Fornecedor</th>
                                <th className="px-4 py-3">Última Reposição</th>
                                <th className="px-4 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => {
                                const status = getItemStatus(item);
                                return (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3">{item.category}</td>
                                    <td className="px-4 py-3 text-center font-semibold">{item.quantity}</td>
                                    <td className="px-4 py-3 text-center">{item.lowStockThreshold}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyles(status)}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{item.supplier}</td>
                                    <td className="px-4 py-3">{new Date(item.lastRestockDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleEdit(item)} className="font-medium text-[#1B7C75] hover:underline">
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            <InventoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                item={selectedItem}
            />
        </div>
    );
};

export default InventoryView;