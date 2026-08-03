import { httpClient } from "@/lib/api/fetch-client";
import { ListCatalogItemsResponse } from "@/lib/@type";

import { ListRolesResponse, CreateRoleRequest, RoleDetail, MessageResponse, Permission, AssignPermissionsRequest} from "@/lib/@type-permission";

// RBAC - Roles y Permisos
// Lista de roles
export async function GetListRoles() {
    return httpClient.get<ListRolesResponse>('/api/rbac/roles');
}

// Crear un rol
export async function CreateRole(data: CreateRoleRequest) {
    return httpClient.post<ListRolesResponse>('/api/rbac/roles', data);
}

// Obtener un rol por ID
export async function GetRoleById(role_id: string | number) {
    return httpClient.get<RoleDetail>(`/api/rbac/roles/${role_id}`);
}

// Actualizar un rol por ID
export async function UpdateRoleById(role_id: string | number, data: CreateRoleRequest) {
    return httpClient.patch<ListCatalogItemsResponse>(`/api/rbac/roles/${role_id}`, data);
}

// Eliminar un rol por ID
export async function DeleteRoleById(role_id: string | number) {
    return httpClient.delete<MessageResponse>(`/api/rbac/roles/${role_id}`);
}

// Obtener los permisos (auth_permission) asignados a un rol
export async function GetRolePermissions(role_id: string | number) {
    return httpClient.get<any>(`/api/rbac/roles/${role_id}/permissions`);
}

// Asignar permisos (auth_permission IDs) a un rol
export async function AssignPermissionsToRole(role_id: string | number, data: AssignPermissionsRequest) {
    return httpClient.post<MessageResponse>(`/api/rbac/roles/${role_id}/permissions`, data);
}

// Remover un permiso de un rol
export async function DeletePermissionsFromRole(role_id: string | number, permission_id: string | number) {
    return httpClient.delete<MessageResponse>(`/api/rbac/roles/${role_id}/permissions/${permission_id}`);
}

// Listar todos los permisos disponibles desde auth_permission
export async function GetListPermissions() {
    return httpClient.get<any>(`/api/rbac/permissions`);
}

// Listar todos los permisos disponibles desde auth_permission, agrupados por app_label
export async function GetListPermissionsGrouped() {
    return httpClient.get<any>(`/api/rbac/permissions/grouped`);
}

// Verificar los permisos del usuario actual
export async function GetUserPermissions() {
    return httpClient.get<any>(`/api/rbac/permissions/check`);
}