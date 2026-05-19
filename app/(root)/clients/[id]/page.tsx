"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, User, Mail, Phone, MapPin, Target, Wallet, Calendar, FileText, MessageSquare } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { GetClientById } from '@/lib/api/client-api';
import { showToast } from 'nextjs-toast-notify';

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params?.id as string;
    
    const [clientData, setClientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clientId) return;

        const fetchClient = async () => {
            setLoading(true);
            try {
                const response = await GetClientById(clientId);
                setClientData(response.data);
            } catch (err: any) {
                console.error("Error fetching client details:", err);
                const errorMessage = err?.response?.data?.detail || "No se pudo cargar la información del cliente";
                setError(errorMessage);
                showToast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [clientId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
                <p className="text-gray-500 font-medium">Cargando información del cliente...</p>
            </div>
        );
    }

    if (error || !clientData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center max-w-md">
                    <p className="text-red-600 font-medium mb-4">{error || "Cliente no encontrado"}</p>
                    <button 
                        onClick={() => router.push('/clients')}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                <Icon size={18} />
            </div>
            <h2 className='text-sm font-bold text-gray-500 uppercase tracking-widest'>{title}</h2>
        </div>
    );

    const InfoBlock = ({ label, value }: { label: string, value: any }) => (
        <div className="flex flex-col gap-1">
            <p className='text-[11px] font-bold text-gray-400 uppercase leading-none'>{label}</p>
            <p className='text-sm font-semibold text-gray-800 break-words'>{value || '-'}</p>
        </div>
    );

    return (
        <div className="pb-10">
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Clientes', href: '/clients' },
                { label: clientData.nombre || 'Detalle', href: `/clients/${clientId}`, active: true }
            ]} />

            <div className='mb-6'>
                <button
                    onClick={() => router.push('/clients')}
                    className='flex items-center gap-2 text-gray-600 hover:text-primary_color transition-colors font-medium group'
                >
                    <div className="p-1 rounded-full group-hover:bg-slate-100">
                        <ArrowLeft size={18} />
                    </div>
                    <span className='text-sm'>Volver a la lista</span>
                </button>
            </div>

            {/* HEADER / SUMMARY */}
            <div className='bg-primary_color/5 rounded-2xl p-6 mb-8 border border-primary_color/10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary_color text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary_color/20">
                        {clientData.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{clientData.nombre}</h1>
                        <p className="text-slate-500 text-sm font-medium">#{clientData.id} • Registrado el {new Date(clientData.fecha_alta || Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Estado</span>
                        <Tag 
                            status={clientData.estatus} 
                            variant={clientData.estatus === 'activo' ? 'emerald' : 'red'}
                            className="mt-1"
                        >
                            {clientData.estatus || 'Desconocido'}
                        </Tag>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Tipo de Cliente</span>
                        <span className="text-sm font-bold text-slate-700 mt-1 capitalize">{clientData.tipo_cliente?.replace('_', ' ') || '-'}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Agente</span>
                        <span className="text-sm font-bold text-slate-700 mt-1">{clientData.agente?.nombre || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* PERSONAL INFO */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Información Personal" icon={User} />
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <InfoBlock label="Nombre Completo" value={clientData.nombre} />
                        <InfoBlock label="Tipo de Persona" value={clientData.persona_tipo} />
                        <InfoBlock label="Identificación Fiscal" value={clientData.identificacion_fiscal} />
                        <InfoBlock label="Medio de contacto preferido" value={clientData.medio_contacto_preferido} />
                    </div>
                </div>

                {/* CONTACT INFO */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Contacto" icon={Mail} />
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Mail size={16} /></div>
                            <InfoBlock label="Correo electrónico" value={clientData.contacto?.email || clientData.email} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600"><Phone size={16} /></div>
                            <InfoBlock label="Teléfono" value={clientData.contacto?.telefono || clientData.telefono} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><MessageSquare size={16} /></div>
                            <InfoBlock label="WhatsApp" value={clientData.whatsapp} />
                        </div>
                    </div>
                </div>

                {/* PREFERENCES */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Preferencias y Criterios" icon={Target} />
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        <InfoBlock label="Interés Principal" value={clientData.interes_principal} />
                        <InfoBlock label="Tipo de Propiedad" value={clientData.tipo_propiedad_objetivo} />
                        <InfoBlock label="Presupuesto Mínimo" value={clientData.presupuesto_min ? `$${clientData.presupuesto_min.toLocaleString()}` : null} />
                        <InfoBlock label="Presupuesto Máximo" value={clientData.presupuesto_max ? `$${clientData.presupuesto_max.toLocaleString()}` : null} />
                        <InfoBlock label="Recámaras" value={clientData.recamaras} />
                        <InfoBlock label="Baños" value={clientData.banos} />
                        <InfoBlock label="Estacionamientos" value={clientData.estacionamientos} />
                        <InfoBlock label="Forma de Pago" value={clientData.forma_pago} />
                        <InfoBlock label="Tiempo Estimado" value={clientData.tiempo_estimado} />
                    </div>
                </div>

                {/* LOCATION */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Ubicación" icon={MapPin} />
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        <InfoBlock label="Estado" value={clientData.direccion?.estado} />
                        <InfoBlock label="Ciudad" value={clientData.direccion?.ciudad} />
                        <InfoBlock label="Colonia" value={clientData.direccion?.colonia} />
                        <InfoBlock label="Código Postal" value={clientData.direccion?.codigo_postal} />
                        <div className="sm:col-span-2 lg:col-span-4">
                            <InfoBlock label="Dirección Completa" value={clientData.direccion?.completa} />
                        </div>
                    </div>
                </div>

                {/* EXTRA INFO */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Información Adicional" icon={FileText} />
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <div>
                            <p className='text-[11px] font-bold text-gray-400 uppercase leading-none mb-2'>Mensaje del Cliente</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 italic">
                                &quot;{clientData.mensaje || 'Sin mensaje'}&quot;
                            </div>
                        </div>
                        <div>
                            <p className='text-[11px] font-bold text-gray-400 uppercase leading-none mb-2'>Notas Internas</p>
                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 text-sm text-slate-700">
                                {clientData.notas_internas || 'Sin notas internas'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
