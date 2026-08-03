export type NotificationCategory =
  | 'PROPERTIES'
  | 'LEADS'
  | 'SYSTEM'
  | 'USERS'
  | 'SALES'
  | 'VISITS'
  | string;

export type NotificationType =
  | 'PROPERTY_CREATED'
  | 'PROPERTY_UPDATED'
  | 'PROPERTY_PUBLISHED'
  | 'PROPERTY_DEACTIVATED'
  | 'IMAGES_UPDATED'
  | 'LEAD_CREATED'
  | 'GENERAL_CONTACT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'VISIT_CREATED'
  | 'SALE_CREATED'
  | 'SYSTEM_EVENT'
  | string;

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: NotificationCategory;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  unreadCount: number;
}

export interface NotificationQueryParams {
  page?: number;
  pageSize?: number;
  category?: NotificationCategory;
  unread?: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationSuccessResponse {
  success: boolean;
  message: string;
}
