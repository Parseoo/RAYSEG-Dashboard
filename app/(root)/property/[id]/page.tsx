"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import {
  ArrowLeft,
  MapPin,
  Star,
  Loader2,
  Ruler,
  Maximize2,
  Bed,
  Bath,
  Car,
  Layers
} from 'lucide-react';

const DynamicIcon = ({ name, size = 14, className = '' }: { name: string, size?: number, className?: string }) => {
  if (!name) return null;
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
};

import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { Gallery } from '@/components/ui/Gallery';
import { GetPropertyById } from '@/lib/api/property/property-api';
import { PropertyDetailResponse } from '@/lib/@type';
import { showToast } from 'nextjs-toast-notify';
import { getFieldLabel } from '../inputConfig';
import { getImageUrl } from '@/lib/utils';

import dynamic from 'next/dynamic';

const MapWithMarker = dynamic(
  () => import('@/components/MapLocation/MapWithMarker'),
  { ssr: false }
);

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [property, setProperty] = useState<PropertyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await GetPropertyById(propertyId);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
        showToast.error("Error al cargar la información de la propiedad");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
        <p className="text-gray-500 font-medium">Cargando información de la propiedad...</p>
      </div>
    );
  }

  if (!property) return <div className="p-10 text-center">No se encontró la propiedad</div>;

  const addressObj = Array.isArray(property.address) ? (property.address as any)[0] || {} : property.address || {};
  const fullAddress = (property as any).full_address || `${addressObj.street || ''} ${addressObj.exterior_number || addressObj.street_number || ''}, ${addressObj.neighborhood || ''}, ${addressObj.city || ''}, ${addressObj.state || ''}${addressObj.postal_code ? `, ${addressObj.postal_code}` : ''}`.replace(/^[\s,]+|[\s,]+$/g, '');
  const locationObj = (property as any).location || addressObj;

  const mlsClean = property.number_mls ? String(property.number_mls).trim() : '';
  const mlsDisplay = mlsClean
    ? (mlsClean.toUpperCase().startsWith('MLS') ? mlsClean : `MLS-${mlsClean}`)
    : null;

  // Usar imágenes del API si existen, de lo contrario usar mocks como placeholder
  const rawImagesList: any[] = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : ((property as any).property_images || (property as any).photos || ((property as any).main_image ? [{ image: (property as any).main_image, is_main: true }] : []));

  const propertyImages = (Array.isArray(rawImagesList) && rawImagesList.length > 0)
    ? [...rawImagesList]
      .sort((a: any, b: any) => (b?.is_main ? 1 : 0) - (a?.is_main ? 1 : 0))
      .map((img: any) => {
        const path = typeof img === 'string' ? img : (img?.image || img?.file || img?.url || img?.image_url || img?.src || '');
        return getImageUrl(path);
      })
      .filter((url: string) => Boolean(url))
    : ['/property.jpg', '/casa.jpeg', '/property.jpg', '/casa.jpeg', '/property.jpg'];

  const quickStats = [
    {
      icon: Ruler,
      value: property.construction_size ? `${property.construction_size} m²` : '0 m²',
      label: 'Construcción'
    },
    {
      icon: Maximize2,
      value: property.terrain_size ? `${property.terrain_size} m²` : '0 m²',
      label: 'Terreno'
    },
    {
      icon: Bed,
      value: property.rooms !== null && property.rooms !== undefined ? String(property.rooms) : '0',
      label: 'Recámaras'
    },
    {
      icon: Bath,
      value: property.bathrooms !== null && property.bathrooms !== undefined ? String(property.bathrooms) : '0',
      label: 'Baños'
    },
    {
      icon: Car,
      value: property.parking_spaces !== null && property.parking_spaces !== undefined ? String(property.parking_spaces) : '0',
      label: 'Cochera'
    },
    {
      icon: Layers,
      value: property.floors !== null && property.floors !== undefined ? String(property.floors) : '0',
      label: 'Niveles'
    }
  ];

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Propiedades', href: '/property' },
        { label: property.title || 'Detalle de propiedad', href: `/property/${propertyId}`, active: true }
      ]} />

      {/* Botón Volver fuera de la card */}
      <div className='mb-4'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'
        >
          <ArrowLeft size={18} /> <span className='text-sm'>Volver</span>
        </button>
      </div>

      <div className='bg-white w-full rounded-lg shadow-md'>
        {/* Cabecera Principal */}
        <div className='border-b border-gray-200 p-5 sm:p-6'>
          {/* Fila superior: Título con MLS al lado y ubicación a la izquierda | Precio a la derecha */}
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              {/* Título + MLS + ID */}
              <div className='flex flex-wrap items-center gap-3 mb-2'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight break-words'>
                  {property.title}
                </h1>
                {mlsDisplay && (
                  <span className='inline-flex items-center px-3 py-1 bg-[#1B2533] text-white font-bold text-xs sm:text-sm rounded-md tracking-wider shadow-xs shrink-0'>
                    {mlsDisplay}
                  </span>
                )}
                {property.property_id && (
                  <span className='inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-200 font-medium text-xs rounded-md shrink-0'>
                    ID: {property.property_id}
                  </span>
                )}
              </div>

              {/* Ubicación */}
              <div className='flex items-center gap-1.5 text-gray-600 text-sm mb-3'>
                <MapPin size={16} className='shrink-0 text-gray-500' />
                <p className='break-words'>{fullAddress || 'Ubicación no disponible'}</p>
              </div>

              {/* Badges con descripción arriba (diseño estándar del dashboard) */}
              <div className='flex flex-wrap items-center gap-5 mt-3'>
                <div className='flex flex-col gap-1.5'>
                  <span className='text-[11px] text-gray-500 font-medium uppercase tracking-wider'>Operación</span>
                  <div>
                    <Tag status={property.operation_type === 'sale' ? 'Venta' : 'Renta'}>
                      {property.operation_type === 'sale' ? 'Venta' : 'Renta'}
                    </Tag>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <span className='text-[11px] text-gray-500 font-medium uppercase tracking-wider'>Estado Propiedad</span>
                  <div>
                    <Tag status={property.property_status || 'Disponible'} statusType="property">
                      {property.property_status || 'Disponible'}
                    </Tag>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <span className='text-[11px] text-gray-500 font-medium uppercase tracking-wider'>Publicación</span>
                  <div>
                    <Tag status={property.property_post_status?.name || 'Borrador'} statusType="publication">
                      {property.property_post_status?.name || 'Borrador'}
                    </Tag>
                  </div>
                </div>

                {property.is_featured && (
                  <div className='flex flex-col gap-1.5'>
                    <span className='text-[11px] text-gray-500 font-medium uppercase tracking-wider'>Prioridad</span>
                    <div className='inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium'>
                      <Star size={13} fill="#eab308" stroke="#eab308" />
                      Destacada
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Precio */}
            <div className='text-left lg:text-right pt-2 lg:pt-0 shrink-0'>
              <p className='text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 hidden lg:block'>
                Precio de {property.operation_type === 'sale' ? 'Venta' : 'Renta'}
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-gray-800'>
                ${Number(property.price || 0).toLocaleString('es-MX')}
                <span className='text-sm sm:text-base font-normal text-gray-500 ml-1.5'>
                  {property.operation_type === 'rent' ? '/ mes' : 'MXN'}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Specs Bar (Cuadros más compactos y limpios) */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5 mt-5 border-t border-gray-100'>
            {quickStats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className='flex flex-col items-center justify-center p-2.5 rounded-lg border border-gray-200/80 bg-gray-50/60 text-center hover:bg-gray-50 transition-colors'
                >
                  <IconComp size={18} className='text-gray-600 mb-1' strokeWidth={1.75} />
                  <span className='text-sm font-bold text-gray-900 leading-tight'>
                    {stat.value}
                  </span>
                  <span className='text-[11px] font-medium text-gray-500 mt-0.5 leading-none'>
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 sm:p-6'>
          {/* Columna Izquierda: Información General, Descripción, Amenidades, Legal */}
          <div className='lg:col-span-2 space-y-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800 mb-3'>Información general</h2>
              <p className='text-sm text-gray-500 mb-4'>Resumen de todos los datos que se muestran en la web pública y en el dashboard interno.</p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>{getFieldLabel('property_type')}</p>
                  <p className='text-sm font-medium text-gray-800'>{property.property_type?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>{getFieldLabel('operation_type')}</p>
                  <p className='text-sm font-medium text-gray-800'>{property.operation_type === 'sale' ? 'Venta' : 'Renta'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>{getFieldLabel('ambientes') || 'Ambientes'}</p>
                  <p className='text-sm font-medium text-gray-800'>{property.ambientes || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>{getFieldLabel('construction_year')}</p>
                  <p className='text-sm font-medium text-gray-800'>
                    {property.construction_year
                      ? `${property.construction_year} (${new Date().getFullYear() - property.construction_year} años)`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>{getFieldLabel('conservation_status') || 'Estado de conservación'}</p>
                  <p className='text-sm font-medium text-gray-800'>{(property as any).conservation_status || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Tipo de terreno</p>
                  <p className='text-sm font-medium text-gray-800'>{property.terrain_type?.name || 'N/A'}</p>
                </div>
              </div>

              <div className='mt-6'>
                <p className='text-xs text-gray-500 mb-1'>Descripción para la web</p>
                <p className='text-sm font-medium text-gray-800 whitespace-pre-wrap leading-relaxed'>
                  {property.description || 'Sin descripción disponible.'}
                </p>
              </div>

              <div className='mt-6'>
                <p className='text-xs text-gray-500 mb-3'>Amenidades</p>
                <div className='flex flex-wrap gap-2'>
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((item: any, idx: number) => (
                      <span
                        key={idx}
                        className='flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200'
                      >
                        {item.icon && <DynamicIcon name={item.icon} size={14} />}
                        {item.name || item}
                      </span>
                    ))
                  ) : (
                    <p className='text-xs text-gray-400 italic'>No hay amenidades registradas</p>
                  )}
                </div>
              </div>
            </div>

            <div className='border-t border-gray-200 pt-6'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>Información legal y administrativa</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Espacios exteriores</p>
                  <p className='text-sm font-medium text-gray-800'>{(property as any).outdoor_spaces || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Clave catastral / MLS</p>
                  <p className='text-sm font-medium text-gray-800'>{property.number_mls || 'N/A'}</p>
                </div>
                <div className='sm:col-span-2'>
                  <p className='text-xs text-gray-500 mb-1'>Nota interna</p>
                  <p className='text-sm font-medium text-gray-800'>{(property as any).note || 'Sin notas'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Imágenes, Planos, Mapa, Info comercial */}
          <div className='space-y-6'>
            <div>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                <h3 className='text-base font-semibold text-gray-800'>Imágenes de la propiedad</h3>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className='text-xs text-blue-600 hover:text-blue-700 font-medium'
                >
                  Ver todas
                </button>
              </div>
              <div className='space-y-2'>
                <div className='relative group cursor-pointer' onClick={() => setIsGalleryOpen(true)}>
                  <Image
                    src={propertyImages[0]}
                    alt='Principal'
                    width={400}
                    height={250}
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target && !target.src.endsWith('/property.jpg') && !target.src.endsWith('/casa.jpeg')) {
                        target.src = '/property.jpg';
                      }
                    }}
                    className='w-full h-48 object-cover rounded-lg'
                  />
                  <div className="absolute top-2 left-2 bg-[#1B2533] text-white text-sm font-medium px-4 py-1.5 rounded-full z-20">
                    Principal
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  {propertyImages.slice(1, 4).map((img, idx) => (
                    <div key={idx} className='relative cursor-pointer group' onClick={() => setIsGalleryOpen(true)}>
                      <Image
                        src={img}
                        alt={`Imagen ${idx + 2}`}
                        width={120}
                        height={120}
                        unoptimized={true}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target && !target.src.endsWith('/property.jpg') && !target.src.endsWith('/casa.jpeg')) {
                            target.src = '/property.jpg';
                          }
                        }}
                        className='w-full h-24 object-cover rounded-lg'
                      />
                      {idx === 2 && propertyImages.length > 4 && (
                        <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg'>
                          <span className='text-white text-sm font-medium'>+{propertyImages.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Planos */}
            {(property as any).plans && (property as any).plans.length > 0 && (
              <div className='border-t border-gray-200 pt-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                  <h3 className='text-base font-semibold text-gray-800'>Planos de la propiedad</h3>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                  {(property as any).plans.map((plan: any, idx: number) => (
                    <div
                      key={idx}
                      className='relative group cursor-pointer bg-gray-100 rounded-lg p-4 flex items-center justify-center h-32 hover:bg-gray-200/70 transition-colors'
                      onClick={() => window.open(getImageUrl(plan.plan || plan.file || plan.url || plan), '_blank')}
                    >
                      <span className='text-gray-600 font-medium text-sm'>Plano {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='border-t border-gray-200 pt-6'>
              <h3 className='text-base font-semibold text-gray-800 mb-3'>Ubicación en mapa</h3>
              <div className='w-full h-[300px] overflow-hidden rounded-lg border border-gray-200'>
                <MapWithMarker
                  markerPosition={
                    locationObj.latitude && locationObj.longitude
                      ? { lat: parseFloat(locationObj.latitude), lng: parseFloat(locationObj.longitude) }
                      : null
                  }
                  address={fullAddress}
                />
              </div>
            </div>

            <div className='border-t border-gray-200 pt-6'>
              <h3 className='text-base font-semibold text-gray-800 mb-4'>Información comercial</h3>
              <div className='space-y-3'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Última actualización</p>
                  <p className='text-sm font-medium text-gray-800'>
                    {property.updated_at ? new Date(property.updated_at).toLocaleDateString('es-MX') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Fecha de alta</p>
                  <p className='text-sm font-medium text-gray-800'>
                    {property.created_at ? new Date(property.created_at).toLocaleDateString('es-MX') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGalleryOpen && (
        <Gallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={propertyImages}
        />
      )}
    </>
  );
}
