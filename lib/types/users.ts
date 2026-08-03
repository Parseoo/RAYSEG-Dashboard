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
}

export interface Address {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
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
  role?: string;
  state?: string;
  city?: string;
  last_access_date?: string;
  last_password_change?: string;
  phone?: string;
  description?: string;
  title?: string;
  properties_created_count?: number;
  clients_created_count?: number;
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

export interface RegisterForm {
  email: string;
  name: string;
  paternal_last_name?: string;
  maternal_last_name?: string;
  password: string;
  password_confirm?: string;
  role?: string;
  username?: string;
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
  role?: string;
  state?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

// Users
export interface UserForm {
  email: string;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string | null;
  password: string;
  password_confirm: string;
  role: string;
  role_id?: number | null;
  phone?: string;
  internal_notes?: string;
  notas_internas?: string;
  address?: any;
  is_active: boolean | string;
  is_staff?: boolean;
  is_superuser?: boolean;
  permissions?: { [key: string]: boolean | string[] };
  profile_picture?: string;
  estado?: string;
  ciudad?: string;
  colonia?: string;
  codigo_postal?: string;
}



export interface Role {
  id: number;
  name: string;
}




