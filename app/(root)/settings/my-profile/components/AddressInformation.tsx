"use client";

import React from 'react';
import { MapPin, Navigation, Home, Building, Mailbox } from 'lucide-react';
import { User } from '@/lib/@type';

interface AddressInformationProps {
    user?: User | null;
}

export const AddressInformation = ({ user }: AddressInformationProps) => {
    let addressObj: Record<string, any> = {};

    if (typeof user?.address === 'string') {
        try {
            addressObj = JSON.parse(user.address);
        } catch {
            addressObj = {};
        }
    } else if (typeof user?.address === 'object' && user?.address !== null) {
        addressObj = user.address;
    }

    const street = addressObj?.street ?? (addressObj as any)?.calle ?? (user as any)?.street ?? (user as any)?.calle ?? null;
    const neighborhood = addressObj?.neighborhood ?? (addressObj as any)?.colonia ?? (user as any)?.neighborhood ?? (user as any)?.colonia ?? null;
    const city = addressObj?.city ?? (addressObj as any)?.ciudad ?? user?.city ?? (user as any)?.ciudad ?? null;
    const state = addressObj?.state ?? (addressObj as any)?.estado ?? user?.state ?? (user as any)?.estado ?? null;
    const postalCode = addressObj?.postal_code ?? (addressObj as any)?.codigo_postal ?? (user as any)?.postal_code ?? (user as any)?.codigo_postal ?? null;

    const fullAddressParts = [
        street,
        neighborhood,
        postalCode ? `C.P. ${postalCode}` : null,
        city,
        state
    ].filter(Boolean);

    return (
        <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <MapPin size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Ubicación y Domicilio</h2>
                    <p className="text-xs text-gray-500">Dirección registrada del usuario</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Colonia */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Building size={15} className="text-gray-400" />
                        Colonia
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right">
                        {neighborhood || "-"}
                    </span>
                </div>

                {/* Ciudad / Municipio */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Navigation size={15} className="text-gray-400" />
                        Ciudad / Municipio
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right">
                        {city || "-"}
                    </span>
                </div>

                {/* Estado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <MapPin size={15} className="text-gray-400" />
                        Estado
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right">
                        {state || "-"}
                    </span>
                </div>

                {/* Código Postal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-gray-100 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Mailbox size={15} className="text-gray-400" />
                        Código Postal
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right font-mono">
                        {postalCode || "-"}
                    </span>
                </div>

                {/* Calle y número */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-1">
                    <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Home size={15} className="text-gray-400" />
                        Calle y número
                    </span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-right">
                        {street || "-"}
                    </span>
                </div>
            </div>

            {/* Resumen de dirección */}
            {fullAddressParts.length > 0 && (
                <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-start gap-2.5">
                    <MapPin size={16} className="text-primary_color shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-semibold text-gray-900">Ubicación completa: </span>
                        {fullAddressParts.join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AddressInformation;
