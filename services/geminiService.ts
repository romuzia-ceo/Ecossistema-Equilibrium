
import { GoogleGenAI } from "@google/genai";
import { FinancialRecord } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const getMockResponse = (data: FinancialRecord[], category: string) => `
### Análise e Projeção (Mock)

**Análise dos Dados Atuais:**
Com base nos dados fornecidos para **${category}**, observa-se que a entidade com maior lucratividade é **"${data.sort((a,b) => (b.revenue - b.costs) - (a.revenue - a.costs))[0].name}"**, destacando-se pela excelente relação entre receita e custo. Em contrapartida, **"${data.sort((a,b) => (a.revenue - a.costs) - (b.revenue - b.costs))[0].name}"** apresenta a menor margem, sugerindo uma análise mais aprofundada de seus custos operacionais.

**Projeção e Recomendações:**
- **Oportunidade:** Existe um potencial de crescimento ao replicar as estratégias de controle de custos da entidade de maior performance nas demais.
- **Ação Sugerida:** Recomenda-se uma revisão dos processos da entidade de menor margem para identificar possíveis otimizações e reduções de despesas.

*Esta é uma resposta simulada. Configure a API_KEY para obter análises reais.*
`;

export const getFinancialInsights = async (
  data: FinancialRecord[],
  category: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(getMockResponse(data, category)), 1500)
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dataSummary = data
      .map(
        (d) =>
          `- ${d.name}: Receita R$${d.revenue.toFixed(2)}, Custos R$${d.costs.toFixed(2)}, Lucro R$${(d.revenue - d.costs).toFixed(2)}`
      )
      .join('\n');

    const prompt = `
      Você é um "Copiloto Financeiro" especialista em análise de dados para clínicas médicas. 
      Seu nome é Equilibrium AI. Analise os seguintes dados de centros de custo para a categoria "${category}":
      
      ${dataSummary}
      
      Com base nesses dados, forneça uma análise concisa em markdown, destacando:
      1.  **Análise dos Dados Atuais:** Identifique o item de maior e menor lucratividade e comente brevemente sobre eles.
      2.  **Projeção e Recomendações:** Ofereça uma projeção ou sugestão de ação para otimizar os resultados, como por exemplo, sugerir ajustes de preço, cortes de custo, ou metas.
      
      Seja direto, profissional e focado em insights acionáveis. Não inclua saudações.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching insights from Gemini API:", error);
    return "Ocorreu um erro ao buscar a análise da IA. Verifique sua chave de API e tente novamente.";
  }
};
