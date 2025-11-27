import React, { useState, useEffect } from 'react';
import { ClinicalAppointment, ConsultationRecord, Template, TemplateType } from '../../types';
import { getPatientHistory, saveConsultation } from '../../services/clinicalService';
import { getTemplates } from '../../services/managementService';
import DocumentModal from './DocumentModal';
import DiagnosticCopilot from './DiagnosticCopilot';
import VideoConsultationModal from './VideoConsultationModal';


type ClinicalTab = 'current' | 'history' | 'documents';

interface AttendanceAreaProps {
    appointment: ClinicalAppointment | null;
    onFinalize: (appointmentId: string) => void;
}

const TabButton: React.FC<{ label: string; icon: string; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md ${isActive ? 'bg-[#004D5A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
        <i className={`ph-bold ph-${icon} text-lg`}></i>
        {label}
    </button>
);


const AttendanceArea: React.FC<AttendanceAreaProps> = ({ appointment, onFinalize }) => {
    const [activeTab, setActiveTab] = useState<ClinicalTab>('current');
    const [history, setHistory] = useState<ConsultationRecord[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    
    // State for dynamic forms
    const [templates, setTemplates] = useState<Template[]>([]);
    const [clinicalForms, setClinicalForms] = useState<Template[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string>('');
    const [currentFormContent, setCurrentFormContent] = useState('');

    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [modalTemplate, setModalTemplate] = useState<Template | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Load all templates once
    useEffect(() => {
        const loadTemplates = async () => {
            const allTemplates = await getTemplates();
            setTemplates(allTemplates);
            const forms = allTemplates.filter(t => t.type === TemplateType.PRONTUARIO || t.type === TemplateType.ANAMNESE);
            setClinicalForms(forms);
            if (forms.length > 0) {
                 setSelectedFormId(forms[0].id);
            }
        };
        loadTemplates();
    }, []);

    // Effect to update form content when appointment or selected form changes
    useEffect(() => {
        if (appointment && selectedFormId) {
            const selectedTemplate = templates.find(t => t.id === selectedFormId);
            if (selectedTemplate) {
                setCurrentFormContent(
                    selectedTemplate.content
                        .replace(/{{nome_paciente}}/g, appointment.patient.name)
                        .replace(/{{data_atual}}/g, new Date().toLocaleDateString('pt-BR'))
                        .replace(/{{nome_profissional}}/g, appointment.professional.name)
                        .replace(/{{role_profissional}}/g, appointment.professional.role)
                );
            }
        } else {
             setCurrentFormContent('');
             // Reset to default form when appointment is cleared
             if(clinicalForms.length > 0) setSelectedFormId(clinicalForms[0].id);
        }
    }, [appointment, selectedFormId, templates, clinicalForms]);
    
    // Effect to load patient history when tab is active
    useEffect(() => {
        if (appointment && activeTab === 'history') {
            const loadHistory = async () => {
                setIsLoadingHistory(true);
                const data = await getPatientHistory(appointment.patient.id);
                setHistory(data);
                setIsLoadingHistory(false);
            };
            loadHistory();
        }
    }, [appointment, activeTab]);

    if (!appointment) {
        return (
            <div className="bg-white rounded-2xl shadow-md flex flex-col h-full items-center justify-center text-center p-4">
                <i className="ph-bold ph-bed text-6xl text-gray-300 mb-4"></i>
                <h3 className="font-bold text-lg text-[#002C3C]">Nenhum paciente em atendimento</h3>
                <p className="text-gray-500">Selecione um paciente na fila para iniciar o atendimento.</p>
            </div>
        );
    }
    
    const handleSaveToHistory = async () => {
        if (!currentFormContent.trim() || !appointment || isSaving) return;

        setIsSaving(true);
        try {
            const newRecordPayload: Omit<ConsultationRecord, 'id' | 'date'> = {
                professional: appointment.professional,
                serviceName: appointment.service.name,
                content: currentFormContent,
            };

            await saveConsultation(newRecordPayload);
            // Simple feedback for the user
            alert('Anotações salvas no prontuário do paciente.');
        } catch (error) {
            console.error("Falha ao salvar a consulta:", error);
            alert('Ocorreu um erro ao salvar as anotações.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleGenerateDocument = (type: TemplateType.RECEITA | TemplateType.ATESTADO | TemplateType.SOLICITACAO_EXAME) => {
        const template = templates.find(t => t.type === type);
        if (template) {
            setModalTemplate(template);
            setIsDocumentModalOpen(true);
        }
    }

    const patientAge = new Date().getFullYear() - new Date(appointment.patient.birthDate).getFullYear();

    return (
        <div className="bg-white rounded-2xl shadow-md flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <h3 className="text-xl font-bold text-[#002C3C]">{appointment.patient.name}</h3>
                        <p className="text-sm text-gray-500">{patientAge} anos, {appointment.patient.gender}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={() => setIsVideoModalOpen(true)}
                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                        >
                            <i className="ph-bold ph-video-camera"></i>
                            Iniciar Consulta Online
                        </button>
                        <button 
                            onClick={() => onFinalize(appointment.id)}
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
                        >
                             <i className="ph-bold ph-check-circle"></i>
                            Finalizar Atendimento
                        </button>
                    </div>
                </div>
                 <div className="mt-4 flex gap-2 border-b -mb-4 pb-0">
                    <TabButton label="Atendimento Atual" icon="first-aid" isActive={activeTab === 'current'} onClick={() => setActiveTab('current')} />
                    <TabButton label="Gerar Documentos" icon="files" isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                    <TabButton label="Histórico" icon="archive" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                </div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto bg-gray-50/50 scrollbar-hide">
                {activeTab === 'current' && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-320px)]">
                        <div className="lg:col-span-3 flex flex-col">
                            <div className="flex items-center justify-between gap-4 mb-4 flex-shrink-0">
                                 <div className="flex items-center gap-2">
                                    <label htmlFor="form-selector" className="font-semibold text-md text-[#004D5A] whitespace-nowrap">Carregar:</label>
                                     <select
                                        id="form-selector"
                                        value={selectedFormId}
                                        onChange={(e) => setSelectedFormId(e.target.value)}
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75] block p-2"
                                     >
                                        {clinicalForms.map(form => (
                                            <option key={form.id} value={form.id}>{form.name}</option>
                                        ))}
                                     </select>
                                 </div>
                                 <button
                                    onClick={handleSaveToHistory}
                                    disabled={isSaving || !currentFormContent.trim()}
                                    className="bg-[#1B7C75] hover:bg-[#004D5A] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ph-bold ph-floppy-disk"></i>
                                            Salvar no Prontuário
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                value={currentFormContent}
                                onChange={(e) => setCurrentFormContent(e.target.value)}
                                className="w-full flex-grow p-4 border border-gray-300 rounded-md font-mono text-sm leading-relaxed"
                                placeholder="Insira as anotações do paciente aqui. Detalhe queixas, histórico, exame físico, etc."
                            />
                        </div>
                        <div className="lg:col-span-2 flex flex-col">
                            <DiagnosticCopilot notes={currentFormContent} />
                        </div>
                    </div>
                )}
                {activeTab === 'documents' && (
                    <div>
                        <h4 className="font-bold text-lg text-[#004D5A] mb-4">Gerar Documentos para {appointment.patient.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <button onClick={() => handleGenerateDocument(TemplateType.RECEITA)} className="p-6 bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 text-center font-semibold">
                                <i className="ph-bold ph-prescription text-3xl mb-2"></i><br/>
                                Gerar Receita
                            </button>
                            <button onClick={() => handleGenerateDocument(TemplateType.ATESTADO)} className="p-6 bg-teal-50 text-teal-800 rounded-lg hover:bg-teal-100 text-center font-semibold">
                                <i className="ph-bold ph-file-text text-3xl mb-2"></i><br/>
                                Gerar Atestado
                            </button>
                            <button onClick={() => handleGenerateDocument(TemplateType.SOLICITACAO_EXAME)} className="p-6 bg-purple-50 text-purple-800 rounded-lg hover:bg-purple-100 text-center font-semibold">
                                <i className="ph-bold ph-test-tube text-3xl mb-2"></i><br/>
                                Solicitar Exames
                            </button>
                        </div>
                    </div>
                )}
                {activeTab === 'history' && (
                    <div>
                        <h4 className="font-bold text-lg text-[#004D5A] mb-4">Histórico de Consultas</h4>
                        {isLoadingHistory ? <p>Carregando histórico...</p> : (
                            <div className="space-y-4">
                                {history.length > 0 ? history.map(record => (
                                    <div key={record.id} className="p-4 border rounded-lg bg-white">
                                        <p className="font-bold">{record.serviceName} - {new Date(record.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                        <p className="text-sm text-gray-600">Com {record.professional.name}</p>
                                        <details className="mt-2 text-sm">
                                            <summary className="cursor-pointer font-semibold">Ver detalhes</summary>
                                            <pre className="mt-2 p-2 bg-gray-50 rounded font-mono text-xs whitespace-pre-wrap">
                                                {record.content 
                                                    ? record.content 
                                                    : `S: ${record.soap_S || 'N/A'}\nO: ${record.soap_O || 'N/A'}\nA: ${record.soap_A || 'N/A'}\nP: ${record.soap_P || 'N/A'}`
                                                }
                                            </pre>
                                        </details>
                                    </div>
                                )) : <p>Nenhum registro encontrado no histórico do paciente.</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
             <DocumentModal 
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                template={modalTemplate}
                appointment={appointment}
            />
             <VideoConsultationModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                patientName={appointment.patient.name}
            />
        </div>
    );
};

export default AttendanceArea;