"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Eye, Pencil, Trash2, UserPlus, CalendarPlus } from 'lucide-react';
import { typeOptions, statusOptions, responsibleOptions } from '../../../components/selectClients.data';
import Search from '../../../components/ui/Search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '../../../components/ui/table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';

const headers = [
  'Agente',
  'Rol',
  'Propiedades activas',
  'Citas',
  'Estatus',
  'Contacto',
  'Alta',
  'Acciones'
];

function AgentsList({ data, isLoading }: { data: any[]; isLoading: boolean }) {

  const propertiesData = [
    {
      id: 1,
      image: '/user.svg',
      name: 'Carlos Fernandez',
      document: 'INE 327872739732',
      type: 'Agente Senior',
      status: 'Activo',
      propertiesActive: '2',
      statusLabel: 'Activo',
      dates: '3',
      email: 'carlos.fernandez@gmail.com',
      number: '+52 234 567 890',
      high: '01/01/2020'
    }
  ]

  const tableData = (data && data.length > 0) ? data : propertiesData;

  const renderRow = (row: any, index: number) => (
    <tr key={row.id || index} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <Image
            src={row.image || '/property.svg'}
            alt={row.name || 'Property'}
            width={60}
            height={60}
            className='rounded-lg object-cover w-[60px] h-[60px]'
          />
          <div>
            <p className='font-medium text-sm'>{row.name}</p>
            <p className='text-xs text-gray-500'>{row.document}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.type}</td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{row.propertiesActive}</td>

      <td className='py-4 px-4'>
        <span className='text-sm text-gray-700'>{row.dates}</span>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>
        <Tag status={row.status}>{row.statusLabel || row.status || 'Unknown'}</Tag>
      </td>
      <td className='py-4 px-4'>
        <div>
          <td className='text-sm'>{row.email}</td>
          <p className='text-xs text-gray-500'>{row.number}</p>
        </div>
      </td>
      <td className='py-4 px-4'>
        <span className='text-sm text-gray-700'>{row.high}</span>
      </td>
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
  );
  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Agentes', href: '/agents', active: true }
      ]} />
      <div className='bg-white w-full max-h-max rounded-lg p-4 sm:p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
            <div>
              <h1 className='text-black font-[700] text-xl sm:text-2xl'>Listado de agentes</h1>
              <p className='text-sm sm:text-md text-gray-500'>Gestión de agentes inmobiliarios</p>
            </div>
            <div className='flex items-center gap-2 sm:gap-4'>
              <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <SlidersHorizontal className='w-5 h-5' />
              </button>
              <Link href='/agents/add-agent' className='flex-1 sm:flex-initial'>
                <button type='button'
                  className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium text-sm sm:text-base'>
                  <UserPlus size={18} className='sm:w-5 sm:h-5' /> <span className='hidden sm:inline'>Agregar Agente</span><span className='sm:hidden'>Agregar</span>
                </button>
              </Link>
            </div>
          </div>

          <div>
            <ul className='flex flex-col sm:flex-row gap-3 w-full mb-3'>
              <li className='w-full'><Search title='Buscar por nombre, email, teléfono, RFC o CURP' className='w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500' /></li>
              <li className='w-full sm:w-auto'>
                <Select>
                  <SelectTrigger className='w-full sm:w-[180px]'>
                    <SelectValue placeholder='Estatus' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
              <li className='w-full sm:w-auto'>
                <Select>
                  <SelectTrigger className='w-full sm:w-[180px]'>
                    <SelectValue placeholder='Rol' />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibleOptions.map((option) => (
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

export default AgentsList
