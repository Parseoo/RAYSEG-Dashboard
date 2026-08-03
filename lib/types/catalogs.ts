import { Pagination } from './common';

// ============================================
// SCHEMAS / MODELOS PRINCIPALES
// ============================================

export interface CatalogItem {
  catalogItemID: number;
  catalogID: number;
  key: string;
  value: string;
  name: string;
  description: string;
  icon: string;
  extra: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export type ItemResponse = CatalogItem;

export interface CatalogResponse {
  catalogoID: number;
  key: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  catalogItems: CatalogItem[];
}

// ============================================
// PARÁMETROS DE FILTRADO (QUERY PARAMS)
// ============================================

export interface CatalogFilterParams {
  search?: string;
  page?: number;
  perPage?: number;
}

export interface CatalogItemFilterParams {
  search?: string;
  page?: number;
  perPage?: number;
}

// ============================================
// RESPUESTAS PAGINADAS
// ============================================

export interface CatalogListResponse {
  catalogs: CatalogResponse[];
  pagination: Pagination;
}

export interface ListCatalogItemsResponse {
  items: CatalogItem[];
  pagination: Pagination;
}

// ============================================
// REQUESTS & RESPONSES PARA CREACIÓN / EDICIÓN
// ============================================

export interface CreateCatalogRequest {
  name: string;
  description?: string;
}

export type CreateCatalogForm = CreateCatalogRequest;

export interface CreateCatalogItemRequest {
  catalogID: number;
  name: string;
  description?: string;
  icon?: string;
  extra?: string;
  key?: string;
  value?: string;
}

export type CreateCatalogItemForm = CreateCatalogItemRequest;

export interface PreviewCatalogItemRequest {
  catalogID: number;
  name: string;
}

export interface PreviewCatalogItemResponse {
  preview_key: string;
  preview_value: string;
  name: string;
  catalogID: number;
}

export interface UpdateCatalogItemRequest {
  name: string;
  description?: string;
  icon?: string;
  extra?: string;
  key?: string;
  value?: string;
}

export interface DeleteCatalogItemResponse {
  success: boolean;
  message: string;
  item_id?: number;
  item_name?: string;
}

export interface SystemItemProtectionError {
  error: string;
  message: string;
  item_id?: number;
  item_name?: string;
  is_system?: boolean;
}

