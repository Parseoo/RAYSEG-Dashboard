"use client"

import { useEffect, useState } from 'react';
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
  const [activeMedia, setActiveMedia] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [property, setProperty] = useState<PropertyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPlanGalleryOpen, setIsPlanGalleryOpen] = useState(false);

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

  const getRawImagesList = (prop: any): any[] => {
    if (!prop) return [];
    if (Array.isArray(prop.images) && prop.images.length > 0) {
      return prop.images;
    }
    if (prop.property_images) return prop.property_images;
    if (prop.photos) return prop.photos;
    if (prop.main_image) return [{ image: prop.main_image, is_main: true }];
    return [];
  };

  const rawImagesList: any[] = getRawImagesList(property);

  const propertyMedia = (Array.isArray(rawImagesList) && rawImagesList.length > 0)
    ? [...rawImagesList]
      .sort((a: any, b: any) => (b?.is_main ? 1 : 0) - (a?.is_main ? 1 : 0))
      .map((img: any) => {
        const path = typeof img === 'string' ? img : (img?.image || img?.file || img?.url || img?.image_url || img?.src || '');
        return {
          url: getImageUrl(path),
          isMain: Boolean(img?.is_main || img?.isMain || false)
        };
      })
      .filter((img) => Boolean(img.url))
    : [];

  const plansMedia = property && (property as any).plans && Array.isArray((property as any).plans)
    ? (property as any).plans.map((p: any) => ({
      url: getImageUrl(p.plan || p.file || p.url || p),
      isMain: false,
      isPlan: true
    }))
    : [];

  const Calendar = (LucideIcons as any).Calendar || (LucideIcons as any).CalendarDays;
  const MapIcon = (LucideIcons as any).Map || (LucideIcons as any).MapPin;
  const Trees = (LucideIcons as any).Trees || (LucideIcons as any).Flower;
  const Award = (LucideIcons as any).Award || (LucideIcons as any).Trophy;
  const Home = (LucideIcons as any).Home;

  useEffect(() => {
    if (propertyMedia.length > 0) {
      setActiveMedia(propertyMedia[0]);
    }
    if (plansMedia.length > 0) {
      setActivePlan(plansMedia[0]);
    }
  }, [property]);

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
  const rawLat = locationObj?.latitude || addressObj?.latitude || (property as any).latitude;
  const rawLng = locationObj?.longitude || addressObj?.longitude || (property as any).longitude;
  const hasCoords = rawLat && rawLng && !Number.isNaN(Number.parseFloat(rawLat)) && !Number.isNaN(Number.parseFloat(rawLng)) && Number.parseFloat(rawLat) !== 0;

  const mlsClean = property.number_mls ? String(property.number_mls).trim() : '';
  let mlsDisplay: string | null = null;
  if (mlsClean) {
    mlsDisplay = mlsClean.toUpperCase().startsWith('MLS') ? mlsClean : `MLS-${mlsClean}`;
  }

  const operationTypeDisplay = typeof property.operation_type === 'object' && property.operation_type !== null
    ? (property.operation_type as any).name
    : property.operation_type;

  const propertyStatusDisplay = typeof property.property_status === 'object' && property.property_status !== null
    ? (property.property_status as any).name
    : property.property_status;

  const checkIsFeatured = (val: any): boolean => {
    if (!val) return false;
    if (val === true || val === 1) return true;
    if (typeof val === 'string') {
      const lower = val.trim().toLowerCase();
      return lower === 'true' || lower === '1';
    }
    return false;
  };

  const formatConservationStatus = (raw: any): string => {
    if (!raw) return '';
    if (typeof raw === 'object' && raw !== null) {
      return raw.name || raw.value || raw.key || '';
    }
    const str = String(raw).trim();
    const lower = str.toLowerCase();
    const translations: Record<string, string> = {
      excellent: 'Excelente',
      excelente: 'Excelente',
      good: 'Bueno',
      bueno: 'Bueno',
      new: 'Nuevo',
      nuevo: 'Nuevo',
      regular: 'Regular',
      remodelado: 'Remodelado',
      renovated: 'Remodelado',
      bad: 'Malo',
      malo: 'Malo',
      needs_renovation: 'Para remodelar',
      para_remodelar: 'Para remodelar',
    };
    if (translations[lower]) return translations[lower];
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Propiedades', href: '/property' },
        { label: property.title || 'Detalle de propiedad', href: `/property/${propertyId}`, active: true }
      ]} />

      <div className='mb-4'>
        <button type='button'
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'
        >
          <ArrowLeft size={18} /> <span className='text-sm'>Volver</span>
        </button>
      </div>

      <div className='bg-white w-full rounded-lg shadow-md'>
        <div className='border-b border-gray-200 p-5 sm:p-6'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              <div className='flex flex-wrap items-center gap-3 mb-2'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight break-words'>
                  {property.title}
                </h1>
                {mlsDisplay && (
                  <span className='inline-flex items-center px-3 py-1 bg-[#1B2533] text-white font-bold text-xs sm:text-sm rounded-md tracking-wider shadow-xs shrink-0'>
                    {mlsDisplay}
                  </span>
                )}
              </div>

              <div className='flex items-center gap-1.5 text-gray-600 text-sm mb-3'>
                <MapPin size={16} className='shrink-0 text-gray-500' />
                <p className='break-words'>{fullAddress || 'Ubicación no disponible'}</p>
              </div>

              <div className='flex flex-wrap items-center gap-5 mt-3'>
                <div className='flex flex-col gap-1.5'>
                  <span className='text-[11px] text-gray-500 font-medium uppercase tracking-wider'>Operación</span>
                  <div>
                    <Tag status={operationTypeDisplay}>
                      {operationTypeDisplay}
                    </Tag>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <span className='text-[11px] text-gray-500 font-medium uppercase tracking-wider'>Estado Propiedad</span>
                  <div>
                    <Tag status={propertyStatusDisplay} statusType="property">
                      {propertyStatusDisplay}
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

                {checkIsFeatured(property.is_featured) && (
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

            <div className='text-left lg:text-right pt-2 lg:pt-0 shrink-0'>
              <p className='text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 hidden lg:block'>
                Precio de {operationTypeDisplay}
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-gray-800'>
                ${Number(property.price || 0).toLocaleString('es-MX')}
                <span className='text-sm sm:text-base font-normal text-gray-500 ml-1.5'>
                  {String(operationTypeDisplay || '').toLowerCase() === 'renta' ? 'MXN / mes' : 'MXN'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 sm:p-6 bg-slate-50/50'>
          <div className='lg:col-span-2 space-y-6'>
            {propertyMedia.length > 0 && (
              <div className='bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs space-y-4'>
                <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs'>
                  <Image
                    src={activeMedia?.url || propertyMedia[0]?.url}
                    alt='Imagen de la propiedad'
                    fill
                    className='object-contain cursor-pointer'
                    unoptimized={true}
                    onClick={() => setIsGalleryOpen(true)}
                  />
                  {(activeMedia?.isMain || (!activeMedia && propertyMedia[0]?.isMain)) && (
                    <div className="absolute top-2 left-2 bg-[#1B2533] text-white text-sm font-medium px-4 py-1.5 rounded-full z-20">
                      Principal
                    </div>
                  )}
                </div>
                <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-thin'>
                  {propertyMedia.map((media, idx) => {
                    const isActive = activeMedia ? activeMedia.url === media.url : idx === 0;
                    return (
                      <button type='button'
                        key={media.url || `property-media-${idx}`}
                        onClick={() => setActiveMedia(media)}
                        className={`relative h-20 aspect-video rounded-lg overflow-hidden border-2 bg-slate-50 shrink-0 transition-all ${isActive ? 'border-[#2563eb] scale-95 shadow-md' : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <Image
                          src={media.url}
                          alt={`Miniatura ${idx + 1}`}
                          fill
                          className='object-contain'
                          unoptimized={true}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className='bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-xs'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>Información general</h2>
              <div className='divide-y divide-gray-100'>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Descripción</span>
                  <span className='text-gray-800 font-normal whitespace-pre-wrap'>{property.description || '—'}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Calle</span>
                  <span className='text-gray-800 font-normal'>{addressObj.street || '—'}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Número exterior</span>
                  <span className='text-gray-800 font-normal'>{addressObj.exterior_number || addressObj.street_number || '—'}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Número interior</span>
                  <span className='text-gray-800 font-normal'>{addressObj.interior_number || '—'}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Colonia / Fraccionamiento</span>
                  <span className='text-gray-800 font-normal'>{addressObj.neighborhood || '—'}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Ciudad</span>
                  <span className='text-gray-800 font-normal'>{addressObj.city || '—'}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Estado</span>
                  <span className='text-gray-800 font-normal'>{addressObj.state || '—'}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-[200px_1fr] py-3 text-sm gap-1 sm:gap-4'>
                  <span className='text-gray-500 font-medium'>Código postal</span>
                  <span className='text-gray-800 font-normal'>{addressObj.postal_code || addressObj.zip_code || '—'}</span>
                </div>
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className='bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-xs'>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                  {Award && <Award size={18} className='text-blue-600' />}
                  Amenidades
                </h2>
                <div className='flex flex-wrap gap-2.5'>
                  {property.amenities.map((item: any, idx: number) => {
                    const name = typeof item === 'object' ? item.name || item.value || item.key : String(item);
                    const iconName = typeof item === 'object' ? item.icon : null;
                    return (
                      <span
                        key={typeof item === 'object' && item.id ? item.id : `amenity-${name}-${idx}`}
                        className='inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full shadow-2xs transition-all hover:bg-blue-100'
                      >
                        {iconName ? (
                          <DynamicIcon name={iconName} size={14} className='text-blue-600' />
                        ) : (
                          <Award size={14} className='text-blue-500' />
                        )}
                        <span>{name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className='bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-xs'>
              <h2 className='text-lg font-semibold text-gray-800 mb-1'>Notas internas <span className='text-xs font-normal text-gray-400'>(solo administradores)</span></h2>
              <p className='text-sm text-gray-700 mt-4 font-normal'>{(property as any).note || 'Sin notas internas'}</p>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-xs'>
              <h3 className='text-base font-semibold text-gray-800 mb-4'>Resumen de la propiedad</h3>
              <div className='grid grid-cols-2 gap-y-4 gap-x-3 mt-4'>
                <div className='flex items-start gap-2'>
                  <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                    {Home && <Home size={16} />}
                  </div>
                  <div>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Tipo de propiedad</p>
                    <p className='text-sm font-bold text-gray-800'>{property.property_type?.name || '—'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                    <Maximize2 size={16} />
                  </div>
                  <div>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Terreno</p>
                    <p className='text-sm font-bold text-gray-800'>{property.terrain_size ? `${property.terrain_size} m²` : '—'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                    <Ruler size={16} />
                  </div>
                  <div>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Construcción</p>
                    <p className='text-sm font-bold text-gray-800'>{property.construction_size ? `${property.construction_size} m²` : '—'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                    <Bed size={16} />
                  </div>
                  <div>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Recámaras</p>
                    <p className='text-sm font-bold text-gray-800'>{property.rooms || '0'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                    <Bath size={16} />
                  </div>
                  <div>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Baños</p>
                    <p className='text-sm font-bold text-gray-800'>{property.bathrooms || '0'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                    <Car size={16} />
                  </div>
                  <div>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Cochera</p>
                    <p className='text-sm font-bold text-gray-800'>{property.parking_spaces || '0'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                    <Layers size={16} />
                  </div>
                  <div>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Niveles</p>
                    <p className='text-sm font-bold text-gray-800'>{property.floors || '0'}</p>
                  </div>
                </div>
                {Boolean(property.construction_year) && Number(property.construction_year) > 0 && (
                  <div className='flex items-start gap-2'>
                    <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                      {Calendar && <Calendar size={16} />}
                    </div>
                    <div>
                      <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Año de construcción</p>
                      <p className='text-sm font-bold text-gray-800'>
                        {property.construction_year} <span className='text-[10px] font-normal text-gray-500'>({new Date().getFullYear() - Number(property.construction_year)} años)</span>
                      </p>
                    </div>
                  </div>
                )}
                {(property as any).conservation_status && (
                  <div className='flex items-start gap-2'>
                    <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                      <Star size={16} />
                    </div>
                    <div>
                      <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Estado de conservación</p>
                      <p className='text-sm font-bold text-gray-800'>{formatConservationStatus((property as any).conservation_status)}</p>
                    </div>
                  </div>
                )}
                {property.terrain_type?.name && (
                  <div className='flex items-start gap-2'>
                    <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                      {MapIcon && <MapIcon size={16} />}
                    </div>
                    <div>
                      <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Tipo de terreno</p>
                      <p className='text-sm font-bold text-gray-800'>{property.terrain_type.name}</p>
                    </div>
                  </div>
                )}
                {property.outdoor_spaces !== undefined && property.outdoor_spaces !== null && String(property.outdoor_spaces).trim() !== '' && String(property.outdoor_spaces) !== '0' && (
                  <div className='flex items-start gap-2'>
                    <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                      {Trees && <Trees size={16} />}
                    </div>
                    <div>
                      <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Espacios exteriores</p>
                      <p className='text-sm font-bold text-gray-800'>{property.outdoor_spaces}</p>
                    </div>
                  </div>
                )}
                {property.amenities && property.amenities.length > 0 && (
                  <div className='flex items-start gap-2 col-span-2 mt-2 pt-2 border-t border-gray-100'>
                    <div className='p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0'>
                      {Award && <Award size={16} />}
                    </div>
                    <div>
                      <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5'>Amenidades</p>
                      <div className='flex flex-wrap gap-1.5'>
                        {property.amenities.map((item: any, idx: number) => {
                          const name = typeof item === 'object' ? item.name || item.value || item.key : String(item);
                          const iconName = typeof item === 'object' ? item.icon : null;
                          return (
                            <span
                              key={typeof item === 'object' && item.id ? item.id : `amenity-sm-${name}-${idx}`}
                              className='inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-200'
                            >
                              {iconName && <DynamicIcon name={iconName} size={12} className="text-blue-600" />}
                              <span>{name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {plansMedia.length > 0 && (
              <div className='bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-xs'>
                <h3 className='text-base font-semibold text-gray-800 mb-3'>Planos</h3>
                <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs mt-3'>
                  <Image
                    src={activePlan?.url || plansMedia[0]?.url}
                    alt='Plano de la propiedad'
                    fill
                    className='object-contain cursor-pointer'
                    unoptimized={true}
                    onClick={() => setIsPlanGalleryOpen(true)}
                  />
                </div>
                {plansMedia.length > 1 && (
                  <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-thin mt-4'>
                    {plansMedia.map((media: any, idx: number) => {
                      const isActive = activePlan ? activePlan.url === media.url : idx === 0;
                      return (
                        <button type='button'
                          key={media.url || `plan-${idx}`}
                          onClick={() => setActivePlan(media)}
                          className={`relative h-20 aspect-video rounded-lg overflow-hidden border-2 bg-slate-50 shrink-0 transition-all ${isActive ? 'border-[#2563eb] scale-95 shadow-md' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <Image
                            src={media.url}
                            alt={`Miniatura plano ${idx + 1}`}
                            fill
                            className='object-contain'
                            unoptimized={true}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className='bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-xs'>
              <h3 className='text-base font-semibold text-gray-800 mb-3'>Ubicación en mapa</h3>
              <div className='w-full h-[300px] overflow-hidden rounded-lg border border-gray-200 mt-3 shadow-2xs'>
                <MapWithMarker
                  markerPosition={
                    hasCoords
                      ? { lat: Number.parseFloat(rawLat), lng: Number.parseFloat(rawLng) }
                      : null
                  }
                  address={fullAddress}
                />
              </div>
            </div>

            <div className='bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-xs'>
              <h3 className='text-base font-semibold text-gray-800 mb-3'>Información comercial</h3>
              <div className='divide-y divide-gray-100 mt-4'>
                <div className='grid grid-cols-2 py-3 text-sm'>
                  <span className='text-gray-500 font-medium'>Precio de referencia</span>
                  <span className='text-gray-800 font-semibold text-right sm:text-left'>
                    ${Number(property.price || 0).toLocaleString('es-MX')} {String(operationTypeDisplay || '').toLowerCase() === 'renta' ? 'MXN / mes' : 'MXN'}
                  </span>
                </div>
                <div className='grid grid-cols-2 py-3 text-sm'>
                  <span className='text-gray-500 font-medium'>Última actualización</span>
                  <span className='text-gray-800 font-medium text-right sm:text-left'>
                    {property.updated_at ? new Date(property.updated_at).toLocaleDateString('es-MX') : '—'}
                  </span>
                </div>
                <div className='grid grid-cols-2 py-3 text-sm'>
                  <span className='text-gray-500 font-medium'>Fecha de creación</span>
                  <span className='text-gray-800 font-medium text-right sm:text-left'>
                    {property.created_at ? new Date(property.created_at).toLocaleDateString('es-MX') : '—'}
                  </span>
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
          images={propertyMedia.map(m => m.url)}
        />
      )}
      {isPlanGalleryOpen && (
        <Gallery
          isOpen={isPlanGalleryOpen}
          onClose={() => setIsPlanGalleryOpen(false)}
          images={plansMedia.map((m: any) => m.url)}
        />
      )}
    </>
  );
}
