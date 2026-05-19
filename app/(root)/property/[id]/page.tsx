"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star, Loader2 } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { Gallery } from '@/components/ui/Gallery';
import { GetPropertyById } from '@/lib/api/property/property-api';
import { PropertyDetailResponse } from '@/lib/@type';
import { showToast } from 'nextjs-toast-notify';

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

  const addressObj = (property.address as any)?.[0] || {};
  const fullAddress = `${addressObj.street || ''} ${addressObj.street_number || ''}, ${addressObj.neighborhood || ''}, ${addressObj.city || ''}, ${addressObj.state || ''}`;
  
  // Usar imágenes del API si existen, de lo contrario usar mocks como placeholder
  const propertyImages = (property.images && property.images.length > 0) 
    ? property.images.map((img: any) => img.url || '/property.jpg')
    : ['/property.jpg', '/casa.jpeg', '/property.jpg', '/casa.jpeg', '/property.jpg'];

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Propiedades', href: '/property' },
        { label: 'Ver propiedad', href: `/property/${propertyId}`, active: true }
      ]} />

      <div className='bg-white w-full rounded-lg shadow-md'>
        <div className='border-b border-gray-200 p-5 sm:p-6'>
          <div className='mb-4'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'>
              <ArrowLeft size={18} /> <span className='text-sm'>Volver</span>
            </button>
          </div>

          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>{property.title}</h1>
              <p className='text-gray-600 text-sm mb-3'>{addressObj.city || 'Ubicación no disponible'}</p>
              <div className='flex flex-wrap gap-2'>
                <Tag status={property.operation_type === 'sale' ? 'Venta' : 'Renta'}>{property.operation_type === 'sale' ? 'Venta' : 'Renta'}</Tag>
                <Tag status={property.property_status || 'Disponible'} statusType="property">{property.property_status || 'Disponible'}</Tag>
                <Tag status={property.property_post_status?.name || 'Borrador'} statusType="publication">{property.property_post_status?.name || 'Borrador'}</Tag>
                {(property as any).is_featured && (
                  <div className='flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium'>
                    <Star size={14} className='fill-yellow-500 text-yellow-500' /> Destacada
                  </div>
                )}
              </div>
            </div>
            <div className='text-right'>
              <p className='text-3xl font-bold text-gray-800'>${Number(property.price).toLocaleString('es-MX')} MXN</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 sm:p-6'>
          <div className='lg:col-span-2 space-y-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800 mb-3'>Información general</h2>
              <p className='text-sm text-gray-500 mb-4'>Resumen de todos los datos que se muestran en la web pública y en el dashboard interno.</p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Título de la propiedad</p>
                  <p className='text-sm font-medium text-gray-800'>{property.title}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Tipo de propiedad</p>
                  <p className='text-sm font-medium text-gray-800'>{property.property_type?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Operación</p>
                  <p className='text-sm font-medium text-gray-800'>{property.operation_type === 'sale' ? 'Venta' : 'Renta'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Precio</p>
                  <p className='text-sm font-medium text-gray-800'>${Number(property.price).toLocaleString('es-MX')} MXN</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Estatus interno</p>
                  <p className='text-sm font-medium text-gray-800'>{property.property_status || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Publicación en sitio web</p>
                  <p className='text-sm font-medium text-gray-800'>{property.property_post_status?.name || 'Borrador'}</p>
                </div>
                <div className='sm:col-span-2'>
                  <p className='text-xs text-gray-500 mb-1'>Dirección completa</p>
                  <p className='text-sm font-medium text-gray-800'>{fullAddress}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Referencia de zona</p>
                  <p className='text-sm font-medium text-gray-800'>{(property as any).zone_reference || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Clave catastral / ID interno</p>
                  <p className='text-sm font-medium text-gray-800'>{property.number_mls || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Superficie construida</p>
                  <p className='text-sm font-medium text-gray-800'>{property.construction_size} m²</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Superficie de terreno</p>
                  <p className='text-sm font-medium text-gray-800'>{property.terrain_size} m²</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Recámaras</p>
                  <p className='text-sm font-medium text-gray-800'>{property.rooms}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Baños</p>
                  <p className='text-sm font-medium text-gray-800'>{property.bathrooms}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Estacionamientos</p>
                  <p className='text-sm font-medium text-gray-800'>{property.parking_spaces}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Antigüedad</p>
                  <p className='text-sm font-medium text-gray-800'>{property.construction_year ? `${new Date().getFullYear() - property.construction_year} años` : 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Disponibilidad</p>
                  <p className='text-sm font-medium text-gray-800'>Entrega inmediata</p>
                </div>
              </div>

              <div className='mt-6'>
                <p className='text-xs text-gray-500 mb-2'>Descripción para la web</p>
                <div className='text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100 min-h-[100px]'>
                  {property.description || 'Sin descripción disponible.'}
                </div>
              </div>

              <div className='mt-6'>
                <p className='text-xs text-gray-500 mb-3'>Características destacadas</p>
                <div className='flex flex-wrap gap-2'>
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((item: any, idx: number) => (
                      <span key={idx} className='bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200'>
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
                  <p className='text-xs text-gray-500 mb-1'>Régimen de propiedad</p>
                  <p className='text-sm font-medium text-gray-800'>Escriturado</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Estatus legal</p>
                  <p className='text-sm font-medium text-gray-800'>Sin adeudos reportados</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Uso de suelo</p>
                  <p className='text-sm font-medium text-gray-800'>Habitacional</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Mantenimiento mensual</p>
                  <p className='text-sm font-medium text-gray-800'>N/A</p>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                <h3 className='text-base font-semibold text-gray-800'>Imágenes de la propiedad</h3>
                <button onClick={() => setIsGalleryOpen(true)} className='text-xs text-blue-600 hover:text-blue-700 font-medium'>Ver todas</button>
              </div>
              <div className='space-y-2'>
                <div className='relative group cursor-pointer' onClick={() => setIsGalleryOpen(true)}>
                  <Image src={propertyImages[0]} alt='Principal' width={400} height={250} className='w-full h-48 object-cover rounded-lg' />
                  <div className="absolute top-2 left-2 bg-[#1B2533] text-white text-sm font-medium px-4 py-1.5 rounded-full z-20">
                    Principal
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  {propertyImages.slice(1, 4).map((img, idx) => (
                    <div key={idx} className='relative cursor-pointer group' onClick={() => setIsGalleryOpen(true)}>
                      <Image src={img} alt={`Imagen ${idx + 2}`} width={120} height={120} className='w-full h-24 object-cover rounded-lg' />
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

            <div className='border-t border-gray-200 pt-6'>
              <h3 className='text-base font-semibold text-gray-800 mb-3'>Ubicación en mapa</h3>
              <div className='w-full h-[300px] overflow-hidden rounded-lg border border-gray-200'>
                <MapWithMarker 
                  markerPosition={
                    addressObj.latitude && addressObj.longitude 
                      ? { lat: parseFloat(addressObj.latitude), lng: parseFloat(addressObj.longitude) } 
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
                  <p className='text-xs text-gray-500 mb-1'>Agente asignado</p>
                  <p className='text-sm font-medium text-gray-800'>Admin</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Última actualización</p>
                  <p className='text-sm font-medium text-gray-800'>{new Date(property.updated_at).toLocaleDateString('es-MX')}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Fecha de alta</p>
                  <p className='text-sm font-medium text-gray-800'>{new Date(property.created_at).toLocaleDateString('es-MX')}</p>
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
