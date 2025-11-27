


import { Request, Response } from 'express';
import db from '../database';
import { CostCenterCategory, FullTransaction, FinancialRecord, ChartData } from '../../../types';

// Helper to get date ranges
const getDateRanges = (rangeKey: string): { currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date } => {
    const now = new Date('2025-11-20T23:59:59Z'); // Use a fixed "today" for consistent results
    let currentStart: Date;
    let currentEnd: Date = now;
    let previousStart: Date;
    let previousEnd: Date;

    switch (rangeKey) {
        case 'last7':
            currentStart = new Date(now);
            currentStart.setDate(now.getDate() - 7);
            previousEnd = new Date(currentStart);
            previousEnd.setDate(previousEnd.getDate() - 1);
            previousStart = new Date(previousEnd);
            previousStart.setDate(previousEnd.getDate() - 7);
            break;
        case 'this_month':
            currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            previousStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
            previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case 'this_year':
            currentStart = new Date(now.getFullYear(), 0, 1);
            previousStart = new Date(now.getFullYear() - 1, 0, 1);
            previousEnd = new Date(now.getFullYear() - 1, 11, 31);
            break;
        case 'last30':
        default:
            currentStart = new Date(now);
            currentStart.setDate(now.getDate() - 30);
            previousEnd = new Date(currentStart);
            previousEnd.setDate(previousEnd.getDate() - 1);
            previousStart = new Date(previousEnd);
            previousStart.setDate(previousEnd.getDate() - 30);
            break;
    }

    return { currentStart, currentEnd, previousStart, previousEnd };
};

const aggregateData = (transactions: FullTransaction[], category: CostCenterCategory): Record<string, { revenue: number, costs: number }> => {
    const aggregation: Record<string, { revenue: number, costs: number }> = {};
    
    transactions.forEach(txn => {
        let key: string | null = null;
        if (category === CostCenterCategory.SPECIALTY) {
            key = txn.professionalRole;
        } else if (category === CostCenterCategory.DOCTOR) {
            key = txn.professionalName;
        } else if (category === CostCenterCategory.UNIT) {
            key = 'Unidade São Roque'; // Mocked as single unit
        }
        
        if (key) {
            if (!aggregation[key]) {
                aggregation[key] = { revenue: 0, costs: 0 }; 
            }
            aggregation[key].revenue += txn.amount;
            // Simple cost simulation: 50% of revenue
            aggregation[key].costs = aggregation[key].revenue * 0.5; 
        }
    });
    return aggregation;
};

const calculateKpis = (data: Record<string, { revenue: number, costs: number }>) => {
    return Object.values(data).reduce((acc, item) => {
        acc.totalRevenue += item.revenue;
        acc.totalCosts += item.costs;
        return acc;
    }, { totalRevenue: 0, totalCosts: 0 });
};

const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

export const getDashboardData = async (req: Request, res: Response) => {
    const { category, range } = req.query;

    if (!category || typeof category !== 'string' || !Object.values(CostCenterCategory).includes(category as CostCenterCategory)) {
        return res.status(400).json({ message: 'Category parameter is invalid or required.' });
    }
    if (!range || typeof range !== 'string') {
        return res.status(400).json({ message: 'Range parameter is required.' });
    }
    
    try {
        const allTransactions = await db.getTransactions();
        const { currentStart, currentEnd, previousStart, previousEnd } = getDateRanges(range);
        
        const currentTransactions = allTransactions.filter(t => new Date(t.date) >= currentStart && new Date(t.date) <= currentEnd);
        const previousTransactions = allTransactions.filter(t => new Date(t.date) >= previousStart && new Date(t.date) <= previousEnd);

        const currentAggregated = aggregateData(currentTransactions, category as CostCenterCategory);
        const previousAggregated = aggregateData(previousTransactions, category as CostCenterCategory);

        const currentKpis = calculateKpis(currentAggregated);
        const previousKpis = calculateKpis(previousAggregated);
        
        const finalKpis = {
            totalRevenue: currentKpis.totalRevenue,
            totalCosts: currentKpis.totalCosts,
            netProfit: currentKpis.totalRevenue - currentKpis.totalCosts,
            totalRevenueChange: calculateChange(currentKpis.totalRevenue, previousKpis.totalRevenue),
            totalCostsChange: calculateChange(currentKpis.totalCosts, previousKpis.totalCosts),
            netProfitChange: calculateChange(
                currentKpis.totalRevenue - currentKpis.totalCosts, 
                previousKpis.totalRevenue - previousKpis.totalCosts
            ),
        };

        const tableData: FinancialRecord[] = Object.entries(currentAggregated).map(([name, values]) => ({
            id: `fin-${name}`,
            name,
            category: category as CostCenterCategory,
            ...values
        }));

        const chartData: ChartData[] = tableData.map(item => ({
            name: item.name,
            receita: item.revenue,
            custos: item.costs,
            lucro: item.revenue - item.costs
        }));

        res.status(200).json({ 
            kpis: finalKpis, 
            chartData, 
            tableData,
            dateRange: { start: currentStart.toLocaleDateString('pt-BR'), end: currentEnd.toLocaleDateString('pt-BR') }
        });

    } catch (error) {
        console.error('Error fetching finance dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};