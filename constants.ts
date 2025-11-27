


import { CostCenterCategory, FinancialRecord, WhatsAppConversation, Professional, ClinicService, User, Template, TemplateType, RolePermissions, SystemUser, Patient, ClinicalAppointment, ClinicalAppointmentStatus, ConsultationRecord, Equipment, EquipmentStatus, GeneratedDocument, InventoryItem, HealthInsurancePlan, Transaction, BlogPost, Testimonial, Availability } from './types';

// ==========================================================
// REAL DATA BASED ON equilibriumsrc.com.br
// ==========================================================

const giseleAvailability: { [date: string]: Availability | null } = {
    '2025-11-03': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-04': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-05': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-06': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-07': { start: '09:00', end: '17:00' },
    '2025-11-10': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-11': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-12': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-13': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-14': { start: '09:00', end: '17:00' },
    '2025-11-17': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-18': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-19': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-20': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-21': { start: '09:00', end: '17:00' },
    '2025-11-24': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-25': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-26': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-27': { start: '09:00', end: '18:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-28': { start: '09:00', end: '17:00' },
};

const julianaAvailability: { [date: string]: Availability | null } = {
    '2025-11-17': { start: '08:00', end: '17:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-18': { start: '08:00', end: '17:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-19': { start: '08:00', end: '12:00' },
    '2025-11-20': null,
    '2025-11-21': { start: '13:00', end: '18:00' },
    '2025-11-24': { start: '08:00', end: '17:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-25': { start: '08:00', end: '17:00', lunchBreak: { start: '12:00', end: '13:00' } },
    '2025-11-26': { start: '08:00', end: '12:00' },
    '2025-11-27': null,
    '2025-11-28': { start: '13:00', end: '18:00' },
};


export const MOCK_PROFESSIONALS: Professional[] = [
    {
        id: 'prof-1',
        name: 'Gisele T. L. S. Rosa',
        role: 'Psicóloga (CRP 06/12345)',
        availability: giseleAvailability,
        schedule: {
            '2025-11-20': [{ time: '10:00', patient: 'Lucas Mendes'}, {time: '11:00'}, {time: '14:00'}, {time: '15:00', patient: 'Ana Clara'}],
            '2025-11-21': [{ time: '09:00'}, {time: '10:00'}, {time: '11:00'}, {time: '13:00', patient: 'Fernanda Lima'}],
        },
    },
    {
        id: 'prof-2',
        name: 'Juliana Bueno',
        role: 'Neuropsicóloga (CRP 06/54321)',
        availability: julianaAvailability,
        schedule: {
             '2025-11-20': [{ time: '08:00', patient: 'Diego'}, {time: '09:00'}, {time: '10:00'}, {time: '14:00'}],
             '2025-11-21': [{ time: '13:00'}, {time: '14:00'}, {time: '15:00'}],
        },
    },
];

export const MOCK_SERVICES: ClinicService[] = [
    { id: 'serv-1', name: 'Psicoterapia', price: 280, instructions: 'Nenhuma preparação específica é necessária. A sessão tem duração de 50 minutos.' },
    { id: 'serv-2', name: 'Avaliação Neuropsicológica', price: 1500, instructions: 'É recomendado ter uma boa noite de sono antes da avaliação. O processo pode levar algumas sessões para ser concluído.' },
    { id: 'serv-3', name: 'Orientação Vocacional', price: 600 },
    { id: 'serv-4', name: 'Orientação a Pais', price: 300 },
    { id: 'serv-5', name: 'Supervisão para Psicólogos', price: 350 },
];

export const MOCK_FINANCIAL_DATA: FinancialRecord[] = [
  // Specialties
  { id: 'spec-1', name: 'Psicologia', category: CostCenterCategory.SPECIALTY, revenue: 180000, costs: 95000 },
  { id: 'spec-2', name: 'Neuropsicologia', category: CostCenterCategory.SPECIALTY, revenue: 110000, costs: 50000 },

  // Units
  { id: 'unit-1', name: 'Unidade São Roque', category: CostCenterCategory.UNIT, revenue: 290000, costs: 145000 },

  // Doctors
  { id: 'doc-1', name: 'Gisele T. L. S. Rosa', category: CostCenterCategory.DOCTOR, revenue: 160000, costs: 80000 },
  { id: 'doc-2', name: 'Juliana Bueno', category: CostCenterCategory.DOCTOR, revenue: 130000, costs: 65000 },
];

export const MOCK_INSURANCE_PLANS: HealthInsurancePlan[] = [
    {
        id: 'ins-1',
        name: 'MedPless',
        priceTable: {
            'serv-1': 150, // Psicoterapia
            'serv-2': 1100, // Avaliação Neuropsicológica
            'serv-4': 180, // Orientação a Pais
        },
    },
    {
        id: 'ins-2',
        name: 'MedPrev',
        priceTable: {
            'serv-1': 160, // Psicoterapia
            'serv-3': 450, // Orientação Vocacional
        },
    },
];

export const MOCK_PATIENTS: Patient[] = [
    { id: 'pat-1', name: 'Diego', birthDate: '1985-04-12', gender: 'Masculino', cpf: '123.456.789-00', phone: '+55 11 98765-4321', insurancePlanId: 'ins-2' },
    { id: 'pat-2', name: 'Ana Clara', birthDate: '1992-09-20', gender: 'Feminino', cpf: '987.654.321-00', phone: '+55 21 91234-5678' },
    { id: 'pat-3', name: 'Lucas Mendes', birthDate: '1990-01-30', gender: 'Masculino', cpf: '111.222.333-44', phone: '+55 31 99999-8888' },
    { id: 'pat-4', name: 'Fernanda Lima', birthDate: '1978-07-08', gender: 'Feminino', cpf: '444.555.666-77', phone: '+55 71 98888-7777' },
];

export const MOCK_TODAYS_APPOINTMENTS: ClinicalAppointment[] = [
    { id: 'app-1', time: '08:00', patient: MOCK_PATIENTS[0], professional: MOCK_PROFESSIONALS[1], service: MOCK_SERVICES[1], status: ClinicalAppointmentStatus.FINALIZADO },
    { id: 'app-2', time: '10:00', patient: MOCK_PATIENTS[2], professional: MOCK_PROFESSIONALS[0], service: MOCK_SERVICES[0], status: ClinicalAppointmentStatus.EM_ATENDIMENTO },
    { id: 'app-3', time: '14:00', patient: MOCK_PATIENTS[3], professional: MOCK_PROFESSIONALS[0], service: MOCK_SERVICES[0], status: ClinicalAppointmentStatus.AGUARDANDO },
    { id: 'app-4', time: '15:00', patient: MOCK_PATIENTS[1], professional: MOCK_PROFESSIONALS[0], service: MOCK_SERVICES[3], status: ClinicalAppointmentStatus.AGUARDANDO },
];

// ==========================================================
// STATIC MOCK DATA (Less likely to change based on real data)
// ==========================================================

export const MOCK_CONVERSATIONS: WhatsAppConversation[] = [
    {
        id: 'convo-1',
        patientName: 'Diego (Paciente)',
        patientPhone: '+55 11 98765-4321',
        lastMessageTimestamp: '10:45',
        lastMessageSnippet: 'Perfeito! Só para confirmar, o agendamento...',
        unreadCount: 1,
        messages: [
             { id: 1, text: 'Olá! Gostaria de marcar uma Avaliação Neuropsicológica.', sender: 'patient', timestamp: '10:42' },
             { id: 2, text: 'Olá, Diego! Claro. A avaliação é realizada pela Dra. Juliana Bueno. Para qual data você gostaria de verificar a disponibilidade?', sender: 'bot', timestamp: '10:43' },
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
            { id: 1, text: 'Preciso cancelar minha consulta de amanhã.', sender: 'patient', timestamp: '09:29' },
            { id: 2, text: 'Entendido, Ana. Consulta com Dra. Gisele (Psicoterapia) no dia 21/11 às 15:00 cancelada. Deseja remarcar para outra data?', sender: 'bot', timestamp: '09:29' },
        ]
    },
];

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Carla (Recepção)', email: 'carla@equilibrium.com', role: 'recepcao' },
    { id: 'user-2', name: 'Bruno (Financeiro)', email: 'bruno@equilibrium.com', role: 'financeiro' },
    { id: 'user-3', name: 'Ana (Admin)', email: 'ana@equilibrium.com', role: 'admin' },
];

export const MOCK_TEMPLATES: Template[] = [
    { id: 'tmpl-1', name: 'Prontuário Padrão - SOAP', type: TemplateType.PRONTUARIO, content: `**S (Subjetivo):**\n- Queixa principal:\n- História da moléstia atual (HMA):\n\n**O (Objetivo):**\n- Exame do estado mental:\n- Comportamento observado:\n\n**A (Avaliação):**\n- Hipóteses diagnósticas (HD):\n\n**P (Plano):**\n- Conduta terapêutica:\n- Orientações:\n` },
    { id: 'tmpl-2', name: 'Receita Simples', type: TemplateType.RECEITA, content: `**RECEITUÁRIO**\n\n**Paciente:** {{nome_paciente}}\n\n**Uso contínuo:**\n1. \n\n---\n{{nome_profissional}}\n{{role_profissional}}\nData: {{data_atual}}` },
    { id: 'tmpl-3', name: 'Atestado de Comparecimento', type: TemplateType.ATESTADO, content: `**ATESTADO**\n\nAtesto, para os devidos fins, que o(a) Sr(a). **{{nome_paciente}}**, esteve presente nesta clínica no dia {{data_atual}}, para fins de acompanhamento psicológico/neuropsicológico.\n\n---\n{{nome_profissional}}\n{{role_profissional}}\nData: {{data_atual}}` },
    { id: 'tmpl-4', name: 'Anamnese Psicológica', type: TemplateType.ANAMNESE, content: `**ANAMNESE PSICOLÓGICA**\n\n**Paciente:** {{nome_paciente}}\n**Data:** {{data_atual}}\n\n**1. Queixa Principal (QP):**\n\n**2. História da Moléstia Atual (HMA):**\n\n**3. Histórico Pessoal e Familiar:**\n` },
    { id: 'tmpl-5', name: 'Solicitação de Avaliação', type: TemplateType.SOLICITACAO_EXAME, content: `**SOLICITAÇÃO DE AVALIAÇÃO/EXAME**\n\n**Paciente:** {{nome_paciente}}\n\n**Prezado(a) colega,**\n\nSolicito, por gentileza, a realização da seguinte avaliação para o(a) paciente acima:\n\n1. \n\n**Hipótese Diagnóstica (HD):**\n- \n\nAgradeço a atenção.\n\n---\n{{nome_profissional}}\n{{role_profissional}}\nData: {{data_atual}}` }
];

export const MOCK_PATIENT_HISTORY: ConsultationRecord[] = [
    { id: 'hist-1', date: '2025-08-15', professional: MOCK_PROFESSIONALS[0], serviceName: 'Psicoterapia', content: 'Paciente relata melhora na ansiedade. Discutimos técnicas de mindfulness.' },
    { id: 'hist-2', date: '2025-05-02', professional: MOCK_PROFESSIONALS[0], serviceName: 'Psicoterapia', content: 'Sessão inicial. Paciente apresenta queixas de insônia e estresse no trabalho.' }
];

export const MOCK_GENERATED_DOCUMENTS: GeneratedDocument[] = [
    { id: 'doc-1', patientId: 'pat-1', type: TemplateType.ATESTADO, title: 'Atestado de Comparecimento', createdAt: '2025-08-15', professionalName: 'Gisele T. L. S. Rosa', content: `**ATESTADO**\n\nAtesto, para os devidos fins, que o(a) Sr(a). **Diego**, esteve presente nesta clínica no dia 15/08/2025, para fins de acompanhamento psicológico.\n\n---\nGisele T. L. S. Rosa\nPsicóloga (CRP 06/12345)\nData: 15/08/2025` }
];

export const MOCK_EQUIPMENT: Equipment[] = [
    { id: 'equip-1', name: 'Kit de Testes WISC-IV', location: 'Sala de Avaliação 1', status: EquipmentStatus.OPERATIONAL, lastMaintenance: '2025-01-01', nextMaintenance: '2026-01-01' },
    { id: 'equip-2', name: 'Software de Correção HTS', location: 'Computador Dra. Juliana', status: EquipmentStatus.OPERATIONAL, lastMaintenance: '2025-06-15', nextMaintenance: '2025-12-15' },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
    { id: 'inv-1', name: 'Bloco de Respostas WISC-IV', category: 'Material de Testagem', quantity: 15, lowStockThreshold: 10, supplier: 'Editora Vetor', lastRestockDate: '2025-09-20' },
    { id: 'inv-2', name: 'Resma de Papel A4', category: 'Material de Escritório', quantity: 8, lowStockThreshold: 10, supplier: 'Kalunga', lastRestockDate: '2025-10-25' },
    { id: 'inv-3', name: 'Caixa de Lenços de Papel', category: 'Material de Consultório', quantity: 30, lowStockThreshold: 10, supplier: 'Atacadão', lastRestockDate: '2025-11-18' },
];

export const HEALTH_CAMPAIGNS: { [month: number]: { name: string; slug: string; color: string; bgColor: string; description: string; } } = {
    0: { name: "Janeiro Branco", slug: "janeiro-branco", color: "text-gray-800", bgColor: "bg-gray-100", description: "Foco na conscientização sobre a saúde mental e emocional." },
    1: { name: "Fevereiro Roxo", slug: "fevereiro-roxo", color: "text-purple-800", bgColor: "bg-purple-100", description: "Conscientização sobre lúpus, fibromialgia e mal de Alzheimer." },
    2: { name: "Março Amarelo", slug: "marco-amarelo", color: "text-yellow-800", bgColor: "bg-yellow-100", description: "Prevenção e conscientização sobre a endometriose." },
    3: { name: "Abril Azul", slug: "abril-azul", color: "text-blue-800", bgColor: "bg-blue-100", description: "Conscientização sobre o autismo." },
    4: { name: "Maio Amarelo", slug: "maio-amarelo", color: "text-yellow-800", bgColor: "bg-yellow-100", description: "Prevenção de acidentes de trânsito." },
    5: { name: "Junho Vermelho", slug: "junho-vermelho", color: "text-red-800", bgColor: "bg-red-100", description: "Incentivo à doação de sangue." },
    6: { name: "Julho Amarelo", slug: "julho-amarelo", color: "text-yellow-800", bgColor: "bg-yellow-100", description: "Conscientização sobre as hepatites virais." },
    7: { name: "Agosto Dourado", slug: "agosto-dourado", color: "text-yellow-900", bgColor: "bg-yellow-100", description: "Incentivo ao aleitamento materno." },
    8: { name: "Setembro Amarelo", slug: "setembro-amarelo", color: "text-yellow-800", bgColor: "bg-yellow-100", description: "Campanha de prevenção ao suicídio e valorização da vida." },
    9: { name: "Outubro Rosa", slug: "outubro-rosa", color: "text-pink-800", bgColor: "bg-pink-100", description: "Conscientização sobre a prevenção do câncer de mama." },
    10: { name: "Novembro Azul", slug: "novembro-azul", color: "text-blue-800", bgColor: "bg-blue-100", description: "Prevenção e combate ao câncer de próstata." },
    11: { name: "Dezembro Laranja", slug: "dezembro-laranja", color: "text-orange-800", bgColor: "bg-orange-100", description: "Prevenção e combate ao câncer de pele." }
};

export const MOCK_BLOG_POSTS: BlogPost[] = [
  { id: 'post-1', title: 'Qual a diferença entre Psicólogo e Psiquiatra?', excerpt: 'Entenda as áreas de atuação de cada profissional e saiba quando procurar a ajuda de cada um para cuidar da sua saúde mental.', imageUrl: 'https://images.unsplash.com/photo-1579895397331-601c4125b3a3?q=80&w=800', category: 'Saúde Mental', slug: 'diferenca-psicologo-psiquiatra', campaignSlug: 'janeiro-branco' },
  { id: 'post-2', title: 'A importância da Avaliação Neuropsicológica Infantil', excerpt: 'Descubra como a avaliação neuropsicológica pode ajudar a identificar e a intervir em dificuldades de aprendizagem e de comportamento em crianças.', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800', category: 'Neuropsicologia', slug: 'avaliacao-neuropsicologica-infantil', campaignSlug: 'abril-azul' },
  { id: 'post-3', title: 'A importância do Psicólogo no tratamento de DTM', excerpt: 'A Disfunção Temporomandibular (DTM) tem causas multifatoriais, e o acompanhamento psicológico é fundamental para o tratamento.', imageUrl: 'https://images.unsplash.com/photo-1598438188243-5582b18a8a?q=80&w=800', category: 'Bem-Estar', slug: 'psicologo-tratamento-dtm' },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
    { id: 'test-1', quote: 'A Gisele é uma profissional incrível. Através da terapia, pude perceber várias questões da minha vida que precisavam de atenção.', author: 'A.R.' },
    { id: 'test-2', quote: 'Desde o primeiro contato, a Juliana foi super acolhedora. Me sinto muito mais confiante e feliz com o meu processo terapêutico.', author: 'M.S.' },
    { id: 'test-3', quote: 'Excelente profissional, atenciosa e competente. Recomendo muito o trabalho da Dra. Gisele. Mudou a minha vida!', author: 'L.P.' },
];

// ==========================================================
// USERS & PERMISSIONS
// ==========================================================

export const SYSTEM_USERS: SystemUser[] = [
    { id: 'user-gisele', name: 'Dra. Gisele (Profissional)', role: 'professional', initials: 'G', professionalId: 'prof-1' },
    { id: 'user-juliana', name: 'Dra. Juliana (Profissional)', role: 'professional', initials: 'J', professionalId: 'prof-2' },
    { id: 'user-ana', name: 'Ana (Admin)', role: 'admin', initials: 'A' },
    { id: 'user-carla', name: 'Carla (Recepção)', role: 'reception', initials: 'C' },
    { id: 'user-bruno', name: 'Bruno (Financeiro)', role: 'finance', initials: 'B' },
    { id: 'user-mariana', name: 'Mariana (Marketing)', role: 'marketing', initials: 'M' },
    { id: 'user-diego', name: 'Diego (Paciente)', role: 'patient', initials: 'D', patientId: 'pat-1' },
    { id: 'user-public', name: 'Website Público', role: 'public', initials: 'W' },
    { id: 'user-backend-tester', name: 'Backend Tester', role: 'backend_tester', initials: 'BT' },
];

export const ROLE_PERMISSIONS: RolePermissions = {
    admin: ['home', 'finance', 'agenda', 'clinical', 'management', 'marketing', 'patrimony', 'inventory', 'settings'],
    professional: ['home', 'agenda', 'clinical', 'profile_settings'],
    reception: ['home', 'agenda', 'clinical', 'inventory'],
    finance: ['home', 'finance'],
    marketing: ['home', 'finance', 'agenda', 'clinical', 'management', 'marketing', 'patrimony', 'inventory', 'settings'],
    patient: [], // Patient view is a separate layout
    public: [], // Public view is a separate layout
    backend_tester: ['backend_test'],
};