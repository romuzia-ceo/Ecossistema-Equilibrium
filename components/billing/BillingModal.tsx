import React, { useState, useEffect } from 'react';
import { ClinicalAppointment, HealthInsurancePlan, PaymentMethod } from '../../types';
import { getInsurancePlans } from '../../services/managementService';
import { createTransaction } from '../../services/billingService';

interface BillingModalProps {
    appointment: ClinicalAppointment;
    onClose: () => void;
    onSuccess: () => void;
}

const BillingModal: React.FC<BillingModalProps> = ({ appointment, onClose, onSuccess }) => {
    const [insurancePlans, setInsurancePlans] = useState<HealthInsurancePlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    useEffect(() => {
        const loadPlans = async () => {
            setIsLoading(true);
            const plans = await getInsurancePlans();
            setInsurancePlans(plans);
            setIsLoading(false);
        };
        loadPlans();
    }, []);

    const getBillingInfo = () => {
        const { patient, service } = appointment;
        const patientPlan = insurancePlans.find(plan => plan.id === patient.insurancePlanId);
        
        if (patientPlan && patientPlan.priceTable[service.id]) {
            return {
                amount: patientPlan.priceTable[service.id],
                payer: patientPlan.name,
                isInsurance: true,
            };
        }
        
        return {
            amount: service.price,
            payer: 'Particular',
            isInsurance: false,
        };
    };

    const handlePayment = async (method: PaymentMethod) => {
        setIsProcessing(true);
        try {
            const { amount } = getBillingInfo();
            await createTransaction(
                appointment.id,
                appointment.patient.id,
                appointment.service.id,
                amount,
                method
            );
            // Simulate API processing time
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSuccess();
        } catch (error) {
            console.error("Payment processing failed:", error);
            alert("Ocorreu um erro ao processar o pagamento.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    const { amount, payer, isInsurance } = getBillingInfo();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={isProcessing ? undefined : onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-[#002C3C]">Faturamento do Atendimento</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Paciente</p>
                        <p className="font-semibold text-gray-800">{appointment.patient.name}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Serviço</p>
                        <p className="font-semibold text-gray-800">{appointment.service.name}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Responsável Financeiro</p>
                        <p className="font-semibold text-gray-800">{payer}</p>
                    </div>
                    <div className="text-center bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Valor a ser cobrado</p>
                        <p className="text-4xl font-bold text-[#1B7C75]">{amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        {isInsurance && <p className="text-xs text-gray-500 mt-1">Valor conforme tabela do convênio</p>}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                    <button 
                        onClick={() => handlePayment(PaymentMethod.CASH)}
                        disabled={isProcessing}
                        className="bg-green-100 text-green-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-200 disabled:opacity-50"
                    >
                         <i className="ph ph-money"></i>
                        Registrar Pagamento (Dinheiro/Outro)
                    </button>
                    <button 
                        onClick={() => handlePayment(PaymentMethod.CARD)}
                        disabled={isProcessing}
                        className="bg-[#1B7C75] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#004D5A] disabled:bg-gray-400"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processando...
                            </>
                        ) : (
                             <>
                                <i className="ph ph-credit-card"></i>
                                Pagar com Cartão (Simulado)
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingModal;
