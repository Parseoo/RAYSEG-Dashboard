"use client"

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tag } from '@/components/ui/badges';
import { GetAllProperties } from '@/lib/api/property/property-api';
import { GetPropertyOperationTypes } from '@/lib/api/catalog-api';
import { resolveCatalogDisplayValue } from '@/lib/utils/catalog';
import { ItemResponse } from '@/lib/@type';
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

const formatPrice = (price: string) => {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
};

export const PropertyList = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [operationCatalog, setOperationCatalog] = useState<ItemResponse[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    GetPropertyOperationTypes()
      .then((res: any) => {
        if (!res?.data) return;
        const items = res.data.items || res.data.catalogItems || [];
        setOperationCatalog(items);
      })
      .catch((err) => console.error('Error fetching operation catalog:', err));
  }, []);

  const formatOperationType = (op: any) => {
    if (typeof op === 'object' && op !== null) return op.name || '-';
    return resolveCatalogDisplayValue(op, operationCatalog) || op || '-';
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await GetAllProperties(1);
        if (response.data?.properties) {
          setProperties(response.data.properties.slice(0, 10)); // Show latest 10
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getValueForSort = (property: any, field: string): any => {
    switch (field) {
      case 'Propiedad':
        return property.title || '';
      case 'Tipo':
        return property.property_type?.name || '';
      case 'Operación':
        return formatOperationType(property.operation_type);
      case 'Precio':
        return parseFloat(property.price || '0');
      case 'Estatus':
        return property.property_status || '';
      case 'Publicación':
        return property.property_post_status?.name || '';
      case 'Fecha alta':
        return property.created_at || '';
      default:
        return '';
    }
  };

  const sortedProperties = useMemo(() => {
    if (!sortField || !properties || properties.length === 0) return properties || [];

    return [...properties].sort((a, b) => {
      const valA = getValueForSort(a, sortField);
      const valB = getValueForSort(b, sortField);

      if (valA === '' || valA === null || valA === undefined) return 1;
      if (valB === '' || valB === null || valB === undefined) return -1;

      // Ordenación de números
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // Ordenación de fechas
      const isDateA = !isNaN(Date.parse(valA)) && isNaN(Number(valA));
      const isDateB = !isNaN(Date.parse(valB)) && isNaN(Number(valB));
      if (isDateA && isDateB) {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Ordenación de cadenas (alfabético)
      const strA = String(valA).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const strB = String(valB).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [properties, sortField, sortDirection]);

  return (
    <section className='w-full mt-6 rounded-lg bg-white p-5 shadow-md'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='font-[600] text-xl'>Lista de Propiedades</h2>
        <Link href="/property" className='px-4 py-2 bg-primary_color text-white rounded-lg font-medium text-sm shadow-md hover:opacity-90 transition-opacity'>Ver todas</Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary_color animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-400 py-12 text-sm">No hay propiedades registradas</p>
      ) : (
        <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse overflow-hidden">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-100">
                {['Propiedad', 'Tipo', 'Operación', 'Precio', 'Estatus', 'Publicación', 'Fecha alta'].map(header => {
                  const isCurrent = sortField === header;
                  return (
                    <th 
                      key={header} 
                      onClick={() => handleSort(header)}
                      className="py-2 px-3 text-xs font-medium text-gray-600 uppercase tracking-wide whitespace-nowrap cursor-pointer hover:bg-slate-200 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{header}</span>
                        <span className="text-gray-400">
                          {isCurrent && sortDirection === 'asc' && <ArrowUp size={14} className="text-primary_color font-bold" />}
                          {isCurrent && sortDirection === 'desc' && <ArrowDown size={14} className="text-primary_color font-bold" />}
                          {!isCurrent && <ArrowUpDown size={14} className="opacity-40 hover:opacity-100 transition-opacity" />}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedProperties.map((property: any) => {
                const images = property.images;
                let imageUrl = '/property.jpg';
                if (images && Array.isArray(images) && images.length > 0) {
                  const mainImage = images.find((img: any) => img.is_main === true || img.is_main === 1 || img.is_main === 'true' || img.isMain === true) || images[0];
                  const imgPath = mainImage?.image || mainImage?.file || mainImage?.image_url || mainImage?.url || mainImage?.src || (typeof mainImage === 'string' ? mainImage : null);
                  if (imgPath) imageUrl = getImageUrl(imgPath);
                } else if (property.main_image || property.mainImage || property.main_image_url) {
                  const mainImg = property.main_image || property.mainImage || property.main_image_url;
                  const imgPath = typeof mainImg === 'string' ? mainImg : (mainImg?.image || mainImg?.file || mainImg?.url);
                  if (imgPath) imageUrl = getImageUrl(imgPath);
                }

                return (
                  <tr key={property.property_id} className='border-b border-slate-100 hover:bg-slate-50 transition-colors'>
                    <td className='py-3 px-4 min-w-[200px]'>
                      <div className='flex items-center gap-3'>
                        <div className='relative w-[68px] h-[48px] rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-sm'>
                          <Image
                            src={imageUrl}
                            alt={property.title || 'Property'}
                            fill
                            sizes="68px"
                            unoptimized={true}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target && !target.src.endsWith('/property.jpg') && !target.src.endsWith('/casa.jpeg')) {
                                target.src = '/property.jpg';
                              }
                            }}
                            className='object-cover'
                          />
                        </div>
                        <div className='min-w-0'>
                          <p className='font-medium text-sm text-gray-900 line-clamp-1'>{property.title || '-'}</p>
                          <p className='text-xs text-gray-400'>{property.number_mls || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-sm text-gray-600'>{property.property_type?.name || '-'}</td>
                    <td className='py-3 px-4 text-sm text-gray-600'>{formatOperationType(property.operation_type)}</td>
                    <td className='py-3 px-4 text-sm font-semibold text-gray-800'>{formatPrice(property.price)}</td>
                    <td className='py-3 px-4'><Tag status={property.property_status} statusType='property'>{property.property_status || '-'}</Tag></td>
                    <td className='py-3 px-4'><Tag status={property.property_post_status?.name} statusType='publication'>{property.property_post_status?.name || '-'}</Tag></td>
                    <td className='py-3 px-4 text-sm text-gray-500'>{property.created_at ? new Date(property.created_at).toLocaleDateString('es-MX') : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
