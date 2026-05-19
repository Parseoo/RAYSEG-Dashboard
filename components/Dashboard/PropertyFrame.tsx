"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tag } from '@/components/ui/badges';
import { GetAllProperties } from '@/lib/api/property/property-api';
import { Loader2 } from 'lucide-react';

const formatPrice = (price: string) => {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
};

const formatOperationType = (op: string) => {
  const map: Record<string, string> = { sale: 'Venta', rent: 'Renta', both: 'Venta/Renta' };
  return map[op] || op;
};

export const PropertyList = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <section className='w-full mt-6 rounded-lg bg-white p-5 shadow-md'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='font-[600] text-xl'>Lista de Propiedades</h2>
        <Link href="/property" className='text-sm text-primary_color font-medium hover:underline'>Ver todas</Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary_color animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-400 py-12 text-sm">No hay propiedades registradas</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {['Propiedad', 'Tipo', 'Operación', 'Precio', 'Estatus', 'Publicación', 'Fecha alta'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((property: any) => (
                <tr key={property.property_id} className='border-b border-slate-100 hover:bg-slate-50 transition-colors'>
                  <td className='py-3 px-4'>
                    <div className='flex items-center gap-3'>
                      <Image src={'/property.svg'} alt={property.title || 'Property'} width={44} height={44} className='rounded-lg object-cover w-[44px] h-[44px]' />
                      <div>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
