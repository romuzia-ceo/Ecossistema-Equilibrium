import { GoogleGenAI, Chat } from "@google/genai";
import { Message, Appointment } from '../types';

// ===================================================================================
// NOTA DE ARQUITETURA EM PRODUÇÃO
// ===================================================================================
// Em um sistema real, este serviço NÃO rodaria no frontend. Ele seria parte de um 
// backend seguro (ex: Node.js/NestJS, Laravel) que:
//
// 1.  RECEBE webhooks do WhatsApp (Meta Business API) quando um paciente envia uma mensagem.
// 2.  GERENCIA o histórico da conversa de cada paciente no banco de dados.
// 3.  CHAMA a API do Gemini para obter a resposta do bot, como implementado abaixo.
// 4.  ENVIA a resposta do bot de volta para o paciente usando a API do WhatsApp.
// 5.  ARMAZENA as credenciais (API_KEY do Gemini, Token do WhatsApp) de forma segura.
//
// A implementação atual simula esse comportamento para fins de prototipação no frontend.
// ===================================================================================

let chat: Chat | null = null;

const initializeChat = (ai: GoogleGenAI) => {
    if (!chat) {
        const systemInstruction = `
            Você é um assistente de agendamento amigável e eficiente para a 'Clínica Equilibrium'. Seu nome é EquiBot.
            Seu papel é ajudar pacientes a agendar, remarcar ou cancelar consultas por meio deste chat.
            Você deve ser conversacional, empático e claro.

            Médicos e especialidades disponíveis:
            - Dra. Mari (Cardiologia)
            - Dr. João (Ortopedia)
            - Dra. Ana (Dermatologia)

            Disponibilidade geral: Segunda a Sexta, das 09:00 às 17:00.
            O ano atual é 2025.

            Seu fluxo de conversa deve ser:
            1. Saudar o usuário e perguntar como pode ajudar.
            2. Identificar a intenção do usuário (agendar, remarcar, cancelar).
            3. Se for agendamento, pergunte pela especialidade ou médico desejado.
            4. Em seguida, pergunte pela data e hora preferidas. Peça uma informação de cada vez.
            5. Quando tiver todas as informações necessárias (médico, data e hora), confirme com o paciente. Exemplo: "Perfeito! Só para confirmar, o agendamento é com a Dra. Mari, na quarta-feira, dia 20 de novembro, às 10:00. Correto?"
            6. Se o usuário confirmar, responda com uma mensagem final de confirmação e, em uma nova linha, adicione um JSON com os detalhes do agendamento, formatado como: <JSON>{"doctor": "Nome do Doutor", "specialty": "Especialidade", "date": "YYYY-MM-DD", "time": "HH:MM"}</JSON>. Não adicione markdown no bloco JSON.
            7. Mantenha as respostas curtas e diretas.
        `;
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
        });
    }
    return chat;
};


interface AgendaResponse {
    responseText: string;
    appointmentData?: Omit<Appointment, 'id' | 'patient'>;
}

const getMockResponse = (userInput: string): AgendaResponse => {
    const lowerInput = userInput.toLowerCase();
    if(lowerInput.includes('correto') || lowerInput.includes('sim') || lowerInput.includes('confirmo')) {
        return {
            responseText: "Ótimo! Sua consulta com a Dra. Mari para o dia 20/11/2025 às 15:00 foi agendada com sucesso. Enviaremos um lembrete um dia antes.",
            appointmentData: {
                doctor: 'Dra. Mari',
                specialty: 'Cardiologia',
                date: '2025-11-20',
                time: '15:00'
            }
        }
    }
    return {
        responseText: 'Entendido. E qual seria a data e horário de sua preferência para a consulta com a Dra. Mari?'
    };
};

export const getAgendaResponse = async (
  userInput: string,
  history: Message[] // history é mantido para referência, mas o chat da API gerencia o estado
): Promise<AgendaResponse> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock response for agenda.");
    return new Promise((resolve) => {
        setTimeout(() => resolve(getMockResponse(userInput)), 1000)
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatSession = initializeChat(ai);
    
    const result = await chatSession.sendMessage({ message: userInput });
    let responseText = result.text;
    
    let appointmentData: Omit<Appointment, 'id' | 'patient'> | undefined = undefined;
    
    const jsonRegex = /<JSON>(.*?)<\/JSON>/s;
    const match = responseText.match(jsonRegex);

    if (match && match[1]) {
        try {
            appointmentData = JSON.parse(match[1]);
            responseText = responseText.replace(jsonRegex, '').trim();
        } catch (e) {
            console.error("Failed to parse JSON from bot response:", e);
        }
    }

    return { responseText, appointmentData };

  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    return {
        responseText: "Desculpe, estou com dificuldades para me conectar. Tente novamente em alguns instantes."
    };
  }
};