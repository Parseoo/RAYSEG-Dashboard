"use client"

import Image from 'next/image';
import { Plus, SlidersHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from '@/components/ui/badges';
import Link from 'next/link';
import Search from '@/components/ui/Search';
import { Table } from '@/components/ui/table';
import { operationProperty, statusProperty, typeProperty, webPublication } from '@/components/SelectProperties.data';
import Breadcrumb from '@/components/ui/breadcrumb';

const headers = [
  'Propiedad',
  'Tipo',
  'Operación',
  'Precio',
  'Dirección',
  'Estatus',
  'Publicación web',
  'Fecha alta',
  'Acciones'
];

function PropertyList({ data, isLoading }: { data: any[]; isLoading: boolean }) {

  const propertiesData = [
    {
      id: 1,
      image: '/property.svg',
      title: 'Star Sun Hotel & Apartment',
      location: 'North Carolina, USA',
      type: 'Departamento',
      operation: 'Venta',
      price: '$3,500,000',
      propertyStatus: 'Disponible',
      publicationStatus: 'Publicado',
      createdAt: '12/04/2025'
    }
  ]

  const tableData = (data && data.length > 0) ? data : propertiesData;

  const renderRow = (row: any, index: number) => (
    <tr key={row.id || index} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <Image
            src={row.image || '/property.svg'}
            alt={row.title || 'Property'}
            width={60}
            height={60}
            className='rounded-lg object-cover w-[60px] h-[60px]'
          />
          <div>
            <p className='font-medium text-sm text-gray-900'>{row.title || 'Property Name'}</p>
            <p className='text-xs text-gray-500'>{row.location || 'Location'}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.type || '-'}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.operation || '-'}</td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{row.price || '-'}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.location || '-'}</td>
      <td className='py-4 px-4'>
        {/* Estatus de la propiedad: utiliza `propertyStatus` si está disponible */}
        <Tag status={row.propertyStatus || row.statusLabel || row.status} statusType='property'>{row.propertyStatus || row.statusLabel || row.status || 'Unknown'}</Tag>
      </td>
      <td className='py-4 px-4'>
        {/* Estado de publicación web: utiliza `publicationStatus` si está disponible */}
        <Tag status={row.publicationStatus || row.statusLabel || row.status} statusType='publication'>{row.publicationStatus || row.statusLabel || row.status || 'Unknown'}</Tag>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.createdAt || '-'}</td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <button className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
            <Eye size={16} className='text-gray-600' />
          </button>
          <button className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
            <Pencil size={16} className='text-gray-600' />
          </button>
          <button className='p-1.5 bg-red-500 rounded-md transition-colors hover:bg-red-600'>
            <Trash2 size={16} className='text-white' />
          </button>
        </div>
      </td>
    </tr>
  )

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Propiedades', href: '/property', active: true }
      ]} />
      <div className='bg-white w-full max-h-max rounded-lg p-4 sm:p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
            <div>
              <h1 className='text-black font-[700] text-xl sm:text-2xl'>Propiedades</h1>
              <p className='text-sm sm:text-md text-gray-500'>Listado principal de propiedades</p>
            </div>
            <div className='flex items-center gap-2 sm:gap-4'>
              <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <SlidersHorizontal className='w-5 h-5' />
              </button>
              <Link href="/property/add-property" className='flex-1 sm:flex-initial'>
                <button type='button'
                  className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium text-sm sm:text-base'>
                  <Plus size={18} className='sm:w-5 sm:h-5' /> <span className='hidden sm:inline'>Agregar Propiedad</span><span className='sm:hidden'>Agregar</span>
                </button>
              </Link>
            </div>
          </div>

          <div>
            <ul className='flex flex-col sm:flex-row gap-3 w-full mb-5'>
              <li className='w-full sm:w-[25%]'><Search title='Buscar por dirección, CP, etc.' className='w-full pl-10 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500' /></li>
              <li className='w-full sm:w-auto'>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Tipo de Propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeProperty.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
              <li className='w-full sm:w-auto'>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estados">Estados</SelectItem>
                  </SelectContent>
                </Select>
              </li>
              <li className='w-full sm:w-auto'>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Operación" />
                  </SelectTrigger>
                  <SelectContent>
                    {operationProperty.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
              <li className='w-full sm:w-auto'>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusProperty.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
              <li className='w-full sm:w-auto'>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Publicación Web" />
                  </SelectTrigger>
                  <SelectContent>
                    {webPublication.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
              <li className='flex items-center gap-2'>
                <input type="checkbox" className='w-4 h-4' />
                <span className='text-sm text-gray-700'>Destacada</span>
              </li>
            </ul>
          </div>

          <Table data={tableData} headers={headers} renderRow={renderRow} isLoading={isLoading} />
        </div>
      </div>
    </>
  )
}

export default PropertyList