import { httpClient } from "@/lib/api/fetch-client"

// Nota: httpClient ya está configurado con baseURL en fetch-client.ts
// Todas las peticiones usarán automáticamente http://localhost:8001

// Obtener todas las propiedades
// Obtener todas las propiedades con paginación
export async function GetAllProperties(page: number = 1, limit: number = 10) {
  return httpClient.get(`/api/properties?page=${page}&limit=${limit}`);
}

// Crear una propiedad
export async function CreateProperty(data: any) {
  return httpClient.post('/api/properties', data);
}

// Obtener todas las localizaciones de las propiedades
export async function GetPropertiesLocations() {
  return httpClient.get('/api/properties');
}

// Obtener una propiedad por id
export async function GetPropertyById(id: string) {
  return httpClient.get(`/api/properties/${id}`);
}

// Editar una propiedad
export async function EditProperty(data: any) {
  return httpClient.put(`/api/properties/${data.id}`, data);
}

// Eliminar una propiedad
export async function DeleteProperty(id: string) {
  return httpClient.delete(`/api/properties/${id}`);
}