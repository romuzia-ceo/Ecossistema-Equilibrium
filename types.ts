

export enum CostCenterCategory {
  SPECIALTY = 'Especialidade',
  UNIT = 'Unidade',
  DOCTOR = 'Médico',
}

export interface FinancialRecord {
  id: string;
  name: string;
  category: CostCenterCategory;
  revenue: number;
  costs: number;
}

export interface ChartData {
  name: string;
  receita: number;
  custos: number;
  lucro: number;
}

// ===================================
// Accounts Payable & Cash Flow Types
// ===================================

export enum PayableStatus {
    PENDING = 'Pendente',
    PAID = 'Pago',
    OVERDUE = 'Atrasado'
}

export interface PayableRecord {
    id: string;
    description: string;
    amount: number;
    dueDate: string; // YYYY-MM-DD
    category: string;
    status: PayableStatus;
    supplier?: string;
}

export interface CashFlowPoint {
    date: string;
    dateLabel: string;
    projectedIncome: number; // From Appointments
    projectedExpense: number; // From Payables
    accumulatedBalance: number; // Previous Balance + (Income - Expense)
}

// ===================================
// General Types
// ===================================
export type View = 'home' | 'finance' | 'agenda' | 'clinical' | 'settings' | 'management' | 'marketing' | 'patrimony' | 'inventory' | 'website' | 'profile_settings' | 'backend_test';

export type Role = 'admin' | 'professional' | 'reception' | 'finance' | 'marketing' | 'patient' | 'public' | 'backend_tester';

export interface SystemUser {
  id: string;
  name: string;
  role: Role;
  initials: string;
  patientId?: string;
  professionalId?: string;
}

export type RolePermissions = {
  [key in Role]: View[];
};


// ===================================
// Types for Agenda Module
// ===================================
export interface Message {
  id: number;
  text: string;
  sender: 'patient' | 'bot' | 'staff';
  timestamp: string;
}

export interface WhatsAppConversation {
  id: string;
  patientName: string;
  patientPhone: string;
  lastMessageTimestamp: string;
  lastMessageSnippet: string;
  messages: Message[];
  unreadCount: number;
}

export interface TimeSlot {
  time: string;
  patient?: string;
}

// ===================================
// Types for Management Module
// ===================================
export type ManagementTab = 'professionals' | 'services' | 'users' | 'templates' | 'insurance';

export interface Availability {
    start: string;
    end: string;
    lunchBreak?: {
        start: string;
        end: string;
    };
}

// Represents a healthcare professional (doctor, psychologist, etc.)
export interface Professional {
  id: string;
  name: string;
  role: string;
  availability: {
    [date: string]: Availability | null; // YYYY-MM-DD
  };
  schedule: {
      [date: string]: TimeSlot[];
  };
}

export interface ClinicService {
  id: string;
  name: string;
  price: number;
  instructions?: string;
}

// Represents a user of the internal system (not a patient)
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recepcao' | 'financeiro' | 'professional';
}

export enum TemplateType {
    PRONTUARIO = 'Prontuário',
    RECEITA = 'Receita',
    ATESTADO = 'Atestado',
    ANAMNESE = 'Anamnese',
    SOLICITACAO_EXAME = 'Solicitação de Exame',
}

export interface Template {
    id: string;
    name: string;
    type: TemplateType;
    content: string;
}

export interface HealthInsurancePlan {
    id: string;
    name: string;
    priceTable: { [serviceId: string]: number };
}


// ===================================
// Types for Clinical Module
// ===================================

export interface Patient {
    id: string;
    name: string;
    birthDate: string;
    gender: 'Masculino' | 'Feminino' | 'Outro';
    cpf: string;
    phone: string;
    insurancePlanId?: string;
}

export enum ClinicalAppointmentStatus {
    AGUARDANDO = 'Aguardando',
    EM_ATENDIMENTO = 'Em Atendimento',
    FINALIZADO = 'Finalizado',
}

export interface ClinicalAppointment {
    id: string;
    time: string;
    patient: Patient;
    professional: Professional;
    service: ClinicService;
    status: ClinicalAppointmentStatus;
}

export interface ConsultationRecord {
    id: string;
    date: string;
    professional: Professional;
    serviceName: string;
    content?: string;
    soap_S?: string;
    soap_O?: string;
    soap_A?: string;
    soap_P?: string;
}

export interface GeneratedDocument {
    id: string;
    patientId: string;
    type: TemplateType;
    title: string;
    createdAt: string;
    professionalName: string;
    content: string;
}

// ===================================
// Types for Patrimony & Inventory Modules
// ===================================

export enum EquipmentStatus {
    OPERATIONAL = 'Operacional',
    IN_MAINTENANCE = 'Em Manutenção',
    NEEDS_ATTENTION = 'Requer Atenção',
}

export interface Equipment {
    id: string;
    name: string;
    location: string;
    status: EquipmentStatus;
    lastMaintenance: string;
    nextMaintenance: string;
}

export enum InventoryItemStatus {
    IN_STOCK = 'Em Estoque',
    LOW_STOCK = 'Estoque Baixo',
    OUT_OF_STOCK = 'Sem Estoque',
}

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    lowStockThreshold: number;
    supplier?: string;
    lastRestockDate: string;
}

// ===================================
// Types for Billing Module
// ===================================

export enum PaymentMethod {
    CASH = 'Dinheiro',
    CARD = 'Cartão',
}

export interface Transaction {
    id: string;
    appointmentId: string;
    patientId: string;
    serviceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: string; // ISO String for dates
}

export interface FullTransaction extends Transaction {
    professionalName: string;
    professionalRole: string; // specialty
    serviceName: string;
}


// ===================================
// Types for Marketing Module
// ===================================

export interface MarketingMetrics {
    topProfessional: { name: string; count: number };
    topService: { name: string; count: number };
    satisfactionRate: number;
    newPatients: number;
    professionalPopularity: { name: string; value: number }[];
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    slug: string;
    campaignSlug?: string;
}

export interface Testimonial {
    id: string;
    quote: string;
    author: string;
}

// ===================================
// Types for Public Website
// ===================================
export interface SeoData {
    title: string;
    description: string;
}

export interface PublicRoute {
    path: string;
    name: string;
    component: any;
    seo: SeoData;
}