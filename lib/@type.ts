export interface propertyListItem {
  id: number,
  square: number,
  amountBed: number,
  title: string,
  price: number,
  mainImage: string,
  location: string,
  views: number,
  images: string[],
  description: string,
  facillity: { [key: string]: boolean }
}

export interface PropertyCardItem {
  id: number,
  square: number,
  amountBed: number,
  title: string,
  price: number,
  mainImage: string,
  location: string,
}

export interface PropertyCardProps {
  data: PropertyCardItem
  opt?: string,
}

export interface User {
  id: number;
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  title?: string;
  phone?: string;
  rfc?: string;
  description?: string;
  role?: string;
}

export interface UserState {
  user: User | null;
  isLogin: boolean;
  token: string | null;
  _hasHydrated?: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setHasHydrated: (state: boolean) => void;
}

// Authentication
export interface LoginForm {
  email: string
  password: string
}
export interface RegisterForm {
  email: string
  name: string
  paternal_last_name: string
  maternal_last_name: string
  password: string
  password_confirm: string
  role: string
}

export interface ResetPasswordForm {
  old_password: string
  new_password: string
  new_password_confirm: string
}

export interface LoginResponse {
  message: string;
  user: AuthUserResponse;
  tokens: AuthTokensResponse;
}
export interface AuthTokensResponse {
  access: string;
  refresh: string;
}

export interface AuthUserResponse {
  id: number;
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  title?: string;
  phone?: string;
  rfc?: string;
  description?: string;
  role?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

// Users
export interface UserForm {
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  password: string;
  password_confirm: string;
  role: string;
  is_active: boolean;
  permissions?: { [key: string]: boolean };
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  role?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface UserListResponse {
  users: UserResponse[];
  count: number;
}

export interface ResponseMessage {
  status: boolean;
  message: string;
  data: string;
}

// Properties
export interface PropertyListQuery {
  search?: string;
  city?: string;
  type?: string;
  estatus?: string; // Disponible | Vendido | Rentado (si tienes esos valores)
  status_property?: string;
}

export interface CatalogItem {
  catalogItemID: number;
  key: string;
  value: string;
  name: string;
  icon: string;
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
  conservation_status: string;
  address: LocationItemResponse[];
  amenities: CatalogItem[];
  images: PropertyImageItem[];
  plans: PropertyPlanItem[];
  property_status: string;
  property_post_status: CatalogItem;
  is_featured?: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface PropertyListResponse {
  properties: PropertyListItemResponse[];
  count: number;
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

export interface LocationItemResponse {
  property_address_id: number;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  street_number: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

export interface LocationListResponse {
  locations: LocationItemResponse[];
  count: number;
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
  conservation_status: string;
  address: unknown[];
  amenities: unknown[];
  images: unknown[];
  plans: unknown[];
  property_status: string;
  property_post_status: CatalogItem;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
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

// Catalogs
export interface CatalogResponse {
  catalogoID: number;
  key: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  catalogItems: unknown[];
}

export interface CatalogListResponse {
  catalogs: CatalogListResponse[];
  count: number;
}

export interface CreateCatalogForm {
  key: string;
  name: string;
  description: string;
}

export interface ListCatalogItemsResponse {
  items: ItemResponse[];
  count: number;
}

export interface ItemResponse {
  catalogItemID: number;
  catalogID: number;
  key: string;
  value: string;
  name: string;
  description: string;
  icon: string;
  extra: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCatalogItemForm {
  catalogID: number;
  key: string;
  value: string;
  name: string;
  description: string;
  icon: string;
  extra: string;
}

