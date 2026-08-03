import { httpClient } from "./fetch-client";
import {
    NotificationListResponse,
    NotificationQueryParams,
    NotificationSuccessResponse,
    UnreadCountResponse
} from "@/lib/types/notifications";

// Obtener la configuración General
export async function GetSettings() {
    return httpClient.get<any>(`/api/settings`);
}

// Actualizar la configuración General
export async function UpdateSettings(data: any) {
    return httpClient.patch<any>(`/api/settings`, data);
}

// Obtener la configuracion de branding 
export async function GetBranding() {
    return httpClient.get<any>(`/api/settings/branding`);
}

// Notificaciones
// Obtener la lista de notificaciones
export async function GetNotifications(params?: NotificationQueryParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params?.category) query.append('category', params.category);
    if (params?.unread !== undefined) query.append('unread', params.unread.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return httpClient.get<NotificationListResponse>(`/api/notifications${queryString}`);
}

// Obtener conteo de notificaciones sin leer
export async function GetUnreadNotificationsCount() {
    return httpClient.get<UnreadCountResponse>(`/api/notifications/unread-count`);
}

// Marcar una notificación como leída
export async function MarkNotificationAsRead(notificationId: number | string) {
    return httpClient.patch<NotificationSuccessResponse>(`/api/notifications/${notificationId}/read`);
}

// Marcar todas las notificaciones como leídas
export async function MarkAllNotificationsAsRead() {
    return httpClient.patch<NotificationSuccessResponse>(`/api/notifications/read-all`);
}


