import { httpClient } from "@/lib/api/fetch-client"

// Nota: httpClient ya está configurado con baseURL en fetch-client.ts
// Todas las peticiones usarán automáticamente http://localhost:8001
// Obtener todas las propiedades
export async function GetAllProperties() {
  return httpClient.get('/api/properties');
}

export async function CreateProperty(data: any) {
  return httpClient.post('/api/properties', data);
}

export async function GetPropertiesLocations() {
  return httpClient.get('/api/properties');
}

export async function GetPropertyById(id: string) {
  return httpClient.get(`/api/properties/${id}`);
}

export async function EditProperty(data: any) {
  return httpClient.put(`/api/properties/${data.id}`, data);
}
export async function DeleteProperty(id: string) {
  return httpClient.delete(`/api/properties/${id}`);
}