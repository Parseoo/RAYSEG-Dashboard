"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Loader2, User, Mail, Phone, MapPin, Target, Wallet, Calendar, FileText, MessageSquare, Home, BedDouble, Bath, Car, Ruler, Eye } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { GetClientById } from '@/lib/api/client-api';
import { showToast } from 'nextjs-toast-notify';
import { getImageUrl } from '@/lib/utils';
import { formatInterestLabel, normalizeInterest } from '@/lib/utils/catalog';

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params?.id as string;

    const [clientData, setClientData] = useState<any>(null);
    const [propertyData, setPropertyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [propertyLoading, setPropertyLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [interestCatalog, setInterestCatalog] = useState<any[]>([]);
    const [propertyTypeCatalog, setPropertyTypeCatalog] = useState<any[]>([]);

    useEffect(() => {
        if (!clientId) return;

        const fetchClient = async () => {
            setLoading(true);
            try {
                const response = await GetClientById(clientId);
                const client = response.data;
                setClientData(client);
                
                const propId = client.property?.id || client.property_id;
                if (propId) {
                    setPropertyLoading(true);
                    try {
                        const { GetPropertyById } = await import('@/lib/api/property/property-api');
                        const propResponse = await GetPropertyById(String(propId));
                        setPropertyData(propResponse.data);
                    } catch (propErr) {
                        console.error("Error fetching linked property details:", propErr);
                    } finally {
                        setPropertyLoading(false);
                    }
                }
                
                // Fetch catalogs for labels
                try {
                    const { GetCatalogByName } = await import('@/lib/api/catalog-api');
                    const [intRes, propRes, opRes] = await Promise.all([
                        GetCatalogByName('primary_interest').catch(() => null),
                        GetCatalogByName('property-types').catch(() => null),
                        GetCatalogByName('operation-type').catch(() => null)
                    ]);
                    const intData = opRes?.data?.items || opRes?.data?.catalogItems || intRes?.data?.items || intRes?.data?.catalogItems || [];
                    setInterestCatalog(intData);
                    const propData = propRes?.data?.items || propRes?.data?.catalogItems || [];
                    setPropertyTypeCatalog(propData);
                } catch (catErr) {
                    console.error("Error fetching catalogs:", catErr);
                }
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

    const SectionHeader = ({ title, icon: Icon, extra }: { title: string, icon: any, extra?: React.ReactNode }) => (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                    <Icon size={18} />
                </div>
                <h2 className='text-sm font-bold text-gray-500 uppercase tracking-widest'>{title}</h2>
            </div>
            {extra && <div>{extra}</div>}
        </div>
    );

    const InfoBlock = ({ label, value }: { label: string, value: any }) => {
        let displayValue = '-';
        if (value !== null && value !== undefined) {
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

    return (
        <div className="pb-10">
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Clientes', href: '/clients' },
                { label: `${clientData.name || ''} ${clientData.paternal_last_name || ''}`.trim() || 'Detalle del cliente', href: `/clients/${clientId}`, active: true }
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
            <div className="w-full bg-white rounded-lg p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                        {/* Avatar circular */}
                        <div className="relative group">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                                {(clientData.profile_photo || clientData.profile_picture) ? (
                                    <Image
                                        src={getImageUrl(clientData.profile_photo || clientData.profile_picture)}
                                        alt={clientData.name}
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
                                    <div className="text-3xl font-bold text-slate-400">
                                        {clientData.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información Principal */}
                        <div className="flex flex-col gap-1.5 min-w-0 justify-center">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                    {clientData.name} {clientData.paternal_last_name} {clientData.maternal_last_name}
                                </h1>
                                <span className="text-xs text-gray-400 font-mono font-medium">
                                    CLI-{clientId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Badges con descripción estilo tags */}
                    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-6 mt-4 sm:mt-0">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado</span>
                            <Tag status={typeof clientData.client_status === 'string' ? clientData.client_status : (clientData.client_status?.value || clientData.client_status?.name || 'activo')} variant="blue" className="!px-4">
                                {typeof clientData.client_status === 'string' ? clientData.client_status : (clientData.client_status?.name || clientData.client_status?.value || 'Desconocido')}
                            </Tag>
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tipo de Cliente</span>
                            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                                {clientData.client_type_name || (typeof clientData.client_type === 'string'
                                    ? clientData.client_type.replace('_', ' ')
                                    : (clientData.client_type?.name || clientData.client_type?.value || 'Cliente'))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metadatos en cuadrícula responsiva */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                            <Mail size={16} />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] text-gray-400 font-medium">Correo electrónico</span>
                            <span className="text-gray-800 font-semibold truncate block">{clientData.email || clientData.contact?.email || "-"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                            <Phone size={16} />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] text-gray-400 font-medium">Teléfono de contacto</span>
                            <span className="text-gray-800 font-semibold truncate block">{clientData.phone || clientData.contact?.phone || "-"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                            <User size={16} />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] text-gray-400 font-medium">Agente asignado</span>
                            <span className="text-gray-800 font-semibold truncate block">{clientData.agent?.name || '-'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                            <Calendar size={16} />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] text-gray-400 font-medium">Registrado el</span>
                            <span className="text-gray-800 font-semibold truncate block">
                                {new Date(clientData.created_at || Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                            <Calendar size={16} />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] text-gray-400 font-medium">Última actualización</span>
                            <span className="text-gray-800 font-semibold truncate block">
                                {clientData.updated_at ? new Date(clientData.updated_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* PERSONAL INFO */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Información Personal" icon={User} />
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <InfoBlock label="Nombre Completo" value={clientData.name} />
                        <InfoBlock label="Tipo de Persona" value={clientData.taxpayer_type} />
                        <InfoBlock label="Identificación Fiscal" value={clientData.tax_id} />
                        <InfoBlock label="Medio de contacto preferido" value={clientData.preferred_contact} />
                        <InfoBlock label="Origen del Prospecto" value={clientData.lead_source_name || clientData.other_source || '-'} />
                    </div>
                </div>


                {/* PREFERENCES */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Preferencias de operación" icon={Target} />
                    <p className='text-sm text-gray-500 mb-6 -mt-2'>Configura que busca o que ofrece este cliente en el mercado inmobiliario.</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {(() => {
                            const rawInterest = clientData.preferences?.main_interest || clientData.main_interest;
                            const currentInterest = normalizeInterest(rawInterest);
                            const isRenta = currentInterest === 'renta' || currentInterest === 'quiero_rentar' || currentInterest === 'rent';
                            const isVenta = currentInterest === 'venta' || currentInterest === 'quiero_vender' || currentInterest === 'sale';
                            
                            const timeLabel = isVenta ? 'Plazo estimado para vender' : (isRenta ? 'Plazo estimado para rentar' : 'Plazo estimado para comprar');
                            const budgetMinLabel = isRenta ? 'Presupuesto mínimo mensual' : 'Presupuesto mínimo';
                            const budgetMaxLabel = isRenta ? 'Presupuesto máximo mensual' : 'Presupuesto máximo';

                            return (
                                <>
                                    <InfoBlock label="Interés principal" value={formatInterestLabel(rawInterest, interestCatalog)} />
                                    <InfoBlock label="Tipo de propiedad objetivo" value={(propertyTypeCatalog.find(p => String(p.id) === String(clientData.preferences?.target_property_type || clientData.target_property_type) || String(p.value) === String(clientData.preferences?.target_property_type || clientData.target_property_type) || String(p.name) === String(clientData.preferences?.target_property_type || clientData.target_property_type))?.name) || clientData.preferences?.target_property_type || clientData.target_property_type} />
                                    {(clientData.preferences?.budget_min ?? clientData.budget_min) != null ? <InfoBlock label={budgetMinLabel} value={`$${(clientData.preferences?.budget_min ?? clientData.budget_min).toLocaleString()}`} /> : null}
                                    {(clientData.preferences?.budget_max ?? clientData.budget_max) != null ? <InfoBlock label={budgetMaxLabel} value={`$${(clientData.preferences?.budget_max ?? clientData.budget_max).toLocaleString()}`} /> : null}
                                    {(clientData.preferences?.bedrooms ?? clientData.bedrooms) != null ? <InfoBlock label="Recámaras" value={clientData.preferences?.bedrooms ?? clientData.bedrooms} /> : null}
                                    {(clientData.preferences?.bathrooms ?? clientData.bathrooms) != null ? <InfoBlock label="Baños" value={clientData.preferences?.bathrooms ?? clientData.bathrooms} /> : null}
                                    {(clientData.preferences?.parking_spaces ?? clientData.parking_spaces) != null ? <InfoBlock label="Estacionamientos" value={clientData.preferences?.parking_spaces ?? clientData.parking_spaces} /> : null}
                                    {(clientData.preferences?.payment_method ?? clientData.payment_method) != null ? <InfoBlock label="Forma de pago" value={clientData.preferences?.payment_method ?? clientData.payment_method} /> : null}
                                    {(clientData.preferences?.estimated_time ?? clientData.estimated_time) != null ? <InfoBlock label={timeLabel} value={clientData.preferences?.estimated_time ?? clientData.estimated_time} /> : null}
                                </>
                            );
                        })()}
                    </div>
                </div>


                {/* LOCATION */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Ubicación" icon={MapPin} />
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        <InfoBlock label="Estado" value={clientData.address?.state} />
                        <InfoBlock label="Ciudad" value={clientData.address?.city} />
                        <InfoBlock label="Colonia" value={clientData.address?.neighborhood} />
                        <InfoBlock label="Código Postal" value={clientData.address?.postal_code} />
                        <div className="sm:col-span-2 lg:col-span-4">
                            <InfoBlock label="Dirección Completa" value={clientData.address?.full_address} />
                        </div>
                    </div>
                </div>

                {/* EXTRA INFO */}
                {(clientData.message || clientData.internal_notes) && (
                    <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                        <SectionHeader title="Información Adicional" icon={FileText} />
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            {clientData.message && (
                                <div>
                                    <p className='text-[11px] font-bold text-gray-400 uppercase leading-none mb-2'>Mensaje del Cliente</p>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 italic">
                                        &ldquo;{clientData.message}&rdquo;
                                    </div>
                                </div>
                            )}
                            {clientData.internal_notes && (
                                <div>
                                    <p className='text-[11px] font-bold text-gray-400 uppercase leading-none mb-2'>Notas Internas</p>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700">
                                        {clientData.internal_notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
