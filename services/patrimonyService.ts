import { MOCK_EQUIPMENT } from '../constants';
import { Equipment } from '../types';

// ===================================================================================
// SERVIÇO DE GESTÃO DE PATRIMÔNIO (SIMULAÇÃO DE BACKEND)
// ===================================================================================

let equipmentData: Equipment[] = JSON.parse(JSON.stringify(MOCK_EQUIPMENT));

export const getEquipment = async (): Promise<Equipment[]> => {
    return new Promise(resolve => setTimeout(() => resolve(
        [...equipmentData].sort((a, b) => a.name.localeCompare(b.name))
    ), 300));
};

export const saveEquipment = async (equipment: Equipment): Promise<Equipment> => {
    return new Promise(resolve => {
        const index = equipmentData.findIndex(e => e.id === equipment.id);
        if (index !== -1) {
            equipmentData[index] = equipment;
            resolve(equipment);
        } else {
            const newEquipment = { ...equipment, id: `equip-${Date.now()}` };
            equipmentData.push(newEquipment);
            resolve(newEquipment);
        }
    });
};
