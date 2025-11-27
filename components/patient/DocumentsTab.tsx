import React, { useState } from 'react';
import { GeneratedDocument } from '../../types';

interface DocumentsTabProps {
    documents: GeneratedDocument[];
}

const DocumentViewerModal: React.FC<{ document: GeneratedDocument; onClose: () => void; }> = ({ document, onClose }) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head><title>${document.title}</title></head>
                    <body><pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${document.content}</pre></body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#002C3C]">{document.title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><i className="ph-bold ph-x"></i></button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">{document.content}</pre>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Fechar</button>
                    <button onClick={handlePrint} className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                        <i className="ph ph-printer"></i>Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => {
    const [viewingDocument, setViewingDocument] = useState<GeneratedDocument | null>(null);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-[#002C3C] mb-4">Meus Documentos</h3>
            {documents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-[#004D5A] uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Data de Emissão</th>
                                <th className="px-4 py-3">Documento</th>
                                <th className="px-4 py-3">Profissional</th>
                                <th className="px-4 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{new Date(doc.createdAt).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{doc.title}</td>
                                    <td className="px-4 py-3">{doc.professionalName}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => setViewingDocument(doc)} className="font-medium text-[#1B7C75] hover:underline">
                                            Visualizar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">Nenhum documento encontrado.</p>
            )}

            {viewingDocument && (
                <DocumentViewerModal document={viewingDocument} onClose={() => setViewingDocument(null)} />
            )}
        </div>
    );
};

export default DocumentsTab;