"use client"

import React, { useState, useEffect } from 'react';
import { X, Bell, Home, UserPlus, ShieldCheck, ImageIcon } from 'lucide-react';
import { Tag } from './badges';

interface Notification {
    id: string;
    type: 'property' | 'lead' | 'system' | 'image';
    title: string;
    description: string;
    timestamp: string;
    tags: string[];
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'property',
        title: 'Nueva propiedad publicada',
        description: 'Casa en Condesa, CDMX ahora es visible en la web para venta.',
        timestamp: 'hace 5 min',
        tags: ['Propiedades', 'Publicada'],
        read: false
    },
    {
        id: '2',
        type: 'lead',
        title: 'Nuevo lead registrado',
        description: 'Juan Pérez está interesado en Departamento en Polanco, CDMX',
        timestamp: 'hace 12 min',
        tags: ['Leads', 'Nuevo'],
        read: false
    },
    {
        id: '3',
        type: 'system',
        title: 'Usuario creado correctamente',
        description: 'Se creó el usuario "Agente Norte" con el rol "Agente inmobiliario"',
        timestamp: 'hace 1 h',
        tags: ['Sistema', 'Usuarios'],
        read: false
    },
    {
        id: '4',
        type: 'image',
        title: 'Imágenes actualizadas',
        description: 'Se reemplazaron 5 fotos y se definió una nueva imagen principal para "Terreno en Querétaro"',
        timestamp: 'hace 3 h',
        tags: ['Propiedades', 'Imágenes'],
        read: false
    },
    {
        id: '5',
        type: 'property',
        title: 'Propiedad desactivada',
        description: '',
        timestamp: 'ayer',
        tags: ['Propiedades'],
        read: true
    }
];

type FilterType = 'all' | 'unread' | 'property' | 'lead' | 'system';

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'property':
            return <Home className="w-5 h-5 text-blue-600" />;
        case 'lead':
            return <UserPlus className="w-5 h-5 text-green-600" />;
        case 'system':
            return <ShieldCheck className="w-5 h-5 text-purple-600" />;
        case 'image':
            return <ImageIcon className="w-5 h-5 text-orange-600" />;
        default:
            return <Bell className="w-5 h-5 text-gray-600" />;
    }
};

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
    const [filter, setFilter] = useState<FilterType>('all');
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.read;
        if (filter === 'property') return notif.type === 'property' || notif.tags.includes('Propiedades');
        if (filter === 'lead') return notif.type === 'lead' || notif.tags.includes('Leads');
        if (filter === 'system') return notif.type === 'system' || notif.tags.includes('Sistema');
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const filters: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'Todas' },
        { id: 'unread', label: 'Sin leer' },
        { id: 'property', label: 'Propiedades' },
        { id: 'lead', label: 'Leads' },
        { id: 'system', label: 'Sistema' }
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Notificaciones</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Resumen de actividad reciente en tu inmobiliaria
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 pt-4 pb-3 border-b border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
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
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No hay notificaciones</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border transition-all ${notification.read
                                        ? 'bg-white border-gray-200'
                                        : 'bg-blue-50 border-blue-200'
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                {notification.title}
                                            </h3>
                                            {notification.description && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {notification.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-xs text-gray-500">
                                                    {notification.timestamp}
                                                </span>
                                                <div className="flex gap-2 flex-wrap">
                                                    {notification.tags.map((tag, idx) => (
                                                        <Tag
                                                            key={idx}
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
                    >
                        Marcar todas como leídas
                    </button>
                    <button
                        onClick={() => {
                            // Navegar al centro de notificaciones
                            onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-primary_color text-white rounded-lg font-medium hover:opacity-90 transition-all"
                    >
                        Ver centro de notificaciones
                    </button>
                </div>
            </div>
        </>
    );
}

export default NotificationsModal;
