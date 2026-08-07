import { CatalogItem } from './catalogs';

export interface propertyListItem {
  id: number;
  square: number;
  amountBed: number;
  title: string;
  price: number;
  mainImage: string;
  location: string;
  views: number;
  images: string[];
  description: string;
  facillity: { [key: string]: boolean };
}

export interface PropertyCardItem {
  id: number;
  square: number;
  amountBed: number;
  title: string;
  price: number;
  mainImage: string;
  location: string;
}

export interface PropertyCardProps {
  data: PropertyCardItem;
  opt?: string;
}

export interface PropertyListQuery {
  search?: string;
  city?: string;
  type?: string;
  estatus?: string;
  status_property?: string;
}

export interface LocationItemResponse {
  property_address_id: number;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  street_number: string;
  exterior_number?: string;
  interior_number?: string;
  postal_code: string;
  zip_code?: string;
  latitude: number;
  longitude: number;
}

export interface LocationListResponse {
  locations: LocationItemResponse[];
  count: number;
}

export interface AddLocationRequest {
  latitude: number;
  longitude: number;
}

export interface AddLocationResponse {
  status: boolean;
  message: string;
  data: {
    property_address_id: number;
  };
}

export interface PropertyImageItem {
  property_image_id: number;
  image: string;
  is_main: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface PropertyPlanItem {
  property_plan_id: number;
  plan: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PropertyListItemResponse {
  property_id: number;
  number_mls: string;
  title: string;
  description: string;
  price: string;
  property_type: CatalogItem;
  operation_type: string;
  terrain_type: CatalogItem;
  terrain_size: string;
  construction_size: string;
  rooms: number;
  bathrooms: number;
  parking_spaces: number;
  floors: number;
  construction_year: number;
  outdoor_spaces: number;
  conservation_status: string;
  address: LocationItemResponse[];
  amenities: CatalogItem[];
  images: PropertyImageItem[];
  plans: PropertyPlanItem[];
  property_status: string;
  property_post_status: CatalogItem;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyListResponse {
  properties: PropertyListItemResponse[];
  pagination: {
    total: number;
    pagina_actual: number;
    registros_por_pagina: number;
    total_paginas: number;
  };
}

export interface createPropertyForm {
  number_mls: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  operation_type: string;
  terrain_type: string;
  terrain_size: number;
  construction_size: number;
  rooms: number;
  bathrooms: number;
  parking_spaces: number;
  floors: number;
  construction_year: number;
  conservation_status: string;
  address: unknown[];
  amenities: unknown[];
  images: unknown[];
  plans: unknown[];
}

export interface PropertyDetailResponse {
  property_id: number;
  number_mls: string;
  title: string;
  description: string;
  price: number;
  property_type: CatalogItem;
  operation_type: string;
  terrain_type: CatalogItem;
  terrain_size: number;
  construction_size: number;
  rooms: number;
  bathrooms: number;
  parking_spaces: number;
  floors: number;
  construction_year: number;
  outdoor_spaces: number;
  conservation_status: string;
  address: unknown[];
  amenities: unknown[];
  images: unknown[];
  plans: unknown[];
  property_status: string;
  property_post_status: CatalogItem;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyAddress {
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  street_number: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  property_address_id: number;
}

export interface PropertyImage {
  fileID: number;
  file: string;
  is_main: boolean;
}

export interface PropertyPlan {
  fileID: number;
  file: string;
}

export interface PropertyUpdateForm {
  number_mls: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  operation_type: string;
  terrain_type: string;
  terrain_size: number;
  construction_size: number;
  rooms: number;
  bathrooms: number;
  parking_spaces: number;
  floors: number;
  construction_year: number;
  conservation_status: string;
  address: PropertyAddress[];
  amenities: string[];
  images: PropertyImage[];
  plans: PropertyPlan[];
  property_status: string;
  property_post_status: string;
}
