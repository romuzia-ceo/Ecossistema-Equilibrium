import { PayableRecord, PayableStatus } from '../types';

// ===================================================================================
// SERVIÇO DE CONTAS A PAGAR (SIMULAÇÃO DE BACKEND)
// ===================================================================================

const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

// Mock Data
let payableRecords: PayableRecord[] = [
    {
        id: 'pay-1',
        description: 'Aluguel Unidade São Roque',
        amount: 4500.00,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0],
        category: 'Infraestrutura',
        status: PayableStatus.PAID,
        supplier: 'Imobiliária Central'
    },
    {
        id: 'pay-2',
        description: 'Conta de Energia (CPFL)',
        amount: 850.00,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 15).toISOString().split('T')[0],
        category: 'Utilidades',
        status: PayableStatus.PAID,
        supplier: 'CPFL'
    },
    {
        id: 'pay-3',
        description: 'Internet Fibra',
        amount: 120.00,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 20).toISOString().split('T')[0],
        category: 'Utilidades',
        status: PayableStatus.PENDING,
        supplier: 'Vivo Empresas'
    },
    {
        id: 'pay-4',
        description: 'Material de Limpeza',
        amount: 350.00,
        dueDate: new Date(today.getFullYear(), today.getMonth(), 25).toISOString().split('T')[0],
        category: 'Insumos',
        status: PayableStatus.PENDING,
        supplier: 'LimpaTudo Ltda'
    },
    // Next Month Projections
    {
        id: 'pay-5',
        description: 'Aluguel Unidade São Roque',
        amount: 4500.00,
        dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5).toISOString().split('T')[0],
        category: 'Infraestrutura',
        status: PayableStatus.PENDING,
        supplier: 'Imobiliária Central'
    },
    {
        id: 'pay-6',
        description: 'Folha de Pagamento (Recepção)',
        amount: 6500.00,
        dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5).toISOString().split('T')[0],
        category: 'RH',
        status: PayableStatus.PENDING,
        supplier: 'Interno'
    }
];

export const getPayables = async (): Promise<PayableRecord[]> => {
    return new Promise(resolve => setTimeout(() => resolve(
        [...payableRecords].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    ), 300));
};

export const savePayable = async (payable: Omit<PayableRecord, 'id'> & { id?: string }): Promise<PayableRecord> => {
    return new Promise(resolve => {
        if (payable.id) {
            const index = payableRecords.findIndex(p => p.id === payable.id);
            if (index !== -1) {
                const updated = { ...payable, id: payable.id } as PayableRecord;
                payableRecords[index] = updated;
                resolve(updated);
                return;
            }
        }

        const newPayable: PayableRecord = {
            ...payable,
            id: `pay-${Date.now()}`,
        } as PayableRecord;
        
        payableRecords.push(newPayable);
        resolve(newPayable);
    });
};

export const deletePayable = async (id: string): Promise<void> => {
    return new Promise(resolve => {
        payableRecords = payableRecords.filter(p => p.id !== id);
        resolve();
    });
};