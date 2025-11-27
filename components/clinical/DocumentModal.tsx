import React, { useState, useEffect } from 'react';
import { Template, ClinicalAppointment } from '../../types';
import { saveDocument } from '../../services/documentService';

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: Template | null;
    appointment: ClinicalAppointment | null;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, template, appointment }) => {
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (template && appointment) {
            const parsedContent = template.content
                .replace(/{{nome_paciente}}/g, appointment.patient.name)
                .replace(/{{data_atual}}/g, new Date().toLocaleDateString('pt-BR'))
                .replace(/{{nome_profissional}}/g, appointment.professional.name)
                .replace(/{{role_profissional}}/g, appointment.professional.role);
            setContent(parsedContent);
        }
    }, [template, appointment]);

    if (!isOpen || !template || !appointment) {
        return null;
    }

    const handleSaveAndPrint = async () => {
        if (!template || !appointment || isSaving) return;

        setIsSaving(true);
        try {
            await saveDocument({
                patientId: appointment.patient.id,
                type: template.type,
                title: template.name,
                content: content,
                professionalName: appointment.professional.name,
            });

            // In a real app, this would trigger a more robust printing service
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head><title>${template.name}</title></head>
                        <body><pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${content}</pre></body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        } catch (error) {
            console.error("Falha ao salvar o documento:", error);
            alert("Ocorreu um erro ao salvar o documento. A impressão ainda pode ser possível.");
        } finally {
            setIsSaving(false);
            onClose(); // Close modal after action
        }
    };


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#002C3C]">Gerar {template.type}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <i className="ph-bold ph-x"></i>
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full min-h-[400px] p-4 border border-gray-300 rounded-md font-mono text-sm"
                    />
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">
                        Fechar
                    </button>
                    <button 
                        onClick={handleSaveAndPrint}
                        disabled={isSaving}
                        className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <i className="ph ph-printer"></i>
                                Imprimir e Salvar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentModal;