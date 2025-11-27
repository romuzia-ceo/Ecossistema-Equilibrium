
// ===================================================================================
// NOTA DE ARQUITETURA EM PRODUÇÃO
// ===================================================================================
// A lógica aqui simula um backend seguro que orquestra a comunicação entre a API
// do WhatsApp, a IA do Gemini e o banco de dados da clínica. O frontend nunca
// deve conter chaves de API ou lógica de negócios crítica.
// ===================================================================================

interface AgendaResponse {
    responseText: string;
    appointmentBooked: boolean;
}

export const getAgendaResponse = async (
  userInput: string,
  conversationId: string,
  patientName: string
): Promise<AgendaResponse> => {
  try {
    const response = await fetch('/api/ai/agenda-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, conversationId, patientName }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to get agenda response from backend');
    }
    
    const result: AgendaResponse = await response.json();
    // O serviço de clínica é atualizado no backend, mas o frontend precisa
    // ser notificado para recarregar os dados da agenda visual.
    // Em um app real, isso seria feito via WebSocket ou re-fetching.
    // Aqui, retornamos um booleano para o componente da view lidar com a atualização.
    return result;

  } catch (error) {
    console.error("Error fetching agenda response from backend API:", error);
    return {
        responseText: "Desculpe, estou com dificuldades para me conectar ao nosso assistente. Tente novamente em alguns instantes.",
        appointmentBooked: false,
    };
  }
};
