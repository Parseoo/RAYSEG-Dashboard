"use client";

import React from "react";
import { User as UserType } from "@/lib/@type";
import { User, Mail, Phone, Hash, Shield, CheckCircle2, XCircle } from "lucide-react";

interface PersonalInformationProps {
    user?: UserType | null;
}

export const PersonalInformation = ({ user }: PersonalInformationProps) => {
    const roleName = typeof user?.role === "object" && user?.role !== null
        ? user.role.name
        : (user?.role || "Agente");

    const fullName = [
        user?.name,
        user?.paternal_last_name,
        user?.maternal_last_name
    ].filter(Boolean).join(" ").trim() || "-";

    return (
        <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <User size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Información Personal</h2>
                    <p className="text-xs text-gray-500">Datos de cuenta y contacto</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Nombre */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <User size={15} className="text-gray-400" />
                        Nombre
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right">{fullName}</span>
                </div>

                {/* Correo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Mail size={15} className="text-gray-400" />
                        Correo
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right break-all">{user?.email || "-"}</span>
                </div>

                {/* Teléfono */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Phone size={15} className="text-gray-400" />
                        Teléfono
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right">{user?.phone || "-"}</span>
                </div>

                {/* ID de usuario */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Hash size={15} className="text-gray-400" />
                        ID de Usuario
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right font-mono">
                        #{user?.id || "-"}
                    </span>
                </div>

                {/* Rol */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Shield size={15} className="text-gray-400" />
                        Rol asignado
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right">{roleName}</span>
                </div>

                {/* Estado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                    <span className="text-gray-500 font-medium text-sm">Estado</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                    }`}>
                        {user?.is_active ? (
                            <>
                                <CheckCircle2 size={13} className="text-emerald-600" />
                                Activo
                            </>
                        ) : (
                            <>
                                <XCircle size={13} className="text-red-600" />
                                Inactivo
                            </>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
