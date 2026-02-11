import { httpClient } from "@/lib/api/fetch-client";

export async function GetAllReports() {
    return httpClient.get('/api/reports');
}

export async function GetReportsProperties() {
    return httpClient.get('/api/reports/properties');
}

export async function GetReportsClients() {
    return httpClient.get('/api/reports/clients');
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