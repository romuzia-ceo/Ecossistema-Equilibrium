

import db from '../database';
import { FinancialRecord, MarketingMetrics } from '../../../types';

// This file centralizes all calls to the Gemini API, now running securely on the backend.

// Use a memoized promise to ensure the AI client and module are initialized only once.
let aiPromise: Promise<{ ai: any; genaiModule: any }> | null = null;

const getInitializedAI = (): Promise<{ ai: any; genaiModule: any }> => {
    if (!aiPromise) {
        aiPromise = (async () => {
            if (!process.env.API_KEY) {
                console.error("API_KEY environment variable not set!");
                throw new Error("API_KEY environment variable not set!");
            }
            // Dynamically import the module only when it's first needed.
            const genaiModule = await import("@google/genai");
            const ai = new genaiModule.GoogleGenAI({ apiKey: process.env.API_KEY });
            return { ai, genaiModule };
        })();
    }
    return aiPromise;
};


const chatSessions: { [key: string]: any } = {};


// ==========================================================
// FINANCE COPILOT
// ==========================================================
export const getFinancialInsights = async (data: FinancialRecord[], category: string, dateRange: { start: string, end: string }): Promise<string> => {
    const { ai } = await getInitializedAI();
    const dataSummary = data.map(d => `- ${d.name}: Receita R$${d.revenue.toFixed(2)}, Custos R$${d.costs.toFixed(2)}, Lucro R$${(d.revenue - d.costs).toFixed(2)}`).join('\n');
    const prompt = `
      Você é um "Copiloto Financeiro" especialista em análise de dados para clínicas.
      Analise os seguintes dados de centros de custo para a categoria "${category}" no período de ${dateRange.start} a ${dateRange.end}:
      
      ${dataSummary}
      
      Com base nesses dados, forneça uma análise concisa em markdown destacando:
      1.  **Análise dos Dados Atuais:** Identifique o item de maior e menor lucratividade no período e comente brevemente sobre eles.
      2.  **Projeção e Recomendações:** Ofereça uma projeção ou sugestão de ação para otimizar os resultados, como por exemplo, sugerir ajustes de preço, cortes de custo, ou metas.
      
      Seja direto, profissional e focado em insights acionáveis. Não inclua saudações.
    `;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

// ==========================================================
// MARKETING COPILOT
// ==========================================================
export const getMarketingPlan = async (metrics: MarketingMetrics): Promise<string> => {
    const { ai } = await getInitializedAI();
    const prompt = `Você é um "Copiloto de Marketing" especialista em clínicas. Analise os dados:
- Profissional mais procurado: ${metrics.topProfessional.name}
- Serviço mais procurado: ${metrics.topService.name}
- Satisfação: ${metrics.satisfactionRate}%
Gere um plano de ação em markdown com: 1. Análise da Situação, 2. Plano de Ação, 3. Ideias para Redes Sociais (mencione o Canva), 4. Otimização de SEO (Google). Termine com o aviso legal padrão.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
    return response.text;
};

export const getSocialMediaPostsForCampaign = async (campaignName: string): Promise<string> => {
    const { ai } = await getInitializedAI();
    const prompt = `Você é um "Copiloto de Marketing". Crie um mini-plano de conteúdo em markdown para a campanha "${campaignName}". Dê 2 ideias de post (Carrossel e Vídeo Curto), descrevendo visual, texto e legenda. Mencione o uso do Canva para o design.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
    return response.text;
}

// ==========================================================
// CLINICAL COPILOT
// ==========================================================
export const getDiagnosticAssistance = async (clinicalNotes: string): Promise<string> => {
    const { ai } = await getInitializedAI();
    const prompt = `Você é um assistente de IA para suporte à decisão clínica. Analise as anotações: "${clinicalNotes}". Gere uma resposta em markdown com: 1. **Hipóteses Diagnósticas Sugeridas:** (2-4 hipóteses com justificativa breve), 2. **Sugestões de Aprofundamento:** (Perguntas Adicionais e Exames Complementares). Inicie com "### Análise de Co-piloto IA" e termine com o aviso legal em itálico.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
    return response.text;
};

// ==========================================================
// AGENDA COPILOT (with Function Calling)
// ==========================================================

// Dummy implementations of tool functions that would query the DB
const getProfessionalAvailabilityDB = async (professionalName: string, date: string) => {
    const professionals = await db.getProfessionals();
    const professional = professionals.find(p => p.name.toLowerCase().includes(professionalName.toLowerCase()));

    if (!professional) {
        return [];
    }
    const schedule = professional.schedule;
    const daySchedule = schedule[date];
    if (!daySchedule) {
        return [];
    }
    return daySchedule.filter((slot: any) => !slot.patient).map((slot: any) => slot.time);
};

const bookAppointmentDB = async (professionalName: string, date: string, time: string, patientName: string) => {
    console.log(`Booking for ${patientName} with ${professionalName} on ${date} at ${time}`);
    // This would perform a database update in a real application.
    return true;
};


const getOrCreateChatSession = async (conversationId: string): Promise<any> => {
    if (chatSessions[conversationId]) {
        return chatSessions[conversationId];
    }
    const { ai, genaiModule } = await getInitializedAI();
    // Get the Type enum from the dynamically loaded module
    const { Type } = genaiModule; 
    
    const systemInstruction = `Você é a "Mari" 🌿, a assistente virtual da Clínica Equilíbrium. Sua personalidade é amigável e acolhedora. Use emojis como 🌿 e 💚. Seu objetivo é ajudar pacientes a agendar consultas e obter informações sobre os serviços da clínica (Psicologia e Neuropsicologia com Dra. Gisele e Dra. Juliana). Use as ferramentas para verificar horários, preços ou agendar. O ano atual é 2025. Hoje é 20 de Novembro de 2025.`;
    
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
            tools: [{ functionDeclarations: [
                {
                    name: 'getProfessionalAvailability',
                    description: 'Consulta os horários de consulta disponíveis para um profissional de saúde específico em uma data específica.',
                    parameters: { type: Type.OBJECT, properties: { professionalName: { type: Type.STRING }, date: { type: Type.STRING } }, required: ['professionalName', 'date'] },
                },
                {
                    name: 'bookAppointment',
                    description: 'Agenda (confirma) um horário de consulta para um paciente com um profissional em uma data e hora específicas.',
                    parameters: { type: Type.OBJECT, properties: { professionalName: { type: Type.STRING }, date: { type: Type.STRING }, time: { type: Type.STRING } }, required: ['professionalName', 'date', 'time'] },
                }
            ] }],
        },
    });

    chatSessions[conversationId] = chat;
    return chat;
};

export const getAgendaResponse = async (userInput: string, conversationId: string, patientName: string) => {
    const chatSession = await getOrCreateChatSession(conversationId);
    let modelResponse = await chatSession.sendMessage({ message: userInput });

    let appointmentBooked = false;
    let functionCalls = modelResponse.functionCalls; // Corrected: property, not function call

    while (functionCalls && functionCalls.length > 0) {
        const functionResponses = [];
        for (const fc of functionCalls) {
            let result: any;
            switch (fc.name) {
                case 'getProfessionalAvailability':
                    result = await getProfessionalAvailabilityDB(fc.args.professionalName, fc.args.date);
                    break;
                case 'bookAppointment':
                    result = await bookAppointmentDB(fc.args.professionalName, fc.args.date, fc.args.time, patientName);
                    if (result === true) appointmentBooked = true;
                    break;
                default:
                    result = { error: 'Função desconhecida.' };
            }
            functionResponses.push({ id: fc.id, name: fc.name, response: { result } });
        }

        modelResponse = await chatSession.sendMessage({ toolResponse: { functionResponses } });
        functionCalls = modelResponse.functionCalls; // Corrected: property, not function call
    }
    
    return { responseText: modelResponse.text, appointmentBooked };
};
