import { httpClient } from "@/lib/api/fetch-client";
import type { UserForm, ResponseMessage, UserListResponse, UserResponse } from "@/lib/@type";

export interface UserListQuery {
    search?: string;
    role?: string;
    is_active?: boolean;
    page?: number;
    perPage?: number;
}

// Obtener todos los usuarios
export async function GetAllUsers(params?: UserListQuery) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.role) query.set('role', params.role);
    if (params?.is_active !== undefined) query.set('is_active', String(params.is_active));
    if (params?.page) query.set('page', String(params.page));
    if (params?.perPage) query.set('perPage', String(params.perPage));

    const qs = query.toString();
    return httpClient.get<UserListResponse>(`/api/users${qs ? `?${qs}` : ''}`);
}

// Crear un usuario
export async function CreateUser(data: UserForm) {
    return httpClient.post<ResponseMessage>('/api/users', data);
}

export async function EditUser(user_id: number, data: UserForm) {
    return httpClient.patch<ResponseMessage>(`/api/users/${user_id}`, data);
}

// Obtener un usuario por id
export async function GetUsersById(user_id: number) {
    return httpClient.get<UserResponse>(`/api/users/${user_id}`);
}

// Eliminar un usuario
export async function DeleteUser(user_id: number) {
    return httpClient.delete<ResponseMessage>(`/api/users/${user_id}`);
}

// Subir foto de perfil
export async function UploadProfilePicture(user_id: number, image: string) {
    return httpClient.post<ResponseMessage>(`/api/users/${user_id}/profile-picture`, { image });
}
