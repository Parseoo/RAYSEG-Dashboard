import { httpClient } from "@/lib/api/fetch-client";
import type { UserForm, ResponseMessage, UserListResponse, UserResponse } from "@/lib/@type";

export async function GetAllUsers() {
    return httpClient.get<UserListResponse>('/api/users');
}

export async function CreateUser(data: UserForm) {
    return httpClient.post<ResponseMessage>('/api/users', data);
}

export async function EditUser(user_id: number, data: UserForm) {
    return httpClient.patch<ResponseMessage>(`/api/users/${user_id}`, data);
}

export async function GetUsersById(user_id: number) {
    return httpClient.get<UserResponse>(`/api/users/${user_id}`);
}

export async function DeleteUser(user_id: number) {
    return httpClient.delete<ResponseMessage>(`/api/users/${user_id}`);
}