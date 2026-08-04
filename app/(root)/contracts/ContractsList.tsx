"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Eye, Pencil, Trash2, FileText } from 'lucide-react';
import Search from '../../../components/ui/Search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '../../../components/ui/table';
import { ClientsCard } from './ContractsCard';
import Breadcrumb from '@/components/ui/breadcrumb';
import { rangeDates, statusContracts, typeContracts } from '@/components/SelectData.data';
import FilterSidebar from '@/components/ui/FilterSidebar';
import DeleteModal from '@/components/ui/DeleteModal';
import { Tag } from '@/components/ui/badges';
import Tooltip from '@/components/ui/Tooltip';

const headers = [
  'No. Contrato',
  'Propiedad',
  'Cliente',
  'Tipo',
  'Estatus',
  'Importe',
  'Inicio y Fin',
  'Recordatorio',
  'Acciones'
];

function Clients({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: any | null }>({
    isOpen: false,
    item: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const propertiesData = [
    {
      id: 1,
      noContract: '#CT-00123',
      property: 'Casa 1',
      direction: 'Calle Falsa 123, Ciudad, País',
      name: 'Carlos Fernandez',
      document: 'INE 327872739732',
      type: 'Arrendamiento',
      status: 'Vencido',
      import: '$15,000 MXN',
      period: '01/01/2024 - 31/12/2024',
      reminder: '30 días antes',
    }
  ]

  const tableData = (data && data.length > 0) ? data : propertiesData;

  const handleDeleteClick = (item: any) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    // Aquí iría la lógica para eliminar el contrato
    setTimeout(() => {
      console.log('Eliminando contrato:', deleteModal.item);
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, item: null });
    }, 1500);
  };

  const renderRow = (row: any, index: number) => (
    <tr key={row.id || index} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
      <td className='py-4 px-4'>
        <span>{row.noContract}</span>
      </td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div>
            <p className='font-medium text-sm'>{row.property}</p>
            <p className='text-xs text-gray-500'>{row.direction}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4'>
        <div>
          <p className='font-medium text-sm'>{row.name}</p>
          <p className='text-xs text-gray-500'>{row.document}</p>
        </div>
      </td>

      <td className='py-4 px-4 text-sm text-gray-700'>{row.type}</td>
      <td className='py-4 px-4'>
        <Tag status={row.statusLabel || row.status}>{row.statusLabel || row.status || 'Unknown'}</Tag>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{row.import || row.interest}</td>

      <td className='py-4 px-4'>
        <span className='text-sm text-gray-700'>{row.period || row.properties}</span>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.reminder || row.agent}</td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <Tooltip content="Ver detalle">
            <button className='p-1.5 bg-slate-200 rounded-md transition-all hover:bg-slate-300'>
              <Eye size={16} className='text-gray-600' />
            </button>
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
        { label: 'Contratos', href: '/contracts', active: true }
      ]} />
      <ClientsCard />
      <div className='bg-white w-full max-h-max rounded-lg p-4 sm:p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
            <div>
              <h1 className='text-black font-[700] text-xl sm:text-2xl'>Listado de contratos</h1>
            </div>
            <div className='flex items-center gap-3 w-full sm:w-auto justify-end'>
              <button
                type='button'
                onClick={() => setIsFilterOpen(true)}
                className='p-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center relative border border-slate-200 shadow-sm'
                title="Filtros"
              >
                <SlidersHorizontal className='w-5 h-5' />
              </button>
              <Link href='/clients/add-client' className='w-full sm:w-auto'>
                <button type='button'
                  className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md text-sm sm:text-base'>
                  <FileText size={18} className='sm:w-5 sm:h-5' /> <span className='hidden sm:inline'>Nuevo Contrato</span><span className='sm:hidden'>Nuevo</span>
                </button>
              </Link>
            </div>
          </div>

          <div className='mb-5'>
            <Search title='Buscar por propiedad, cliente o número de contrato' className='max-w-[450px] w-full' />
          </div>

          <Table data={tableData} headers={headers} renderRow={renderRow} isLoading={isLoading} />
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Contratos"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contrato</label>
            <Select>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Seleccionar tipo' />
              </SelectTrigger>
              <SelectContent>
                {typeContracts.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estatus</label>
            <Select>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Seleccionar estatus' />
              </SelectTrigger>
              <SelectContent>
                {statusContracts.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Fechas</label>
            <Select>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Seleccionar rango' />
              </SelectTrigger>
              <SelectContent>
                {rangeDates.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FilterSidebar>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Contrato"
        itemName={deleteModal.item?.noContract || ''}
        itemDetails={deleteModal.item ? [
          { label: 'Propiedad', value: deleteModal.item.property || '-' },
          { label: 'Cliente', value: deleteModal.item.name || '-' },
          { label: 'Tipo', value: deleteModal.item.type || '-' },
          { label: 'Importe', value: deleteModal.item.import || '-' }
        ] : []}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default Clients