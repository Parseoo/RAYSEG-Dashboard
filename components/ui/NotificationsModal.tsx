"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Bell, Home, UserPlus, ShieldCheck, ImageIcon, Users, DollarSign, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Tag } from './badges';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { NotificationCategory, NotificationItem } from '@/lib/types/notifications';

type FilterType = 'all' | 'unread' | (string & {});

const getCategoryLabel = (category: string): string => {
    const upper = (category || '').toUpperCase();
    if (categoryLabels[upper]) {
        return categoryLabels[upper];
    }
    const clean = category.trim();
    if (!clean) return category;
    return clean
        .split(/[\s_]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
};

const getNotificationIcon = (category?: string, type?: string) => {
    const cat = (category || '').toUpperCase();
    const typ = (type || '').toUpperCase();

    if (typ === 'IMAGES_UPDATED') {
        return <ImageIcon className="w-5 h-5 text-orange-600" />;
    }
    if (cat === 'PROPERTIES' || typ.startsWith('PROPERTY')) {
        return <Home className="w-5 h-5 text-blue-600" />;
    }
    if (cat === 'LEADS' || typ.startsWith('LEAD') || typ === 'GENERAL_CONTACT') {
        return <UserPlus className="w-5 h-5 text-green-600" />;
    }
    if (cat === 'USERS' || typ.startsWith('USER')) {
        return <Users className="w-5 h-5 text-indigo-600" />;
    }
    if (cat === 'SALES' || typ.startsWith('SALE')) {
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
    }
    if (cat === 'VISITS' || typ.startsWith('VISIT')) {
        return <Calendar className="w-5 h-5 text-amber-600" />;
    }
    if (cat === 'SYSTEM' || typ.startsWith('SYSTEM')) {
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
    }
    return <Bell className="w-5 h-5 text-gray-600" />;
};

const categoryLabels: Record<string, string> = {
    PROPERTIES: 'Propiedades',
    LEADS: 'Leads',
    SYSTEM: 'Sistema',
    USERS: 'Usuarios',
    SALES: 'Ventas',
    VISITS: 'Visitas',
};

const typeLabels: Record<string, string> = {
    PROPERTY_CREATED: 'Creada',
    PROPERTY_UPDATED: 'Actualizada',
    PROPERTY_PUBLISHED: 'Publicada',
    PROPERTY_DEACTIVATED: 'Desactivada',
    IMAGES_UPDATED: 'Imágenes',
    LEAD_CREATED: 'Nuevo',
    GENERAL_CONTACT: 'Contacto',
    USER_CREATED: 'Usuario creado',
    USER_UPDATED: 'Usuario actualizado',
    VISIT_CREATED: 'Visita',
    SALE_CREATED: 'Venta',
    SYSTEM_EVENT: 'Sistema',
};

const getNotificationTags = (notification: NotificationItem): string[] => {
    const tags: string[] = [];
    const cat = (notification.category || '').toUpperCase();
    const typ = (notification.type || '').toUpperCase();

    if (categoryLabels[cat]) {
        tags.push(categoryLabels[cat]);
    } else if (notification.category) {
        tags.push(notification.category);
    }

    if (typeLabels[typ]) {
        tags.push(typeLabels[typ]);
    }

    if (notification.metadata && Array.isArray(notification.metadata.tags)) {
        tags.push(...notification.metadata.tags);
    }

    return Array.from(new Set(tags));
};

const formatTimestamp = (dateStr?: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'hace un momento';
    if (diffMin < 60) return `hace ${diffMin} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;

    return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: Readonly<NotificationsModalProps>) {
    const [filter, setFilter] = useState<FilterType>('all');
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);

    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead
    } = useNotificationStore();

    useEffect(() => {
        if (notifications.length > 0) {
            const cats = Array.from(
                new Set(
                    notifications
                        .map((n) => n.category)
                        .filter((c): c is string => Boolean(c && typeof c === 'string'))
                )
            );

            setAvailableCategories((prev) => {
                if (filter === 'all' || filter === 'unread' || prev.length === 0) {
                    return cats;
                }
                return Array.from(new Set([...prev, ...cats]));
            });
        }
    }, [notifications, filter]);

    const loadFilteredNotifications = useCallback((selectedFilter: FilterType) => {
        let category: NotificationCategory | undefined = undefined;
        let unread: boolean | undefined = undefined;

        if (selectedFilter === 'unread') {
            unread = true;
        } else if (selectedFilter !== 'all') {
            category = selectedFilter;
        }

        fetchNotifications({
            page: 1,
            pageSize: 50,
            category,
            unread
        });
    }, [fetchNotifications]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            loadFilteredNotifications(filter);
            fetchUnreadCount();
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, filter, loadFilteredNotifications, fetchUnreadCount]);

    const handleFilterClick = (newFilter: FilterType) => {
        setFilter(newFilter);
        loadFilteredNotifications(newFilter);
    };

    const filters: { id: FilterType; label: string }[] = useMemo(() => {
        const list: { id: FilterType; label: string }[] = [
            { id: 'all', label: 'Todas' },
            { id: 'unread', label: 'Sin leer' }
        ];

        availableCategories.forEach((cat) => {
            list.push({
                id: cat,
                label: getCategoryLabel(cat)
            });
        });

        return list;
    }, [availableCategories]);

    const displayedFilters = useMemo(() => {
        if (showAllFilters) return filters;
        const initial = filters.slice(0, 3);
        if (!initial.some((f) => f.id === filter)) {
            const active = filters.find((f) => f.id === filter);
            if (active) return [...initial, active];
        }
        return initial;
    }, [showAllFilters, filter, filters]);

    const renderNotificationsContent = () => {
        if (isLoading && notifications.length === 0) {
            return (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="p-4 rounded-lg border border-gray-200 animate-pulse bg-gray-50">
                            <div className="flex gap-4">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (error && notifications.length === 0) {
            return (
                <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-3">{error}</p>
                    <button
                        type="button"
                        onClick={() => loadFilteredNotifications(filter)}
                        className="px-4 py-2 bg-primary_color text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        if (notifications.length === 0) {
            return (
                <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay notificaciones</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {notifications.map((notification) => {
                    const tags = getNotificationTags(notification);
                    return (
                        <button
                            key={notification.id}
                            type="button"
                            onClick={() => {
                                if (!notification.isRead) {
                                    markAsRead(notification.id);
                                }
                            }}
                            className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${notification.isRead
                                ? 'bg-white border-gray-200 hover:border-gray-300'
                                : 'bg-blue-50/70 border-blue-200 hover:border-blue-300 shadow-sm'
                                }`}
                        >
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                    {getNotificationIcon(notification.category, notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                            {notification.title}
                                        </h3>
                                        {!notification.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                        )}
                                    </div>
                                    {notification.message && (
                                        <p className="text-sm text-gray-600 mb-3">
                                            {notification.message}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-xs text-gray-500">
                                            {formatTimestamp(notification.createdAt)}
                                        </span>
                                        <div className="flex gap-2 flex-wrap">
                                            {tags.map((tag) => (
                                                <Tag
                                                    key={tag}
                                                    variant="gray"
                                                    className="text-xs px-2 py-0.5"
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <button
                type="button"
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity border-none p-0 cursor-default ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                aria-label="Cerrar modal"
            />

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Notificaciones</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Resumen de actividad reciente en tu inmobiliaria
                        </p>
                    </div>
                    <button type='button'
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 pt-4 pb-3 border-b border-gray-200">
                    <div className="flex flex-wrap gap-2 items-center">
                        {displayedFilters.map((f) => (
                            <button type='button'
                                key={f.id}
                                onClick={() => handleFilterClick(f.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.id
                                    ? 'bg-blue-50 text-blue-600 border-2 border-primary_color'
                                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-slate-200'
                                    }`}
                            >
                                {f.label}
                                {f.id === 'unread' && unreadCount > 0 && (
                                    <span className="ml-2 bg-primary_color text-white text-xs px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}

                        {filters.length > 3 && (
                            <button type='button'
                                onClick={() => setShowAllFilters(!showAllFilters)}
                                className="px-3.5 py-2 rounded-full text-sm font-medium transition-all bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-slate-200 flex items-center gap-1"
                            >
                                <span>{showAllFilters ? 'Ver menos' : 'Ver más'}</span>
                                {showAllFilters ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderNotificationsContent()}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200">
                    <button type='button'
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                    >
                        Marcar todas como leídas
                    </button>
                </div>
            </div>
        </>
    );
}

export default NotificationsModal;
