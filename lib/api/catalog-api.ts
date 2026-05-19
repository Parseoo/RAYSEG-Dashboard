import { httpClient } from "@/lib/api/fetch-client";
import { ListCatalogItemsResponse } from "@/lib/@type";

export async function GetAllCatalogs() {
    return httpClient.get('/api/catalogs');
}

export async function CreateCatalog(data: any) {
    return httpClient.post('/api/catalogs', data);
}

export async function GetCatalogPropertyTypes() {
    return httpClient.get<ListCatalogItemsResponse>('/api/catalogs/property-types');
}

export async function GetCatalogAmenities() {
    return httpClient.get<ListCatalogItemsResponse>('/api/catalogs/amenities');
}

export async function CreateCatalogItems(data: any) {
    return httpClient.post('/api/catalogs/items', data);
}

export async function GetCatalogByName(catalog_name: string) {
    return httpClient.get<ListCatalogItemsResponse>(`/api/catalogs/${catalog_name}`);
}