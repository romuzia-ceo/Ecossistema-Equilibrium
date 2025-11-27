import { MOCK_INVENTORY_ITEMS } from '../constants';
import { InventoryItem } from '../types';

// ===================================================================================
// SERVIÇO DE GESTÃO DE ESTOQUE (SIMULAÇÃO DE BACKEND)
// ===================================================================================

let inventoryData: InventoryItem[] = JSON.parse(JSON.stringify(MOCK_INVENTORY_ITEMS));

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
    return new Promise(resolve => setTimeout(() => resolve(
        [...inventoryData].sort((a, b) => a.name.localeCompare(b.name))
    ), 300));
};

export const saveInventoryItem = async (item: InventoryItem): Promise<InventoryItem> => {
    return new Promise(resolve => {
        const index = inventoryData.findIndex(e => e.id === item.id);
        if (index !== -1) {
            inventoryData[index] = item;
            resolve(item);
        } else {
            const newItem = { ...item, id: `inv-${Date.now()}` };
            inventoryData.push(newItem);
            resolve(newItem);
        }
    });
};