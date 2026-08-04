"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { User } from "@/lib/@type";
import { getUserImageUrl } from "@/lib/utils";
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    User as UserIcon
} from "lucide-react";

interface ProfileHeaderProps {
    user?: User | null;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const fullName = [
        user?.name,
        user?.paternal_last_name,
        user?.maternal_last_name
    ].filter(Boolean).join(" ").trim() || "Usuario";

    const roleName = typeof user?.role === 'object' && user?.role !== null
        ? user.role.name
        : (user?.role || 'Agente');

    const addressObj = typeof user?.address === 'object' && user?.address !== null ? user.address : {};
    const neighborhood = addressObj?.neighborhood ?? (addressObj as any)?.colonia ?? (user as any)?.neighborhood ?? (user as any)?.colonia;
    const city = addressObj?.city ?? (addressObj as any)?.ciudad ?? user?.city ?? (user as any)?.ciudad;
    const state = addressObj?.state ?? (addressObj as any)?.estado ?? user?.state ?? (user as any)?.estado;

    const locationText = [
        neighborhood,
        city,
        state
    ].filter(Boolean).join(", ") || "México";

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
                year: "numeric"
            }).replace(".", "");
        } catch {
            return dateString;
        }
    };

    return (
        <div className="w-full bg-white rounded-lg p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    {/* Avatar del usuario con silueta */}
                    <div className="relative group">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                            {user?.profile_picture ? (
                                <Image
                                    src={getUserImageUrl(user.profile_picture)}
                                    alt={fullName}
                                    fill
                                    sizes="96px"
                                    unoptimized={true}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (target && !target.src.endsWith('/user.svg')) {
                                            target.src = '/user.svg';
                                        }
                                    }}
                                    className="object-cover"
                                />
                            ) : (
                                <UserIcon className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500" />
                            )}
                        </div>
                    </div>

                    {/* Información Principal y Badges */}
                    <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                {fullName}
                            </h1>
                            <span className="text-xs text-gray-400 font-mono font-medium">
                                #{user?.id || '5'}
                            </span>
                        </div>

                        {/* Badges de Rol y Estado */}
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                <ShieldCheck size={13} className="text-blue-600" />
                                {roleName}
                            </span>

                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                user?.is_active !== false
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                                {user?.is_active !== false ? (
                                    <>
                                        <CheckCircle2 size={12} className="text-emerald-600" />
                                        Activo
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={12} className="text-red-600" />
                                        Inactivo
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metadatos en cuadrícula responsiva */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm text-gray-600">
                {/* Correo */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                        <Mail size={16} />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-[11px] text-gray-400 font-medium">Correo electrónico</span>
                        <span className="text-gray-800 font-semibold truncate block">{user?.email || "-"}</span>
                    </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                        <Phone size={16} />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-[11px] text-gray-400 font-medium">Teléfono de contacto</span>
                        <span className="text-gray-800 font-semibold truncate block">{user?.phone || "-"}</span>
                    </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                        <MapPin size={16} />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-[11px] text-gray-400 font-medium">Ubicación</span>
                        <span className="text-gray-800 font-semibold truncate block">{locationText}</span>
                    </div>
                </div>

                {/* Miembro desde */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                        <Calendar size={16} />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-[11px] text-gray-400 font-medium">Miembro desde</span>
                        <span className="text-gray-800 font-semibold truncate block">{formatDate(user?.created_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
