import { CostCenterCategory, FinancialRecord, Appointment, WhatsAppConversation } from './types';

export const MOCK_FINANCIAL_DATA: FinancialRecord[] = [
  // Specialties
  { id: 'spec-1', name: 'Cardiologia', category: CostCenterCategory.SPECIALTY, revenue: 120000, costs: 75000 },
  { id: 'spec-2', name: 'Dermatologia', category: CostCenterCategory.SPECIALTY, revenue: 95000, costs: 40000 },
  { id: 'spec-3', name: 'Ortopedia', category: CostCenterCategory.SPECIALTY, revenue: 150000, costs: 90000 },
  { id: 'spec-4', name: 'Pediatria', category: CostCenterCategory.SPECIALTY, revenue: 80000, costs: 55000 },
  { id: 'spec-5', name: 'Psiquiatria', category: CostCenterCategory.SPECIALTY, revenue: 110000, costs: 50000 },

  // Units
  { id: 'unit-1', name: 'Unidade Central', category: CostCenterCategory.UNIT, revenue: 250000, costs: 150000 },
  { id: 'unit-2', name: 'Unidade Sul', category: CostCenterCategory.UNIT, revenue: 180000, costs: 110000 },
  { id: 'unit-3', name: 'Unidade Norte', category: CostCenterCategory.UNIT, revenue: 125000, costs: 80000 },

  // Doctors
  { id: 'doc-1', name: 'Dra. Mari', category: CostCenterCategory.DOCTOR, revenue: 90000, costs: 45000 },
  { id: 'doc-2', name: 'Dr. João', category: CostCenterCategory.DOCTOR, revenue: 75000, costs: 40000 },
  { id: 'doc-3', name: 'Dra. Ana', category: CostCenterCategory.DOCTOR, revenue: 82000, costs: 38000 },
  { id: 'doc-4', name: 'Dr. Carlos', category: CostCenterCategory.DOCTOR, revenue: 110000, costs: 60000 },
  { id: 'doc-5', name: 'Dra. Sofia', category: CostCenterCategory.DOCTOR, revenue: 98000, costs: 52000 },
];


export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt-1', doctor: 'Dra. Mari', specialty: 'Cardiologia', patient: 'Carlos Silva', time: '10:00', date: '2025-11-20' },
    { id: 'appt-2', doctor: 'Dr. João', specialty: 'Ortopedia', patient: 'Fernanda Lima', time: '14:30', date: '2025-11-21' },
    { id: 'appt-3', doctor: 'Dra. Ana', specialty: 'Dermatologia', patient: 'Roberto Alves', time: '11:00', date: '2025-11-20' },
];

export const MOCK_CONVERSATIONS: WhatsAppConversation[] = [
    {
        id: 'convo-1',
        patientName: 'Diego (Paciente)',
        patientPhone: '+55 11 98765-4321',
        lastMessageTimestamp: '10:45',
        lastMessageSnippet: 'Perfeito! Só para confirmar, o agendamento...',
        unreadCount: 1,
        messages: [
             { id: 1, text: 'Olá! Gostaria de marcar uma consulta com a Dra. Mari.', sender: 'patient', timestamp: '10:42' },
             { id: 2, text: 'Olá, Diego! Claro. Para qual data e horário você gostaria de agendar com a Dra. Mari?', sender: 'bot', timestamp: '10:43' },
             { id: 3, text: 'Pode ser na quarta que vem, dia 20, às 10h da manhã?', sender: 'patient', timestamp: '10:44' },
             { id: 4, text: 'Perfeito! Só para confirmar, o agendamento é com a Dra. Mari (Cardiologia), na quarta-feira, dia 20 de novembro, às 10:00. Correto?', sender: 'bot', timestamp: '10:45' },
        ]
    },
    {
        id: 'convo-2',
        patientName: 'Ana Clara',
        patientPhone: '+55 21 91234-5678',
        lastMessageTimestamp: '09:30',
        lastMessageSnippet: 'Obrigada!',
        unreadCount: 0,
        messages: [
            { id: 1, text: 'Preciso cancelar minha consulta de amanhã com o Dr. João.', sender: 'patient', timestamp: '09:29' },
            { id: 2, text: 'Entendido, Ana. Consulta com Dr. João (Ortopedia) no dia 19/11 às 15:00 cancelada. Deseja remarcar para outra data?', sender: 'bot', timestamp: '09:29' },
            { id: 3, text: 'Não precisa, por enquanto. Obrigada!', sender: 'patient', timestamp: '09:30' },
        ]
    },
     {
        id: 'convo-3',
        patientName: 'Lucas Mendes',
        patientPhone: '+55 31 99999-8888',
        lastMessageTimestamp: 'Ontem',
        lastMessageSnippet: 'Ok, obrigado.',
        unreadCount: 0,
        messages: [
            { id: 1, text: 'Quanto custa a consulta com a Dra. Ana?', sender: 'patient', timestamp: '18:15' },
            { id: 2, text: 'Olá, Lucas. A consulta com a Dra. Ana (Dermatologia) é R$ 350. Gostaria de agendar um horário?', sender: 'bot', timestamp: '18:16' },
        ]
    }
];