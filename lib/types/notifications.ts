export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: string;
  type: string;
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
  category?: string;
  unread?: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationSuccessResponse {
  success: boolean;
  message: string;
}
