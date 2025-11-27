import { MOCK_GENERATED_DOCUMENTS } from '../constants';
import { GeneratedDocument } from '../types';

// ===================================================================================
// SERVIÇO DE DOCUMENTOS (SIMULAÇÃO DE BACKEND)
// ===================================================================================

let documentsData: GeneratedDocument[] = JSON.parse(JSON.stringify(MOCK_GENERATED_DOCUMENTS));

export const getDocumentsByPatientId = async (patientId: string): Promise<GeneratedDocument[]> => {
    return new Promise(resolve => setTimeout(() => resolve(
        [...documentsData]
            .filter(doc => doc.patientId === patientId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    ), 300));
};

export const saveDocument = async (doc: Omit<GeneratedDocument, 'id' | 'createdAt'>): Promise<GeneratedDocument> => {
    return new Promise(resolve => {
        const newDocument: GeneratedDocument = {
            ...doc,
            id: `doc-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
        };
        console.log("Salvando novo documento:", newDocument);
        documentsData.push(newDocument);
        resolve(newDocument);
    });
};
