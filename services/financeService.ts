
import { CostCenterCategory, ChartData, FinancialRecord, CashFlowPoint, PayableStatus, FullTransaction, PaymentMethod } from '../types';
import { getPayables } from './payableService';
import { MOCK_SERVICES, MOCK_PROFESSIONALS, MOCK_PATIENTS, MOCK_INSURANCE_PLANS } from '../constants';

export interface DynamicFinancials {
    kpis: {
        totalRevenue: number;
        totalCosts: number;
        netProfit: number;
        totalRevenueChange: number;
        totalCostsChange: number;
        netProfitChange: number;
    };
    chartData: ChartData[];
    tableData: FinancialRecord[];
    dateRange: {
        start: string;
        end: string;
    }
}

// =======================================================================
// LOCAL MOCK DATA GENERATION (Fallback for Client-Side Mode)
// =======================================================================

const generateFallbackTransactions = (): FullTransaction[] => {
    const transactions: FullTransaction[] = [];
    const today = new Date();
    // Generate 60 days of history
    for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // 2-4 transactions per day
        const numTransactions = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < numTransactions; j++) {
            const professional = MOCK_PROFESSIONALS[Math.floor(Math.random() * MOCK_PROFESSIONALS.length)];
            const service = MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)];
            const patient = MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)];
            
            const useInsurance = patient.insurancePlanId && Math.random() > 0.5;
            const plan = useInsurance ? MOCK_INSURANCE_PLANS.find(p => p.id === patient.insurancePlanId) : null;
            
            let amount = service.price;
            if (plan && plan.priceTable[service.id]) {
                amount = plan.priceTable[service.id];
            }

            const transaction: FullTransaction = {
                id: `txn-${date.getTime()}-${j}`,
                appointmentId: `app-hist-${date.getTime()}-${j}`,
                patientId: patient.id,
                serviceId: service.id,
                amount: amount * (0.9 + Math.random() * 0.2), 
                paymentMethod: Math.random() > 0.5 ? PaymentMethod.CARD : PaymentMethod.CASH,
                date: date.toISOString(),
                professionalName: professional.name,
                professionalRole: professional.role.includes('Neuro') ? 'Neuropsicologia' : 'Psicologia',
                serviceName: service.name,
            };
            transactions.push(transaction);
        }
    }
    return transactions;
};

const getLocalDateRanges = (rangeKey: string) => {
    const now = new Date(); 
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

const aggregateLocalData = (transactions: FullTransaction[], category: CostCenterCategory): Record<string, { revenue: number, costs: number }> => {
    const aggregation: Record<string, { revenue: number, costs: number }> = {};
    transactions.forEach(txn => {
        let key: string | null = null;
        if (category === CostCenterCategory.SPECIALTY) key = txn.professionalRole;
        else if (category === CostCenterCategory.DOCTOR) key = txn.professionalName;
        else if (category === CostCenterCategory.UNIT) key = 'Unidade São Roque';
        
        if (key) {
            if (!aggregation[key]) aggregation[key] = { revenue: 0, costs: 0 }; 
            aggregation[key].revenue += txn.amount;
            aggregation[key].costs = aggregation[key].revenue * 0.5; // Simple 50% cost assumption
        }
    });
    return aggregation;
};

const generateMockDashboardData = (category: CostCenterCategory, dateRangeKey: string): DynamicFinancials => {
    const allTransactions = generateFallbackTransactions();
    const { currentStart, currentEnd, previousStart, previousEnd } = getLocalDateRanges(dateRangeKey);
    
    const currentTransactions = allTransactions.filter(t => new Date(t.date) >= currentStart && new Date(t.date) <= currentEnd);
    const previousTransactions = allTransactions.filter(t => new Date(t.date) >= previousStart && new Date(t.date) <= previousEnd);

    const currentAggregated = aggregateLocalData(currentTransactions, category);
    const previousAggregated = aggregateLocalData(previousTransactions, category);

    const calcKpis = (data: Record<string, { revenue: number, costs: number }>) => 
        Object.values(data).reduce((acc, item) => ({ 
            totalRevenue: acc.totalRevenue + item.revenue, 
            totalCosts: acc.totalCosts + item.costs 
        }), { totalRevenue: 0, totalCosts: 0 });

    const currentKpis = calcKpis(currentAggregated);
    const previousKpis = calcKpis(previousAggregated);
    
    const calculateChange = (curr: number, prev: number) => prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

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
        category,
        ...values
    }));

    const chartData: ChartData[] = tableData.map(item => ({
        name: item.name,
        receita: item.revenue,
        custos: item.costs,
        lucro: item.revenue - item.costs
    }));

    return { 
        kpis: finalKpis, 
        chartData, 
        tableData,
        dateRange: { start: currentStart.toLocaleDateString('pt-BR'), end: currentEnd.toLocaleDateString('pt-BR') }
    };
};

// =======================================================================
// MAIN SERVICE FUNCTIONS
// =======================================================================

export const getFinancialDashboardData = async (category: CostCenterCategory, dateRangeKey: string): Promise<DynamicFinancials> => {
    try {
        const response = await fetch(`/api/finance/dashboard?category=${encodeURIComponent(category)}&range=${dateRangeKey}`);
        
        if (!response.ok) {
            console.warn(`API Error (${response.status}). Switching to local mock data.`);
            return generateMockDashboardData(category, dateRangeKey);
        }
        
        const responseText = await response.text();
        try {
            return JSON.parse(responseText);
        } catch (parseError) {
             console.error("Error parsing JSON response, using fallback:", parseError);
             return generateMockDashboardData(category, dateRangeKey);
        }

    } catch (error) {
        console.warn("Backend API unavailable (Network Error), using local mock data.", error);
        return generateMockDashboardData(category, dateRangeKey);
    }
};

export const getCashFlowProjection = async (daysToProject: number = 30): Promise<CashFlowPoint[]> => {
    // 1. Get Payables (Mock Future Expenses)
    const payables = await getPayables();
    
    // 2. Mock Future Appointments (Projected Revenue)
    // In a real app, this would query 'appointments where date >= today'
    // For the demo, we will generate some synthetic future income based on MOCK_SERVICES
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const dailyData: Record<string, { expense: number, income: number }> = {};
    
    // Initialize dates
    for (let i = 0; i <= daysToProject; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dailyData[dateStr] = { expense: 0, income: 0 };
    }

    // Map Payables to Dates
    payables.forEach(p => {
        const dateStr = p.dueDate;
        if (p.status !== PayableStatus.PAID && dailyData[dateStr]) {
            dailyData[dateStr].expense += p.amount;
        }
    });

    // Generate/Map Projected Income
    // We simulate 2-3 appointments per day with random service prices
    Object.keys(dailyData).forEach(dateStr => {
        // Skip weekends for appointments
        const date = new Date(dateStr);
        const day = date.getDay();
        if (day !== 0 && day !== 6) {
            const numAppointments = Math.floor(Math.random() * 3) + 1; 
            for (let k = 0; k < numAppointments; k++) {
                 const service = MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)];
                 dailyData[dateStr].income += service.price;
            }
        }
    });

    // 3. Calculate Running Balance
    // Start with a mock current balance
    let currentBalance = 12500.00; 
    
    const projection: CashFlowPoint[] = [];

    Object.keys(dailyData).sort().forEach(dateStr => {
        const dayData = dailyData[dateStr];
        currentBalance = currentBalance + dayData.income - dayData.expense;
        
        projection.push({
            date: dateStr,
            dateLabel: new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            projectedIncome: dayData.income,
            projectedExpense: dayData.expense,
            accumulatedBalance: currentBalance
        });
    });

    return projection;
};
