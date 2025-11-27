import React, { useState, useEffect } from 'react';
import { PayableRecord, PayableStatus } from '../../types';
import { getPayables, savePayable, deletePayable } from '../../services/payableService';

const AccountsPayable: React.FC = () => {
    const [payables, setPayables] = useState<PayableRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');
    const [status, setStatus] = useState<PayableStatus>(PayableStatus.PENDING);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getPayables();
        setPayables(data);
        setIsLoading(false);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setDescription('');
        setAmount('');
        setDueDate(new Date().toISOString().split('T')[0]);
        setCategory('');
        setSupplier('');
        setStatus(PayableStatus.PENDING);
        setIsModalOpen(true);
    };

    const handleEdit = (p: PayableRecord) => {
        setEditingId(p.id);
        setDescription(p.description);
        setAmount(p.amount.toString());
        setDueDate(p.dueDate);
        setCategory(p.category);
        setSupplier(p.supplier || '');
        setStatus(p.status);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
            await deletePayable(id);
            loadData();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await savePayable({
            id: editingId || undefined,
            description,
            amount: parseFloat(amount),
            dueDate,
            category,
            supplier,
            status
        });
        setIsModalOpen(false);
        loadData();
    };

    const getStatusColor = (s: PayableStatus) => {
        switch(s) {
            case PayableStatus.PAID: return 'bg-green-100 text-green-800';
            case PayableStatus.OVERDUE: return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    }

    if (isLoading) return <div className="p-8 text-center">Carregando contas...</div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-[#002C3C]">Contas a Pagar</h3>
                <button onClick={handleAddNew} className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#004D5A] flex items-center gap-2">
                    <i className="ph-bold ph-plus"></i> Nova Conta
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-[#004D5A] uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Vencimento</th>
                            <th className="px-4 py-3">Descrição</th>
                            <th className="px-4 py-3">Fornecedor</th>
                            <th className="px-4 py-3">Categoria</th>
                            <th className="px-4 py-3 text-right">Valor</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payables.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{new Date(p.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{p.description}</td>
                                <td className="px-4 py-3">{p.supplier || '-'}</td>
                                <td className="px-4 py-3">{p.category}</td>
                                <td className="px-4 py-3 text-right font-semibold">
                                    {p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(p.status)}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center flex justify-center gap-2">
                                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><i className="ph-bold ph-pencil-simple"></i></button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><i className="ph-bold ph-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                        {payables.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-500">Nenhuma conta a pagar registrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#002C3C] mb-4">{editingId ? 'Editar Conta' : 'Nova Conta a Pagar'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                <input type="text" required value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Valor</label>
                                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vencimento</label>
                                    <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                                    <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" placeholder="Ex: Luz, Aluguel" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
                                    <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value as PayableStatus)} className="mt-1 block w-full p-2 border rounded-md">
                                    <option value={PayableStatus.PENDING}>Pendente</option>
                                    <option value={PayableStatus.PAID}>Pago</option>
                                    <option value={PayableStatus.OVERDUE}>Atrasado</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold text-gray-700">Cancelar</button>
                                <button type="submit" className="bg-[#1B7C75] px-4 py-2 rounded-lg font-bold text-white">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsPayable;