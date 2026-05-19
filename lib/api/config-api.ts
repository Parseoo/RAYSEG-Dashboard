import { httpClient } from "./fetch-client";

// Obtener la configuración General
export async function GetSettings() {
    return httpClient.get<any>(`/api/settings`);
}

// Actualizar la configuración General
export async function UpdateSettings(data: any) {
    return httpClient.patch<any>(`/api/settings`, data);
}

// Obtener la configuracion de branding 
export async function GetBranding() {
    return httpClient.get<any>(`/api/settings/branding`);
}

