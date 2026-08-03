import { httpClient } from "@/lib/api/fetch-client";

export async function GetAllReports() {
    return httpClient.get('/api/reports');
}

export async function GetReportsProperties(params?: ClientsReportParams) {
    const query = new URLSearchParams();
    if (params) {
        if (params.year !== undefined && params.year !== null && params.year !== 0) query.append('year', String(params.year));
        if (params.month !== undefined && params.month !== null && params.month !== 0) query.append('month', String(params.month));
        if (params.date_from) query.append('date_from', params.date_from);
        if (params.date_to) query.append('date_to', params.date_to);
    }
    const queryString = query.toString();
    return httpClient.get(`/api/reports/properties${queryString ? `?${queryString}` : ''}`);
}

export interface ClientsReportParams {
    year?: number;
    month?: number;
    date_from?: string;
    date_to?: string;
}

export async function GetReportsClients(params?: ClientsReportParams) {
    const query = new URLSearchParams();
    if (params) {
        if (params.year !== undefined && params.year !== null && params.year !== 0) query.append('year', String(params.year));
        if (params.month !== undefined && params.month !== null && params.month !== 0) query.append('month', String(params.month));
        if (params.date_from) query.append('date_from', params.date_from);
        if (params.date_to) query.append('date_to', params.date_to);
    }
    const queryString = query.toString();
    return httpClient.get(`/api/reports/clients${queryString ? `?${queryString}` : ''}`);
}

export async function GetReportsClientsPDF() {
    return httpClient.get('/api/reports/clients/pdf');
}

export async function GetReportsAdminActivity() {
    return httpClient.get('/api/reports/admin-activity');
}

export async function GetReportsById(report_id: string) {
    return httpClient.get(`/api/reports/${report_id}`);
}

export async function GetReportsDownloadPdf(report_id: string) {
    return httpClient.get(`/api/reports/${report_id}/download/pdf`);
}

export async function GetReportsDownloadHTML(report_id: string) {
    return httpClient.get(`/api/reports/${report_id}/download/html`);
}

export async function GetReportsByDatePdf() {
    return httpClient.get(`/api/reports/download/by-date/pdf`);
}

export async function GetReportsByDateHTML() {
    return httpClient.get(`/api/reports/download/by-date/html`);
}