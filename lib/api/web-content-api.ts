import { MessageResponse } from "../@type-permission";
import { AboutUsRequest, AboutUsResponse, FooterResponse, HomeRequest, HomeResponse, LegalPagesResponse, ServiceItem, ServicesRequest, ServicesResponse, UploadCorporateImageRequest, UploadHeaderImagesRequest } from "../@type-web";
import { httpClient } from "./fetch-client";

// Web contents - About Us
// Lista de roles
const URL_HOME = '/api/home';
const URL_ABOUT_US = '/api/about-us';
const URL_FOOTER = '/api/footer';
const URL_SERVICES = '/api/services';
const URL_LEGAL_PAGES = '/api/legal-pages';

export async function GetAboutUs() {
    return httpClient.get<AboutUsResponse>(URL_ABOUT_US);
}

// Actualizar un rol por ID
export async function UpdateAboutUs(data: AboutUsRequest) {
    return httpClient.put(URL_ABOUT_US, data);
}

// Subir imagen corporativa
export async function UploadCorporateImage(file: FormData | UploadCorporateImageRequest)  {
    return httpClient.post<MessageResponse>(`${URL_ABOUT_US}/images`, file);
}

// Eliminar imagen corporativa
export async function DeleteCorporateImage(image_id: number) {
    return httpClient.delete(`${URL_ABOUT_US}/images/${image_id}`);
}

// Web contents - Footer
// Obtener el contenido del footer
export async function GetFooter() {
    return httpClient.get<FooterResponse>(`${URL_FOOTER}`);
}

// Actualizar el contenido del footer
export async function UpdateFooter(data: FooterResponse) {
    return httpClient.put(`${URL_FOOTER}`, data);
}

// Web content -Services
// Lista de los servicios
export async function GetServices() {
    return httpClient.get<ServicesResponse>(`${URL_SERVICES}`);
}

// Actualizar los servicios
export async function UpdateServices(data: ServicesRequest) {
    return httpClient.put(`${URL_SERVICES}`, data);
}

// Subir imagen(es) de encabezado de servicios (Base64)
export async function UploadHeaderImage(data: UploadHeaderImagesRequest | { images: string[] } | string[] | string) {
    const payload = Array.isArray(data)
        ? { images: data }
        : typeof data === 'string'
            ? { images: [data] }
            : data;
    return httpClient.post<ServicesResponse>(`${URL_SERVICES}/header-image`, payload);
}

// Eliminar imagen de encabezado de servicios
export async function DeleteHeaderImage(image_id: number) {
    return httpClient.delete<{ success: boolean; message: string }>(`${URL_SERVICES}/header-image/${image_id}`);
}

// Crear un nuevo servicio
export async function CreateServiceItem(data: ServiceItem) {
    return httpClient.post<MessageResponse>(`${URL_SERVICES}/items`, data);
}

// Actualizar un servicio existente
export async function UpdateServiceItem(item_id: number, data: ServiceItem) {
    return httpClient.put<MessageResponse>(`${URL_SERVICES}/items/${item_id}`, data);
}

// Eliminar un servicio existente
export async function DeleteServiceItem(item_id: number) {
    return httpClient.delete(`${URL_SERVICES}/items/${item_id}`);
}

// Web Content - Legal Pages
// Obtener el contenido de las páginas legales
export async function GetLegalPages() {
    return httpClient.get<LegalPagesResponse>(`${URL_LEGAL_PAGES}`);
}

// Actualizar el contenido de las páginas legales
export async function UpdateLegalPages(data: LegalPagesResponse) {
    return httpClient.put(`${URL_LEGAL_PAGES}`, data);
}

// Web Content - Home
// Obtener el contenido de la página de inicio
export async function GetHome() {
    return httpClient.get<HomeResponse>(`${URL_HOME}`);
}

// Actualizar el contenido de la página de inicio
export async function UpdateHome(data: HomeRequest) {
    return httpClient.put(`${URL_HOME}`, data);
}

// Subir imagenes 
export async function UploadMainImage(file: any) {
    return httpClient.post<MessageResponse>(`${URL_HOME}/main-image`, file);
}
