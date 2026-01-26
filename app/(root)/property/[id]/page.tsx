"use client"

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { Gallery } from '@/components/ui/Gallery';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Mock data - en producción esto vendría de una API
  const propertyData = {
    id: propertyId,
    title: 'Casa Moderna Centro',
    subtitle: 'Casa Moderna en el Centro Histórico',
    address: 'Av. Paseo de la Reforma 123, Col. Juárez, Alcaldía Cuauhtémoc, C.P. 06600, Ciudad de México, CDMX, México',
    shortAddress: 'Av. Reforma 123, Col. Centro, Ciudad de México, CDMX',
    price: '$3,500,000 MXN',
    tags: ['Venta', 'Disponible', 'Publicado en web', 'Destacada'],
    images: [
      '/property.jpg',
      '/casa.jpeg',
      '/property.jpg',
      '/casa.jpeg',
      '/property.jpg',
      '/casa.jpeg'
    ],
    mainImage: '/property.jpg',
    generalInfo: {
      tipo: 'Casa residencial',
      operacion: 'Venta',
      precio: '$3,500,000 MXN',
      estatusInterno: 'Disponible',
      publicacionWeb: 'Publicado (visible en sitio público)',
      direccionCompleta: 'Av. Paseo de la Reforma 123, Col. Juárez, Alcaldía Cuauhtémoc, C.P. 06600, Ciudad de México, CDMX, México',
      referenciaZona: 'A 3 cuadras del Ángel de la Independencia',
      claveInterna: 'CAT-DF-2024-001024',
      superficieConstruida: '180 m²',
      superficieTerreno: '120 m²',
      recamaras: 3,
      baños: 2.5,
      estacionamientos: 2,
      antiguedad: '5 años',
      disponibilidad: 'Entrega inmediata',
      tipoCliente: 'Particular',
    },
    description: 'Casa remodelada con iluminación natural, patio interior y acabados de lujo. Ubicada en una de las zonas más conectadas de la CDMX, ideal para familias que buscan vivir cerca de servicios, escuelas y áreas comerciales. Cuenta con cocina integral equipada, sala-comedor amplios y terraza con vista abierta.',
    caracteristicas: [
      'Roof garden',
      'Patio interior',
      'Cocina integral',
      'Seguridad 24/7',
      'Pet friendly',
      'Metro / Metrobus',
      'Centros comerciales',
      'Hospital',
      'Escuelas'
    ],
    legalInfo: {
      regimenPropiedad: 'Escriturado',
      estatusLegal: 'Sin adeudos reportados',
      usoSuelo: 'Habitacional (H3)',
      disponibleCredito: 'Bancario, INFONAVIT y FOVISSSTE',
      mantenimientoMensual: '$1,800 MXN',
      documentacion: 'Identificación, escrituras, predial'
    },
    comercialInfo: {
      agenteAsignado: 'María López',
      telefono: '55 1234 5678',
      correo: 'maria.lopez@inmogestion.mx',
      canalesPublicados: 'Sitio web, Portales externos',
      ultimaActualizacion: 'hace 2 horas por Admin Principal',
      fechaAlta: '10 mayo 2024',
      fechaPublicacion: '12 mayo 2024'
    },
    coordinates: {
      lat: 19.4326,
      lng: -99.1332
    }
  };

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Propiedades', href: '/property' },
        { label: 'Ver propiedad', active: true }
      ]} />

      <div className='bg-white w-full rounded-lg shadow-md'>
        {/* Header con título, precio y tags */}
        <div className='border-b border-gray-200 p-5 sm:p-6'>
          <div className='mb-4'>
            <button
              onClick={() => router.back()}
              className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'
            >
              <ArrowLeft size={18} />
              <span className='text-sm'>Volver</span>
            </button>
          </div>

          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>
                {propertyData.title}
              </h1>
              <p className='text-gray-600 text-sm mb-3'>{propertyData.shortAddress}</p>
              <div className='flex flex-wrap gap-2'>
                <Tag status="Venta">Venta</Tag>
                <Tag status="Disponible" statusType="property">Disponible</Tag>
                <Tag status="Publicado" statusType="publication">Publicado en web</Tag>
                <div className='flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium'>
                  <Star size={14} className='fill-yellow-500 text-yellow-500' />
                  Destacada
                </div>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-3xl font-bold text-gray-800'>{propertyData.price}</p>
            </div>
          </div>
        </div>

        {/* Grid de dos columnas */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 sm:p-6'>
          {/* Columna izquierda - Info general e imágenes */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Sección: Información general */}
            <div>
              <h2 className='text-lg font-semibold text-gray-800 mb-3'>Información general</h2>
              <p className='text-sm text-gray-500 mb-4'>
                Resumen de todos los datos que se muestran en la web pública y en el dashboard interno.
              </p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Título de la propiedad</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.subtitle}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Tipo de propiedad</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.tipo}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Operación</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.operacion}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Precio</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.precio}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Estatus interno</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.estatusInterno}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Publicación en sitio web</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.publicacionWeb}</p>
                </div>
                <div className='sm:col-span-2'>
                  <p className='text-xs text-gray-500 mb-1'>Dirección completa</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.direccionCompleta}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Referencia de zona</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.referenciaZona}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Clave catastral / ID interno</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.claveInterna}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Superficie construida</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.superficieConstruida}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Superficie de terreno</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.superficieTerreno}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Recámaras</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.recamaras}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Baños</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.baños}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Estacionamientos</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.estacionamientos}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Antigüedad</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.antiguedad}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Disponibilidad</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.disponibilidad}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Tipo de cliente</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.generalInfo.tipoCliente}</p>
                </div>
              </div>

              <div className='mt-6'>
                <p className='text-xs text-gray-500 mb-2'>Descripción para la web</p>
                <p className='text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100'>
                  {propertyData.description}
                </p>
              </div>

              <div className='mt-6'>
                <p className='text-xs text-gray-500 mb-3'>Características destacadas</p>
                <div className='flex flex-wrap gap-2'>
                  {propertyData.caracteristicas.slice(0, 5).map((item, idx) => (
                    <span
                      key={idx}
                      className='bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200'
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className='mt-6'>
                <p className='text-xs text-gray-500 mb-3'>Servicios cercanos</p>
                <div className='flex flex-wrap gap-2'>
                  {propertyData.caracteristicas.slice(5).map((item, idx) => (
                    <span
                      key={idx}
                      className='bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200'
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sección: Información legal */}
            <div className='border-t border-gray-200 pt-6'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>Información legal y administrativa</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Régimen de propiedad</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.legalInfo.regimenPropiedad}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Estatus legal</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.legalInfo.estatusLegal}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Uso de suelo</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.legalInfo.usoSuelo}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Disponible para crédito</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.legalInfo.disponibleCredito}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Mantenimiento mensual (si aplica)</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.legalInfo.mantenimientoMensual}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Documentación entregada</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.legalInfo.documentacion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Imágenes, mapa e info comercial */}
          <div className='space-y-6'>
            {/* Imágenes de la propiedad */}
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-base font-semibold text-gray-800'>Imágenes de la propiedad</h3>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className='text-xs text-blue-600 hover:text-blue-700 font-medium'
                >
                  Gestionar
                </button>
              </div>
              <p className='text-xs text-gray-500 mb-3'>
                Galería publicada en la web. La imagen marcada como principal se muestra en listados y portadas.
              </p>

              <div className='space-y-2'>
                {/* Imagen principal */}
                <div className='relative group cursor-pointer' onClick={() => setIsGalleryOpen(true)}>
                  <Image
                    src={propertyData.mainImage}
                    alt='Principal'
                    width={400}
                    height={250}
                    className='w-full h-48 object-cover rounded-lg'
                  />
                  <div className='absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium'>
                    Principal
                  </div>
                </div>

                {/* Grid de miniaturas */}
                <div className='grid grid-cols-3 gap-2'>
                  {propertyData.images.slice(1, 4).map((img, idx) => (
                    <div
                      key={idx}
                      className='relative cursor-pointer group'
                      onClick={() => setIsGalleryOpen(true)}
                    >
                      <Image
                        src={img}
                        alt={`Imagen ${idx + 2}`}
                        width={120}
                        height={120}
                        className='w-full h-24 object-cover rounded-lg'
                      />
                      {idx === 2 && propertyData.images.length > 4 && (
                        <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg'>
                          <span className='text-white text-sm font-medium'>
                            +{propertyData.images.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ubicación en mapa */}
            <div className='border-t border-gray-200 pt-6'>
              <h3 className='text-base font-semibold text-gray-800 mb-3'>Ubicación en mapa</h3>
              <p className='text-xs text-gray-500 mb-3'>
                Vista de la ubicación aproximada publicada en Google Maps con marcador de la propiedad.
              </p>
              <div className='bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-gray-200'>
                <div className='text-center'>
                  <MapPin className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                  <p className='text-sm text-gray-500'>Mapa embebido de Google Maps con marcador de la propiedad</p>
                  <p className='text-xs text-gray-400 mt-1'>(Solo lectura en esta vista)</p>
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-2'>
                Coordenadas guardadas: {propertyData.coordinates.lat}, {propertyData.coordinates.lng}
              </p>
            </div>

            {/* Información comercial */}
            <div className='border-t border-gray-200 pt-6'>
              <h3 className='text-base font-semibold text-gray-800 mb-4'>Información comercial</h3>
              <div className='space-y-3'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Agente asignado</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.comercialInfo.agenteAsignado}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Teléfono agente</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.comercialInfo.telefono}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Correo agente</p>
                  <p className='text-sm font-medium text-blue-600 break-all'>{propertyData.comercialInfo.correo}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Canales publicados</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.comercialInfo.canalesPublicados}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Última actualización</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.comercialInfo.ultimaActualizacion}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Fecha de alta en sistema</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.comercialInfo.fechaAlta}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Fecha de publicación en web</p>
                  <p className='text-sm font-medium text-gray-800'>{propertyData.comercialInfo.fechaPublicacion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <Gallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={propertyData.images}
        />
      )}
    </>
  );
}
