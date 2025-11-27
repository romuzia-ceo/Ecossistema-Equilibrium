import React, { useState, useEffect } from 'react';
// FIX: Added Availability to imports to support default availability generation.
import { User, Professional, Availability } from '../../types';
import { getUsers, saveUser, updateProfessional } from '../../services/managementService';

interface UsersTabProps {
    onDataChange: () => void;
}

// FIX: Added a helper function to generate default availability for new professionals, matching the data structure.
const generateDefaultAvailability = (): { [date: string]: Availability | null } => {
    const availability: { [date: string]: Availability | null } = {};
    // Using a fixed date range consistent with other mock data for predictability
    const startDate = new Date('2025-11-01T12:00:00Z'); 
    const weekdaysAvailability: { [key: number]: Availability | null } = {
        1: { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } }, // Monday
        2: { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } }, // Tuesday
        3: { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } }, // Wednesday
        4: { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } }, // Thursday
        5: { start: '09:00', end: '17:00' }, // Friday
        0: null, // Sunday
        6: null, // Saturday
    };

    // Generate for ~3 months
    for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split('T')[0];
        
        const dayAvailability = weekdaysAvailability[dayOfWeek];
        // Deep copy to avoid reference issues
        availability[dateString] = dayAvailability ? JSON.parse(JSON.stringify(dayAvailability)) : null;
    }
    return availability;
};

const UsersTab: React.FC<UsersTabProps> = ({ onDataChange }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const emptyUser: User = { id: '', name: '', email: '', role: 'recepcao' };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
        setIsLoading(false);
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser({ ...user });
    };

    const handleAddNew = () => {
        setSelectedUser({ ...emptyUser, id: `new-${Date.now()}` });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        const isNewUser = selectedUser.id.startsWith('new-');
        
        const savedUser = await saveUser(selectedUser);

        // If a new user was created with the professional role, automatically create their professional profile.
        if (isNewUser && savedUser.role === 'professional') {
            // FIX: Replaced 'workingHours' with 'availability' and generated a valid schedule structure to match the Professional type.
            const newProfessional: Professional = {
                id: `new-prof-${Date.now()}`, // The service will assign a permanent ID
                name: savedUser.name,
                role: 'Especialidade a definir',
                availability: generateDefaultAvailability(),
                schedule: {},
            };
            await updateProfessional(newProfessional);
        }
        
        onDataChange();
    };

    const handleCancel = () => {
        setSelectedUser(null);
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando usuários...</div>;
    }

    const roleLabels: Record<User['role'], string> = {
        admin: 'Admin',
        recepcao: 'Recepção',
        financeiro: 'Financeiro',
        professional: 'Profissional de Saúde',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[#002C3C]">Usuários do Sistema</h3>
                    <button onClick={handleAddNew} className="bg-teal-50 text-[#1B7C75] font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-teal-100">
                         <i className="ph ph-plus"></i> Novo Usuário
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-[#004D5A] uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Nome</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Função</th>
                                <th className="px-4 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{roleLabels[user.role]}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleSelectUser(user)} className="font-medium text-[#1B7C75] hover:underline">
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedUser && (
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="font-bold text-lg text-[#002C3C] mb-4">
                        {selectedUser.id.startsWith('new') ? 'Adicionar Usuário' : 'Editar Usuário'}
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                id="user-name"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="user-email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">Função</label>
                            <select
                                id="user-role"
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as User['role'] })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="recepcao">Recepção</option>
                                <option value="financeiro">Financeiro</option>
                                <option value="admin">Admin</option>
                                <option value="professional">Profissional de Saúde</option>
                            </select>
                        </div>
                        {selectedUser.role === 'professional' && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                                <p>
                                    <i className="ph-bold ph-info mr-1"></i>
                                    Para configurar a agenda e o perfil clínico, acesse a aba <strong>Profissionais</strong> após salvar este usuário.
                                </p>
                            </div>
                        )}
                        <div className="flex gap-2 justify-end pt-4">
                            <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                            <button type="submit" className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg">Salvar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UsersTab;