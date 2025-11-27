import React, { useState, useEffect } from 'react';
import { Template, TemplateType } from '../../types';
import { getTemplates, saveTemplate } from '../../services/managementService';

interface TemplatesTabProps {
    onDataChange: () => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ onDataChange }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const emptyTemplate: Template = { id: '', name: '', type: TemplateType.PRONTUARIO, content: '' };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getTemplates();
        setTemplates(data);
        setIsLoading(false);
    };

    const handleSelectTemplate = (template: Template) => {
        setSelectedTemplate({ ...template });
    };

    const handleAddNew = () => {
        setSelectedTemplate({ ...emptyTemplate, id: `new-${Date.now()}` });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemplate) return;
        
        await saveTemplate(selectedTemplate);
        onDataChange();
    };

    const handleCancel = () => {
        setSelectedTemplate(null);
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando modelos...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[#002C3C]">Modelos</h3>
                    <button onClick={handleAddNew} className="bg-teal-50 text-[#1B7C75] font-bold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-teal-100 text-sm">
                         <i className="ph ph-plus"></i> Novo
                    </button>
                </div>
                 <ul className="space-y-2">
                    {templates.map(template => (
                        <li key={template.id}>
                            <button
                                onClick={() => handleSelectTemplate(template)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                    selectedTemplate?.id === template.id
                                        ? 'bg-[#004D5A] text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <p className="font-semibold">{template.name}</p>
                                <p className={`text-sm ${selectedTemplate?.id === template.id ? 'text-gray-200' : 'text-gray-500'}`}>{template.type}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedTemplate && (
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="font-bold text-lg text-[#002C3C] mb-4">
                        {selectedTemplate.id.startsWith('new') ? 'Criar Novo Modelo' : 'Editar Modelo'}
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">Nome do Modelo</label>
                                <input
                                    type="text"
                                    id="template-name"
                                    value={selectedTemplate.name}
                                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="template-type" className="block text-sm font-medium text-gray-700">Tipo</label>
                                <select
                                    id="template-type"
                                    value={selectedTemplate.type}
                                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, type: e.target.value as TemplateType })}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                >
                                    {Object.values(TemplateType).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                             <label htmlFor="template-content" className="block text-sm font-medium text-gray-700">Conteúdo do Modelo</label>
                             <textarea
                                id="template-content"
                                value={selectedTemplate.content}
                                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, content: e.target.value })}
                                rows={12}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                                placeholder="Use placeholders como {{nome_paciente}}, {{data_atual}}, etc."
                             />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                            <button type="submit" className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg">Salvar Modelo</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TemplatesTab;