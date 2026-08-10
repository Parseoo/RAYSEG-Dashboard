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
import { formatInterestLabel } from '@/lib/utils/catalog';

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

                {/* CONTACT INFO */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader title="Contacto" icon={Mail} />
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Mail size={16} /></div>
                            <InfoBlock label="Correo electrónico" value={clientData.email} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600"><Phone size={16} /></div>
                            <InfoBlock label="Teléfono" value={clientData.phone} />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><MessageSquare size={16} /></div>
                            <InfoBlock label="WhatsApp" value={clientData.whatsapp} />
                        </div>
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

                {/* PROPIEDADES VINCULADAS */}
                <div className='bg-white rounded-lg p-5 shadow-md border border-slate-200'>
                    <SectionHeader 
                        title="Propiedad Vinculada" 
                        icon={Home} 
                        extra={
                            clientData.linked_properties !== undefined && clientData.linked_properties > 0 ? (
                                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                                    {clientData.linked_properties} vinculada(s)
                                </span>
                            ) : null
                        } 
                    />
                    {propertyLoading ? (
                        <div className="flex items-center gap-3 text-slate-500 py-4">
                            <Loader2 className="w-5 h-5 text-primary_color animate-spin" />
                            <span className="text-sm font-medium">Cargando información de la propiedad...</span>
                        </div>
                    ) : (propertyData || clientData.property) ? (
                        (() => {
                            const prop = propertyData || clientData.property;
                            const propId = prop.id || prop.property_id;
                            const addressObj = prop.address && Array.isArray(prop.address) ? prop.address[0] : (prop.address || {});
                            const fullAddr = prop.location || addressObj.full_address || [addressObj.street, addressObj.street_number, addressObj.neighborhood, addressObj.city, addressObj.state].filter(Boolean).join(', ');
                            
                            // Images:
                            let imgUrl = '/property.jpg';
                            if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
                                const mainImg = prop.images.find((img: any) => img.is_main) || prop.images[0];
                                if (mainImg && mainImg.image) {
                                    imgUrl = getImageUrl(mainImg.image);
                                } else if (typeof mainImg === 'string') {
                                    imgUrl = getImageUrl(mainImg);
                                }
                            } else if (prop.main_image) {
                                imgUrl = getImageUrl(prop.main_image);
                            } else if (prop.mainImage) {
                                imgUrl = getImageUrl(prop.mainImage);
                            }

                            return (
                                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="relative w-full md:w-32 h-32 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
                                        <Image
                                            src={imgUrl}
                                            alt={prop.title || 'Propiedad'}
                                            fill
                                            unoptimized={true}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (target && !target.src.endsWith('/property.jpg') && !target.src.endsWith('/casa.jpeg')) {
                                                    target.src = '/property.jpg';
                                                }
                                            }}
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 128px"
                                        />
                                    </div>
                                    <div className="flex-1 w-full min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            {prop.operation_type && (
                                                <Tag status={prop.operation_type === 'sale' ? 'Venta' : 'Renta'}>
                                                    {prop.operation_type === 'sale' ? 'Venta' : 'Renta'}
                                                </Tag>
                                            )}
                                            {prop.property_status && (
                                                <Tag status={prop.property_status} statusType="property">
                                                    {prop.property_status}
                                                </Tag>
                                            )}
                                            {prop.number_mls && (
                                                <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-slate-200 rounded-md">
                                                    MLS: {prop.number_mls}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 truncate mb-1">
                                            {prop.title || `Propiedad ID: ${propId}`}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-2 truncate">
                                            <MapPin size={14} className="text-slate-400" />
                                            {fullAddr || 'Sin dirección registrada'}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-600">
                                            {prop.rooms !== undefined && prop.rooms > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <BedDouble size={14} className="text-slate-400" />
                                                    {prop.rooms} {prop.rooms === 1 ? 'Habitación' : 'Habitaciones'}
                                                </span>
                                            )}
                                            {prop.bathrooms !== undefined && prop.bathrooms > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Bath size={14} className="text-slate-400" />
                                                    {prop.bathrooms} {prop.bathrooms === 1 ? 'Baño' : 'Baños'}
                                                </span>
                                            )}
                                            {prop.parking_spaces !== undefined && prop.parking_spaces > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Car size={14} className="text-slate-400" />
                                                    {prop.parking_spaces} {prop.parking_spaces === 1 ? 'Estac.' : 'Estacs.'}
                                                </span>
                                            )}
                                            {prop.construction_size !== undefined && prop.construction_size > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Ruler size={14} className="text-slate-400" />
                                                    {prop.construction_size} m²
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-3 w-full md:w-auto flex-shrink-0 self-stretch md:self-auto justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                                        {prop.price !== undefined && (
                                            <p className="text-xl font-bold text-slate-800 self-start md:self-auto">
                                                ${Number(prop.price).toLocaleString('es-MX')} MXN
                                            </p>
                                        )}
                                        <button
                                            onClick={() => router.push(`/property/${propId}`)}
                                            className="flex items-center justify-center gap-2 bg-primary_color text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm w-full md:w-auto"
                                        >
                                            <Eye size={16} /> Ver propiedad
                                        </button>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <p className="text-sm text-slate-500 italic py-2">
                            No hay propiedades vinculadas a este cliente.
                        </p>
                    )}
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
                                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 text-sm text-slate-700">
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
