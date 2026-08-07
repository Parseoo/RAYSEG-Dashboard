import { httpClient } from "@/lib/api/fetch-client";
import type { UserForm, CreateUserRequest, ResponseMessage, UserListResponse, UserResponse, ResetPasswordForm } from "@/lib/@type";

export interface UserListQuery {
    search?: string;
    role?: string;
    is_active?: boolean;
    page?: number;
    perPage?: number;
}

// Obtener la lista de usuarios
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
export async function CreateUser(data: CreateUserRequest | UserForm | any) {
    return httpClient.post<ResponseMessage>('/api/users', data);
}

// Cambiar contraseña personal
export async function ChangePassword(data: ResetPasswordForm) {
    return httpClient.put('/api/users/change-password', data);
}

// Subir foto de perfil para un usuario usando base64 (solo administradores)
export async function UploadProfilePicture(
    user_id: number | string,
    data: UploadProfilePictureRequest | { image_data: string } | string
) {
    const payload = typeof data === 'string'
        ? { image_data: data }
        : data;
    return httpClient.post<UserResponse>(`/api/users/${user_id}/profile-picture`, payload);
}

export async function EditUser(user_id: number, data: Partial<CreateUserRequest | UserForm | any>) {
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

// Resetear contraseña de un usuario mediante rol adminitrador
export async function ResetPasswordUserByAdmin(user_id: number, data: any = {}) {
    return httpClient.post(`/api/users/${user_id}/reset-password`, data);
}

export interface UploadProfilePictureRequest {
    image_data: string;
}


