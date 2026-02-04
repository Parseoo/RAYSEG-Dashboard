"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Plus, SlidersHorizontal, Eye, Pencil, Trash2, Star } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from '@/components/ui/badges';
import Link from 'next/link';
import Search from '@/components/ui/Search';
import { Table } from '@/components/ui/table';
import { operationProperty, statusProperty, typeProperty, webPublication } from '@/components/SelectProperties.data';
import Breadcrumb from '@/components/ui/breadcrumb';
import FilterSidebar from '@/components/ui/FilterSidebar';
import Tooltip from '@/components/ui/Tooltip';
import DeleteModal from '@/components/ui/DeleteModal';

const headers = [
  'Propiedad',
  'Tipo',
  'Operación',
  'Precio',
  'Dirección',
  'Estatus',
  'Publicación web',
  'Fecha alta',
  'Destacada',
  'Acciones'
];

function PropertyList({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: any | null }>({
    isOpen: false,
    item: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
      createdAt: '12/04/2025',
      featured: true
    }
  ]

  const tableData = (data && data.length > 0) ? data : propertiesData;

  const handleDeleteClick = (item: any) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    // Aquí iría la lógica para eliminar el registro
    // await deleteProperty(deleteModal.item.id);

    // Simulación de eliminación
    setTimeout(() => {
      console.log('Eliminando propiedad:', deleteModal.item);
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, item: null });
      // Aquí actualizarías la lista de propiedades
    }, 1500);
  };

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
        <div className='flex items-center justify-center'>
          {row.featured ? (
            <Star size={18} className='fill-amber-500 text-amber-500' />
          ) : (
            <span className='text-xs text-gray-400'>-</span>
          )}
        </div>
      </td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <Tooltip content="Ver detalle">
            <Link href={`/property/${row.id || index}`}>
              <button className='p-1.5 bg-slate-200 rounded-md transition-all hover:bg-slate-300'>
                <Eye size={16} className='text-gray-600' />
              </button>
            </Link>
          </Tooltip>
          <Tooltip content="Editar">
            <button className='p-1.5 bg-slate-200 rounded-md transition-all hover:bg-slate-300'>
              <Pencil size={16} className='text-gray-600' />
            </button>
          </Tooltip>
          <Tooltip content="Eliminar">
            <button
              onClick={() => handleDeleteClick(row)}
              className='p-1.5 bg-red-500 rounded-md transition-all hover:bg-red-600'
            >
              <Trash2 size={16} className='text-white' />
            </button>
          </Tooltip>
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
          </div>

          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Buscador */}
            <Search
              title="Buscar por dirección, código postal, ciudad, etc."
              className="w-full sm:min-w-[400px] pl-10 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500"
            />

            {/* Filtro + Botón */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>

              <Link href="/property/add-property">
                <button
                  type="button"
                  className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium text-sm sm:text-base"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Agregar Propiedad</span>
                  <span className="sm:hidden">Agregar</span>
                </button>
              </Link>
            </div>

          </div>


          <Table data={tableData} headers={headers} renderRow={renderRow} isLoading={isLoading} />
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Propiedades"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Propiedad</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeProperty.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Estados">Estados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operación</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar operación" />
              </SelectTrigger>
              <SelectContent>
                {operationProperty.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estatus</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estatus" />
              </SelectTrigger>
              <SelectContent>
                {statusProperty.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publicación Web</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar publicación" />
              </SelectTrigger>
              <SelectContent>
                {webPublication.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700">Solo destacadas</span>
            </label>
          </div>
        </div>
      </FilterSidebar>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Propiedad"
        itemName={deleteModal.item?.title || ''}
        itemDetails={deleteModal.item ? [
          { label: 'Tipo', value: deleteModal.item.type || '-' },
          { label: 'Operación', value: deleteModal.item.operation || '-' },
          { label: 'Precio', value: deleteModal.item.price || '-' },
          { label: 'Ubicación', value: deleteModal.item.location || '-' }
        ] : []}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default PropertyList