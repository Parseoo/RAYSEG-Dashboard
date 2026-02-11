import { httpClient } from "@/lib/api/fetch-client";

export async function CreateClient(data: any) {
    return httpClient.post('/api/clients', data);
}

export async function GetAllClients() {
    return httpClient.get('/api/clients');
}

export async function GetClientById(client_id: string) {
    return httpClient.get(`/api/clients/${client_id}`);
}

export async function EditClient(client_id: any, data: any) {
    return httpClient.patch(`/api/clients/${client_id}`, data);
}

export async function DeleteClient(client_id: string) {
    return httpClient.delete(`/api/clients/${client_id}`);
}

export async function DesactiveClient(client_id: any, data: any) {
    return httpClient.patch(`/api/clients/${client_id}/status`, data);
}

export async function GetReportClients() {
    return httpClient.get('/api/clients/reports/clients');
}

export async function GetPropertyClients() {
    return httpClient.get('/api/clients/reports/properties');
}
