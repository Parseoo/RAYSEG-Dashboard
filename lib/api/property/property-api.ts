import { httpClient } from "@/lib/api/fetch-client"
import { AddLocationRequest, AddLocationResponse } from "@/lib/types/properties"

// Nota: httpClient ya está configurado con baseURL en fetch-client.ts
// Todas las peticiones usarán automáticamente http://localhost:8001

const BASE_URL = '/api/properties';
// Obtener todas las propiedades
// Obtener todas las propiedades con paginación
export async function GetAllProperties(page: number = 1, limit: number = 10) {
  return httpClient.get(`${BASE_URL}?page=${page}&perPage=${limit}`);
}

// Crear una propiedad
export async function CreateProperty(data: any) {
  return httpClient.post(`${BASE_URL}`, data);
}

// Obtener una propiedad por id
export async function GetPropertyById(property_id: string) {
  return httpClient.get(`${BASE_URL}/${property_id}`);
}

// Editar una propiedad
export async function EditProperty(data: any) {
  return httpClient.put(`${BASE_URL}/${data.id}`, data);
}

// Eliminar una propiedad
export async function DeleteProperty(property_id: string) {
  return httpClient.delete(`${BASE_URL}/${property_id}`);
}

// LOCALIZACIONES
// Obtener todas las localizaciones de las propiedades
export async function GetPropertiesLocations(search?: string) {
  const url = search ? `${BASE_URL}/locations?search=${encodeURIComponent(search)}` : `${BASE_URL}/locations`;
  return httpClient.get(url);
}

// Obtener una localización por id
export async function GetPropertyLocationById(property_id: string) {
  return httpClient.get(`${BASE_URL}/locations/${property_id}`);
}

export async function AddLocation(property_id: string, data: AddLocationRequest) {
  return httpClient.post<AddLocationResponse>(`${BASE_URL}/${property_id}/locations`, data);
}

// Actualizar localizacion
export async function EditLocation(property_id: string, address_id: string, data: any) {
  return httpClient.put(`${BASE_URL}/${property_id}/locations/${address_id}`, data);
}

// Eliminar localizacion
export async function DeleteLocation(property_id: string, address_id: string) {
  return httpClient.delete(`${BASE_URL}/${property_id}/locations/${address_id}`);
}

// Lista de estados
export async function GetEstados() {
  const response = await fetch('https://cp.terio.dev/v1/estados', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  const json = await response.json();

  // Normalizar la respuesta para devolver siempre un array de estados en `data`
  let estadosArray: any[] = [];
  if (json?.datos && Array.isArray(json.datos)) {
    estadosArray = json.datos;
  } else if (json?.data?.datos && Array.isArray(json.data.datos)) {
    estadosArray = json.data.datos;
  } else if (json?.data && Array.isArray(json.data)) {
    estadosArray = json.data;
  } else if (Array.isArray(json)) {
    estadosArray = json;
  } else if (json?.estados && Array.isArray(json.estados)) {
    estadosArray = json.estados;
  }

  return { data: estadosArray };
}

// Lista de ciudades por estado
export async function GetCiudades(state_id: string) {
  const response = await fetch(`https://cp.terio.dev/v1/estados/${state_id}/ciudades`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  const json = await response.json();

  // Normalizar la respuesta para devolver siempre un array de ciudades en `data`
  let ciudadesArray: any[] = [];
  if (json?.datos && Array.isArray(json.datos)) {
    ciudadesArray = json.datos;
  } else if (json?.data?.datos && Array.isArray(json.data.datos)) {
    ciudadesArray = json.data.datos;
  } else if (json?.data && Array.isArray(json.data)) {
    ciudadesArray = json.data;
  } else if (Array.isArray(json)) {
    ciudadesArray = json;
  } else if (json?.ciudades && Array.isArray(json.ciudades)) {
    ciudadesArray = json.ciudades;
  }

  return { data: ciudadesArray };
}
