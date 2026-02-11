import { httpClient } from "@/lib/api/fetch-client";

export async function GetAllCatalogs() {
    return httpClient.get('/api/catalogs');
}

export async function CreateCatalog(data: any) {
    return httpClient.post('/api/catalogs', data);
}

export async function GetCatalogPropertyTypes() {
    return httpClient.get('/api/catalogs/property-types');
}

export async function GetCatalogAmenities() {
    return httpClient.get('/api/catalogs/amenities');
}

export async function CreateCatalogItems(data: any) {
    return httpClient.post('/api/catalogs/items', data);
}

export async function GetCatalogByName(name: string) {
    return httpClient.get(`/api/catalogs/${name}`);
}