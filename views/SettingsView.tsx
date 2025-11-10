import React, { useState } from 'react';

const FormInput: React.FC<{ label: string; id: string; value: string; placeholder: string; isReadOnly?: boolean }> = ({ label, id, value, placeholder, isReadOnly = false }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
            {label}
        </label>
        <div className="relative">
            <input
                type="text"
                id={id}
                readOnly={isReadOnly}
                value={value}
                className={`block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#1B7C75] focus:border-[#1B7C75] ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                placeholder={placeholder}
            />
            {!isReadOnly && (
                 <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                    <i className="ph ph-pencil-simple"></i>
                </button>
            )}
             {isReadOnly && (
                 <button 
                    onClick={() => navigator.clipboard.writeText(value)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    title="Copiar para a área de transferência"
                >
                    <i className="ph ph-copy"></i>
                </button>
            )}
        </div>
    </div>
);


const SettingsView: React.FC = () => {
    const [status, setStatus] = useState<'disconnected' | 'connected'>('disconnected');

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        // Em um app real, aqui