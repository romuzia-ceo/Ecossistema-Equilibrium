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

// Types for new modules
export type View = 'finance' | 'agenda' | 'settings';

export interface Message {
  id: number;
  text: string;
  sender: 'patient' | 'bot' | 'staff';
  timestamp: string;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  patient: string;
  time: string;
  date: string; // YYYY-MM-DD
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