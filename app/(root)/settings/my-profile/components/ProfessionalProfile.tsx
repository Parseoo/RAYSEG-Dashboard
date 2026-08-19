"use client";

import React from "react";
import { User } from "@/lib/@type";
import { Briefcase, FileText, Calendar, Clock, Building2, Users } from "lucide-react";

interface ProfessionalProfileProps {
    user?: User | null;
}

export const ProfessionalProfile = ({ user }: ProfessionalProfileProps) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) return dateString;
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
        <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Briefcase size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Perfil Profesional y Notas</h2>
                    <p className="text-xs text-gray-500">Detalles profesionales y notas internas</p>
                </div>
            </div>

            {/* Notas internas del usuario */}
            {user?.internal_notes && (
                <div className="mb-5 p-4 bg-amber-50/70 border border-amber-200/70 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 text-amber-800 font-semibold text-xs uppercase tracking-wider">
                        <FileText size={14} className="text-amber-600" />
                        Notas Internas del Sistema
                    </div>
                    <p className="text-sm text-amber-950 font-medium whitespace-pre-wrap">
                        {user.internal_notes}
                    </p>
                </div>
            )}

            {/* Descripción / Bio */}
            <div className="mb-6">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Descripción profesional
                </span>
                <p className="text-gray-700 leading-relaxed text-sm bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    {user?.description || "Agente inmobiliario especializado en la gestión, asesoría y comercialización de inmuebles residenciales y comerciales en la región de Guanajuato."}
                </p>
            </div>

            {/* Métricas / Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">
                            {user?.properties_created_count ?? 0}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Propiedades asignadas</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg">
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">
                            {user?.clients_created_count ?? 0}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Clientes registrados</div>
                    </div>
                </div>
            </div>

            {/* Metadatos de auditoría */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span>Alta: <strong className="text-gray-700">{formatDate(user?.created_at)}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <span>Actualizado: <strong className="text-gray-700">{formatDate(user?.updated_at)}</strong></span>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalProfile;
