

export const getDiagnosticAssistance = async (
  clinicalNotes: string,
): Promise<string> => {
  if (!clinicalNotes.trim()) {
      return "Por favor, insira as anotações clínicas antes de solicitar a análise.";
  }

  try {
    const response = await fetch('/api/ai/clinical-copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clinicalNotes }),
    });
    
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch diagnostic assistance from backend');
    }

    const result = await response.json();
    return result.analysis;
    
  } catch (error) {
    console.error("Error fetching diagnostic assistance from backend API:", error);
    return "Ocorreu um erro ao buscar a análise da IA. Verifique a conexão com o servidor e tente novamente.";
  }
};
