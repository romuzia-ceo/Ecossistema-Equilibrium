import React from 'react';
import { SYSTEM_USERS } from '../constants';
import { SystemUser } from '../types';

interface UserSwitcherProps {
  currentUser: SystemUser;
  onUserChange: (user: SystemUser) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ currentUser, onUserChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = event.target.value;
    const selectedUser = SYSTEM_USERS.find(u => u.id === selectedUserId);
    if (selectedUser) {
      onUserChange(selectedUser);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-9 h-9 bg-[#004D5A] rounded-full flex items-center justify-center text-white font-semibold text-sm" 
        title={currentUser.name}
      >
        {currentUser.initials}
      </div>
      <select
        value={currentUser.id}
        onChange={handleChange}
        className="bg-transparent border-none text-sm font-semibold text-gray-700 focus:ring-0 focus:outline-none cursor-pointer"
        aria-label="Selecionar perfil de usuário"
      >
        {SYSTEM_USERS.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSwitcher;
