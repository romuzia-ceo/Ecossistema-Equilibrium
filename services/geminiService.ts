

import { GoogleGenAI } from "@google/genai";
import { FinancialRecord } from '../types';

interface DateRange {
  start: string;
  end: string;
}

export const getFinancialInsights = async (
  data: FinancialRecord[],
  category: string,
  dateRange: DateRange,
): Promise<string> => {
  const requestBody = {
    data,
    category,
    dateRange,
  };

  try {
    const response = await fetch('/api/ai/finance-copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch financial insights from backend');
    }
    
    const result = await response.json();
    return result.insight;

  } catch (error) {
    console.error("Error fetching insights from backend API:", error);
    return "Ocorreu um erro ao buscar a análise da IA. Verifique a conexão com o servidor e tente novamente.";
  }
};