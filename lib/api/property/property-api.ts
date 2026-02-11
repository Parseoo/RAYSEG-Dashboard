import { httpClient } from "@/lib/api/fetch-client"
import { GetProperty } from './property-query';

// Nota: httpClient ya está configurado con baseURL en fetch-client.ts
// Todas las peticiones usarán automáticamente http://localhost:8001

export async function GetAllPropertyApi() {
  console.log('📋 GetAllPropertyApi - Obteniendo propiedades...');
  
  try {
    const response = await httpClient.get("/api/properties");
    console.log('✅ Propiedades obtenidas:', response.data);
    return response;
  } catch (error: any) {
    console.error('❌ Error al obtener propiedades:', error.response?.data);
    throw error;
  }
}

export async function GetPropertyApi(id: number) {
  console.log('📋 GetPropertyApi - Obteniendo propiedad:', id);
  
  try {
    const response = await httpClient.get(`/api/properties/${id}`);
    console.log('✅ Propiedad obtenida:', response.data);
    return response;
  } catch (error: any) {
    console.error('❌ Error al obtener propiedad:', error.response?.data);
    throw error;
  }
}

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