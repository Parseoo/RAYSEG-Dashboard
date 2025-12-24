"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Eye, Pencil, Trash2, CalendarPlus, FileText } from 'lucide-react';
import Search from '../../../components/ui/Search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '../../../components/ui/table';
import { ClientsCard } from './ContractsCard';
import Breadcrumb from '@/components/ui/breadcrumb';
import { rangeDates, statusContracts, typeContracts } from '@/components/SelectData.data';

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
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.status === 'Activo' ? 'bg-emerald-700 text-white' : 'bg-gray-500 text-white'}`}>
          {row.statusLabel || row.status || 'Unknown'}
        </span>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{row.interest}</td>

      <td className='py-4 px-4'>

        <span className='text-sm text-gray-700'>{row.properties}</span>

      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.agent}</td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <button className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
            <Eye size={16} className='text-gray-600' />
          </button>
          <button className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
            <Pencil size={16} className='text-gray-600' />
          </button>
          <button className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
            <CalendarPlus size={16} className='text-gray-600' />
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
        { label: 'Clientes', href: '/clients', active: true }
      ]} />
      <ClientsCard />
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex items-center justify-between mb-3'>
            <div>
              <h1 className='text-black font-[700] text-2xl'>Listado de contratos</h1>
              <p className='text-md text-gray-500'>Filtra por estado, tipo de operación, agente y fechas</p>
            </div>
            <div className='flex items-center gap-4'>
              <SlidersHorizontal />
              <Link href='/clients/add-client'>
                <button type='button'
                  className='bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
                  <FileText size={20} /> Nuevo Contrato
                </button>
              </Link>
            </div>
          </div>

          <div>
            <ul className='flex gap-5 w-full mb-3'>
              <li className='w-full'><Search title='Buscar por propiedad, cliente o No. contrato' className='w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500' /></li>
              <li>
                <Select>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Tipo de contrato' />
                  </SelectTrigger>
                  <SelectContent>
                    {typeContracts.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
              <li>
                <Select>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Estatus' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusContracts.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>

              <li>
                <Select>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Rango de fechas' />
                  </SelectTrigger>
                  <SelectContent>
                    {rangeDates.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            </ul>
          </div>

          <Table data={tableData} headers={headers} renderRow={renderRow} isLoading={isLoading} />
        </div>
      </div>
    </>
  )
}

export default Clients