
import { MarketingMetrics } from "../types";

export const getMarketingPlan = async (
  metrics: MarketingMetrics,
): Promise<string> => {
  try {
    const response = await fetch('/api/ai/marketing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch marketing plan');
    }
    const result = await response.json();
    return result.plan;
  } catch (error) {
    console.error("Error fetching marketing plan from backend API:", error);
    return "Ocorreu um erro ao buscar o plano de marketing da IA.";
  }
};


export const getSocialMediaPostsForCampaign = async (campaignName: string): Promise<string> => {
    try {
        const response = await fetch('/api/ai/social-media-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaignName }),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Failed to fetch social media plan');
        }
        const result = await response.json();
        return result.posts;
    } catch (error) {
        console.error("Error fetching social media plan from backend API:", error);
        return "Ocorreu um erro ao buscar o plano de redes sociais da IA.";
    }
};
