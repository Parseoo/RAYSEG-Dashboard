// Lista usuarios
export interface UserListResponse {
  users: UserResponse[];
  count: number;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  phone: string;
  address: Address;
  profile_picture: string;
  internal_notes: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  role: Role;
  created_at: string;
  updated_at: string;
  last_access_date?: string;
  last_password_change?: string;
  es_agente?: boolean;
}

export interface Address {
  street?: string | null;
  ext_number?: string | null;
  int_number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
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
  created_at: string;
  updated_at: string;
  role?: string | Role;
  role_id?: number;
  state?: string;
  city?: string;
  address?: Address | null;
  profile_picture?: string | null;
  internal_notes?: string | null;
  last_access_date?: string;
  last_password_change?: string;
  phone?: string;
  description?: string;
  title?: string;
  properties_created_count?: number;
  clients_created_count?: number;
  es_agente?: boolean;
}

export interface UserState {
  user: User | null;
  isLogin: boolean;
  token: string | null;
  _hasHydrated: boolean;
  isSessionExpired?: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setHasHydrated: (state: boolean) => void;
  setSessionExpired: (state: boolean) => void;
}

// Authentication
export interface LoginForm {
  email: string;
  password: string;
}



export interface ResetPasswordForm {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
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
  role?: string | Role;
  role_id?: number;
  address?: Address | null;
  profile_picture?: string | null;
  internal_notes?: string | null;
  state?: string;
  city?: string;
  created_at: string;
  updated_at: string;
  last_access_date?: string;
  last_password_change?: string;
  properties_created_count?: number;
  clients_created_count?: number;
  es_agente?: boolean;
}

// Users
export interface UserForm {
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string | null;
  password?: string;
  password_confirm?: string;
  old_password?: string;
  role: string;
  role_id?: number | null;
  phone?: string;
  internal_notes?: string;
  notas_internas?: string;
  address?: any;
  is_active: boolean | string;
  is_staff?: boolean;
  is_superuser?: boolean | string;
  es_agente?: boolean | string;
  permissions?: { [key: string]: boolean | string[] };
  profile_picture?: string;
  street?: string;
  ext_number?: string;
  int_number?: string;
  calle?: string;
  numero_exterior?: string;
  numero_interior?: string;
  estado?: string;
  ciudad?: string;
  colonia?: string;
  codigo_postal?: string;
  last_access_date?: string;
  last_password_change?: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  phone: string;
  address: {
    street: string;
    ext_number: string;
    int_number: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
  };
  profile_picture: string;
  internal_notes: string;
  password?: string;
  password_confirm?: string;
  role_id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  es_agente?: boolean;
}

export interface Role {
  id: number;
  name: string;
}




