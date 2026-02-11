import { httpClient } from "@/lib/api/fetch-client";

export async function GetAllUsers() {
    return httpClient.get('/api/users');
}

export async function CreateUser(data: any) {
    return httpClient.post('/api/users', data);
}

export async function EditUser(user_id: any, data: any) {
    return httpClient.patch(`/api/users/${user_id}`, data);
}

export async function GetUsersById(user_id: string) {
    return httpClient.get(`/api/users/${user_id}`);
}

export async function DeleteUser(user_id: string) {
    return httpClient.delete(`/api/users/${user_id}`);
}