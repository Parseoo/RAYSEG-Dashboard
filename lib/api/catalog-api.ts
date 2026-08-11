import { httpClient } from "@/lib/api/fetch-client";
import {
  CatalogListResponse,
  CatalogResponse,
  ListCatalogItemsResponse,
  ItemResponse,
  CreateCatalogRequest,
  CreateCatalogItemRequest,
  PreviewCatalogItemRequest,
  PreviewCatalogItemResponse,
  UpdateCatalogItemRequest,
  DeleteCatalogItemResponse,
  CatalogFilterParams,
  CatalogItemFilterParams
} from "@/lib/types/catalogs";

const BASE_URL = '/api/catalogs';

// Helper para convertir filtros a query string
function buildQueryParams(params?: Record<string, any>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// 1. Obtener todos los catálogos con sus elementos y paginación
export async function GetAllCatalogs(filters?: CatalogFilterParams) {
  const query = buildQueryParams(filters);
  return httpClient.get<CatalogListResponse>(`${BASE_URL}${query}`);
}

// 2. Crear un nuevo catálogo (clave autogenerada)
export async function CreateCatalog(data: CreateCatalogRequest) {
  return httpClient.post<CatalogResponse>(BASE_URL, data);
}

// 3. Obtener el catálogo de tipos de propiedad
export async function GetCatalogPropertyTypes(filters?: CatalogItemFilterParams) {
  const query = buildQueryParams(filters);
  return httpClient.get<ListCatalogItemsResponse>(`${BASE_URL}/property-types${query}`);
}

// 4. Obtener el catálogo de amenidades
export async function GetCatalogAmenities() {
  return httpClient.get<ListCatalogItemsResponse>(`${BASE_URL}/amenities`);
}

// 5. Obtener el catálogo de tipos de terreno
export async function GetPropertyTerrainTypes() {
  return httpClient.get<ListCatalogItemsResponse>(`${BASE_URL}/terrain-types`);
}

// 6. Obtener el catálogo de tipos de operación
export async function GetPropertyOperationTypes() {
  return httpClient.get<ListCatalogItemsResponse>(`${BASE_URL}/operation-types`);
}

// 7. Crear un nuevo elemento de catálogo con clave y valor autogenerados
export async function CreateCatalogItems(data: CreateCatalogItemRequest) {
  return httpClient.post<ItemResponse>(`${BASE_URL}/items`, data);
}

// 8. Previsualizar qué clave y valor se generarían para un elemento de catálogo
export async function PreviewCatalogItem(data: PreviewCatalogItemRequest) {
  return httpClient.post<PreviewCatalogItemResponse>(`${BASE_URL}/items/preview`, data);
}

// 9. Obtener catálogo por su id (con fallback si el endpoint no existe en backend)
export async function GetCatalogByID(catalog_id: string) {
  try {
    return await httpClient.get<CatalogResponse>(`${BASE_URL}/${catalog_id}`);
  } catch (error: any) {
    console.warn(`[GetCatalogByID] GET ${BASE_URL}/${catalog_id} retornó ${error?.response?.status || 'error'}. Usando fallback local.`);
    return {
      status: 200,
      data: {
        catalogoID: Number(catalog_id),
        catalogItems: [],
      } as any,
      headers: new Headers(),
    };
  }
}

// Helper de compatibilidad: Busca un catálogo por nombre y luego obtiene sus detalles por ID
export async function GetCatalogByName(catalog_name: string) {
  try {
    const allCatalogs = await GetAllCatalogs({ search: catalog_name, perPage: 100 });
    const rawData: any = allCatalogs?.data;
    const catalogs = rawData?.catalogs || (Array.isArray(rawData) ? rawData : rawData?.items || []);
    const found = catalogs.find((c: any) => c.key === catalog_name || c.name === catalog_name);
    
    if (found) {
      const items = found.catalogItems || found.items || found.catalog_items || [];
      return { data: { catalogItems: items, ...found } } as any;
    }
  } catch (error) {
    console.warn(`[GetCatalogByName] Error buscando catálogo "${catalog_name}":`, error);
  }
  
  return { data: { catalogItems: [] } } as any;
}

// 10. Obtener un item de catálogo por ID
export async function GetCatalogItemByID(item_id: number | string) {
  return httpClient.get<ItemResponse>(`${BASE_URL}/catalog-items/${item_id}`);
}

// 11. Editar un item de catálogo (solo name y description)
export async function EditCatalogItem(item_id: number | string, data: UpdateCatalogItemRequest) {
  return httpClient.patch<ItemResponse>(`${BASE_URL}/catalog-items/${item_id}`, data);
}

// 12. Eliminar un item de catálogo por ID (soft delete con protección de sistema)
export async function DeleteCatalogItem(item_id: number | string) {
  return httpClient.delete<DeleteCatalogItemResponse>(`${BASE_URL}/catalog-items/${item_id}`);
}



