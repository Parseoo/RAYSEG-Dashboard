import { Pagination } from './common';

// ============================================
// SCHEMAS / MODELOS PRINCIPALES
// ============================================

export interface ClientContact {
  email: string;
  phone: string;
}

export interface ClientAgent {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  contact: ClientContact;
  client_type: string;
  client_status: string;
  main_interest: string;
  linked_properties: number;
  agent: ClientAgent;
  origin: string;
  created_date: string;
  profile_photo: string;
  // Fields used in the component but not in the primary endpoint response
  profile_picture?: string;
  tax_id?: string;
  lead_source?: string;
  agent_id?: number;
  property?: unknown;
  property_id?: number;
}

// ============================================
// RESPUESTAS PAGINADAS
// ============================================

export interface ClientListResponse {
  data: Client[];
  pagination: Pagination;
}

// ============================================
// TIPOS AUXILIARES DE UI
// ============================================

export interface FilterOption {
  value: string;
  label: string;
}

