"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Clock,
    CreditCard,
    ShieldCheck,
    User,
    MapPin,
    Loader2,
    Edit3,
    FileText
} from 'lucide-react';
import { getUserImageUrl } from '@/lib/utils';
import Breadcrumb from '@/components/ui/breadcrumb';
import { GetUsersById } from '@/lib/api/user-api';
import { GetListRoles } from '@/lib/api/permission-api';
import { UserResponse } from '@/lib/@type';
import { Tag } from '@/components/ui/badges';
import { Card, CardContent } from '@/components/ui/card';

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
            <Icon size={18} />
        </div>
        <h2 className='text-sm font-bold text-gray-500 uppercase tracking-widest'>{title}</h2>
    </div>
);

const InfoBlock = ({ label, value }: { label: string, value: any }) => {
    let displayValue = '-';
    if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object') {
            displayValue = value.name || value.value || value.label || JSON.stringify(value);
        } else {
            displayValue = String(value);
        }
    }
    return (
        <div className="flex flex-col gap-1">
            <p className='text-[11px] font-bold text-gray-400 uppercase leading-none'>{label}</p>
            <p className='text-sm font-semibold text-gray-800 break-words'>{displayValue}</p>
        </div>
    );
};

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;

    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await GetUsersById(Number(userId));
                setUserData(response.data);
            } catch (err: any) {
                console.error("Error fetching user details:", err);
                setError(err?.response?.data?.detail || "No se pudo cargar la información del usuario");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await GetListRoles();
                const items = res.data?.items || res.data?.catalogItems || res.data?.data || [];
                setRoles(items);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    // Get role name from API roles
    const getRoleName = (role: any) => {
        if (typeof role === 'object' && role !== null) {
            return role.name;
        }
        const found = roles.find(r => String(r.id) === String(role));
        return found ? found.name : role;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).replace('.', '');
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[450px] gap-4">
                <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
                <p className="text-gray-500 font-medium text-sm">Cargando información del usuario...</p>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[450px] gap-4">
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center max-w-md shadow-md">
                    <p className="text-red-600 font-medium mb-4 text-sm">{error || "Usuario no encontrado"}</p>
                    <button type='button'
                        onClick={() => router.push('/settings/users-permissions')}
                        className="bg-primary_color text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-md"
                    >
                        Volver a usuarios
                    </button>
                </div>
            </div>
        );
    }

    const fullName = `${userData.name || ''} ${userData.paternal_last_name || ''} ${userData.maternal_last_name || ''}`.trim() || 'Usuario';
    
    let userRoleLabel = 'Sin Rol';
    if (userData.role) {
        userRoleLabel = getRoleName(userData.role);
    } else if (userData.is_superuser) {
        userRoleLabel = 'SuperAdmin';
    } else if (userData.is_staff) {
        userRoleLabel = 'Administrador';
    }

    const isActive = userData.is_active === true || (userData.is_active as any) === 1 || String(userData.is_active).toLowerCase() === 'true' || String(userData.is_active).toLowerCase() === 'activo';

    const estado = userData.address?.state || (userData as any).estado || '-';
    const ciudad = userData.address?.city || (userData as any).ciudad || '-';
    const colonia = userData.address?.neighborhood || (userData as any).colonia || '-';
    const codigoPostal = userData.address?.postal_code || (userData as any).codigo_postal || '-';
    const calle = userData.address?.street || '-';
    const numExt = userData.address?.ext_number || '-';
    const numInt = userData.address?.int_number || '-';

    return (
        <div className="w-full max-w-[1440px] mx-auto pb-10">
            {/* Breadcrumb del sistema */}
            <Breadcrumb
                items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Configuración', href: '/settings/users-permissions' },
                    { label: 'Usuarios', href: '/settings/users-permissions' },
                    { label: fullName || 'Detalle del usuario', href: `/settings/users-permissions/${userId}`, active: true }
                ]}
            />

            {/* Barra superior de Navegación y Acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <button type='button'
                    onClick={() => router.push('/settings/users-permissions')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
                    title="Volver"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Volver a usuarios</span>
                </button>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                        href={`/settings/users-permissions/edit-user/${userId}`}
                        className="px-4 h-[40px] bg-primary_color text-white rounded-lg flex items-center justify-center gap-2 font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
                    >
                        <Edit3 size={16} /> Editar usuario
                    </Link>
                </div>
            </div>

            {/* SECCIÓN 1: Tarjeta Perfil de Usuario */}
            <Card className="mb-5 flex flex-col justify-between">
                <CardContent>
                    <div className="flex items-center gap-5">
                    {/* Avatar con fondo slate y fallback visible */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {userData.profile_picture ? (
                            <Image
                                src={getUserImageUrl(userData.profile_picture)}
                                alt={fullName}
                                fill
                                sizes="80px"
                                unoptimized={true}
                                
                                className="object-cover"
                            />
                        ) : (
                            <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                        )}
                    </div>

                    {/* Nombre, Rol y Correo */}
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                {fullName}
                            </h1>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary_color/10 text-primary_color border border-primary_color/20 shrink-0">
                                <ShieldCheck size={14} className="shrink-0" />
                                {userRoleLabel}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm mt-1.5">
                            <Mail size={15} className="text-slate-400 shrink-0" />
                            <span className="truncate">{userData.email}</span>
                        </div>
                    </div>
                </div>

                {/* Fila inferior con metadatos */}
                <div className="pt-5 mt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {/* ID de usuario */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                            <CreditCard size={16} />
                        </div>
                        <div>
                            <span className="block text-[11px] text-gray-400">ID de usuario</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">#{userData.id}</span>
                        </div>
                    </div>

                    {/* Fecha de creación */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <span className="block text-[11px] text-gray-400">Fecha de Creación</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">{formatDate(userData.created_at)}</span>
                        </div>
                    </div>

                    {/* Última actualización */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                            <Clock size={16} />
                        </div>
                        <div>
                            <span className="block text-[11px] text-gray-400">Última actualización</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">{formatDate(userData.updated_at)}</span>
                        </div>
                    </div>

                    {/* Último acceso */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                            <Clock size={16} />
                        </div>
                        <div>
                            <span className="block text-[11px] text-gray-400">Último acceso</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">
                                {formatDate(userData.last_access_date)}
                            </span>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <ShieldCheck size={16} />
                        </div>
                        <div>
                            <span className="block text-[11px] text-gray-400 mb-0.5">Estado</span>
                            <Tag status={isActive ? 'Activo' : 'Inactivo'} variant={isActive ? 'emerald' : 'red'}>
                                {isActive ? 'Activo' : 'Inactivo'}
                            </Tag>
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            {/* SECCIÓN 2: Información Detallada y Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Tarjeta: Información personal */}
                <Card>
                    <CardContent>
                        <SectionHeader title="Información Personal" icon={User} />

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0"><User size={16} /></div>
                            <InfoBlock label="Nombre Completo" value={fullName} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0"><Mail size={16} /></div>
                            <InfoBlock label="Correo Electrónico" value={userData.email} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600 shrink-0"><Phone size={16} /></div>
                            <InfoBlock label="Teléfono" value={userData.phone || '-'} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0"><CreditCard size={16} /></div>
                            <InfoBlock label="ID de Usuario" value={`#${userData.id}`} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 shrink-0"><ShieldCheck size={16} /></div>
                            <InfoBlock label="Es Superusuario" value={userData.is_superuser ? 'Sí' : 'No'} />
                        </div>
                    </div>
                    </CardContent>
                </Card>

                {/* Tarjeta: Ubicación / Dirección */}
                <Card>
                    <CardContent>
                        <SectionHeader title="Ubicación" icon={MapPin} />

                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <InfoBlock label="Estado" value={estado} />
                        <InfoBlock label="Colonia" value={colonia} />
                        <InfoBlock label="Ciudad" value={ciudad} />
                        <InfoBlock label="Código Postal" value={codigoPostal} />
                        <InfoBlock label="Calle" value={calle} />
                        <InfoBlock label="Número Exterior" value={numExt} />
                        <InfoBlock label="Número Interior" value={numInt} />
                    </div>
                    </CardContent>
                </Card>
            </div>

            {/* SECCIÓN 3: Notas Internas */}
            {userData.internal_notes && (
                <Card className="mb-5">
                    <CardContent>
                        <SectionHeader title="Notas Internas" icon={FileText} />
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{userData.internal_notes}</p>
                    </CardContent>
                </Card>
            )}

            {/* SECCIÓN 4: Permisos por pantalla (Comentado temporalmente) */}
            {/* <ViewPermissions
                userPermissions={(userData as any).permissions || {}}
                isReadOnly={true}
                roleName={userRoleLabel}
            /> */}
        </div>
    );
}
