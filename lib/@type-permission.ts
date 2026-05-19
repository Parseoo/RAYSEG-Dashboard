export interface ListRolesResponse {
  id?: number;
  name?: string;
  description?: string;
  is_system_role?: boolean;
  created_at?: string;
  updated_at?: string;
  items?: any[];
  catalogItems?: any[];
  data?: any;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface Permission {
  id: number;
  codename: string;
  name: string;
  app_label: string;
  model: string;
}

export interface RoleDetail {
  id: number;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions: Permission[];
  created_at: string; // o Date si lo transformas
}

export interface MessageResponse {
  message: string;
  detail: string;
}

export interface AssignPermissionsRequest {
  permission_ids: number[];
}