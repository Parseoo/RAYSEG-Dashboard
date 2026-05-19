"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { showToast } from 'nextjs-toast-notify';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { responsibleOptions } from '../../../components/selectClients.data';
import { GetCatalogByName } from '@/lib/api/catalog-api';
import Search from '../../../components/ui/Search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '../../../components/ui/table';
import { ClientsCard } from './ClientsCard';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import FilterSidebar from '@/components/ui/FilterSidebar';
import Tooltip from '@/components/ui/Tooltip';
import DeleteModal from '@/components/ui/DeleteModal';
import { GetAllClients, DeleteClient, DesactiveClient } from '@/lib/api/client-api';
import { Pagination as PaginationType } from '@/lib/@type';
import { Pagination } from '@/components/ui/Pagination';

const headers = [
  'Cliente',
  'Contacto',
  'Tipo',
  'Estado',
  'Interés principal',
  'Propiedades vinculadas',
  'Agente',
  'Acciones'
];

function ClientsList({ data: initialData, isLoading: initialLoading }: { data: any[]; isLoading: boolean }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: any | null }>({
    isOpen: false,
    item: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    pagina_actual: 1,
    registros_por_pagina: 10,
    total_paginas: 1
  });
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [selectedState, setSelectedState] = useState("all");

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (selectedSource !== 'all') count++;
    if (selectedInterest !== 'all') count++;
    if (selectedState !== 'all') count++;
    return count;
  }, [selectedStatus, selectedType, selectedSource, selectedInterest, selectedState]);

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedSource("all");
    setSelectedInterest("all");
    setSelectedState("all");
    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([
    { value: 'activo', label: 'Activo' },
    { value: 'potencial', label: 'Potencial' },
    { value: 'inactivo', label: 'Inactivo' },
  ]);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [interestOptions, setInterestOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [segmentRes, statusRes, sourceRes, interestRes] = await Promise.all([
          GetCatalogByName('client-segment'),
          GetCatalogByName('client-status'),
          GetCatalogByName('lead-source'),
          GetCatalogByName('main-interest')
        ]);
        
        const extractItems = (res: any) => {
          if (!res?.data) return [];
          if (res.data.items) return res.data.items;
          if (res.data.catalogItems) return res.data.catalogItems;
          if (Array.isArray(res.data)) return res.data;
          return [];
        };

        const mapOptions = (items: any[]) => items.map((i: any) => ({ value: (i.value || i.name).toLowerCase(), label: i.name }));

        const types = extractItems(segmentRes);
        if (types.length > 0) setTypeOptions(mapOptions(types));
        
        const statuses = extractItems(statusRes);
        if (statuses.length > 0) setStatusOptions(mapOptions(statuses));

        const sources = extractItems(sourceRes);
        if (sources.length > 0) setSourceOptions(mapOptions(sources));

        const interests = extractItems(interestRes);
        if (interests.length > 0) setInterestOptions(mapOptions(interests));

      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  const fetchClients = async (page: number) => {
    setIsPageLoading(true);
    try {
      const response = await GetAllClients(page);
      // The structure is { "data": [...], "paginador": { ... } }
      if (response.data && Array.isArray(response.data.data)) {
        setClients(response.data.data);
        if (response.data.paginador) {
          setPagination(response.data.paginador);
        }
      }
    } catch (error: any) {
      showToast.error(error?.response?.data?.detail || "Error al obtener los clientes", {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage);
  }, [currentPage]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term ||
        c.nombre?.toLowerCase().includes(term) ||
        c.contacto?.email?.toLowerCase().includes(term) ||
        c.contacto?.telefono?.toLowerCase().includes(term) ||
        c.identificacion_fiscal?.toLowerCase().includes(term);

      const matchesStatus = selectedStatus === "all" || c.estatus === selectedStatus;
      const matchesType = selectedType === "all" || c.tipo_cliente === selectedType;
      const matchesAgent = selectedAgent === "all" || String(c.agente?.id || c.agente_id) === selectedAgent;
      const matchesSource = selectedSource === "all" || c.origen_prospecto === selectedSource;
      const matchesInterest = selectedInterest === "all" || c.interes_principal === selectedInterest;
      const matchesState = selectedState === "all" || c.direccion?.estado?.toLowerCase() === selectedState.toLowerCase();

      return matchesSearch && matchesStatus && matchesType && matchesAgent && matchesSource && matchesInterest && matchesState;
    });
  }, [clients, searchTerm, selectedStatus, selectedType, selectedAgent, selectedSource, selectedInterest, selectedState]);

  const handleDeleteClick = (item: any) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      // Usamos DesactiveClient como funcionalidad de "eliminación" (soft delete)
      await DesactiveClient(deleteModal.item.id, { estatus: "inactivo" });
      setClients(prev => prev.filter(c => c.id !== deleteModal.item.id));
      showToast.success("El cliente ha sido desactivado correctamente.");
    } catch (error: any) {
      showToast.error(error?.response?.data?.detail || "Error al desactivar el cliente");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const renderRow = (row: any, index: number) => (
    <tr key={row.id || index} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <Image
            src={'/user.svg'}
            alt={row.nombre || 'Cliente'}
            width={40}
            height={40}
            className='rounded-full object-cover w-[40px] h-[40px] bg-slate-100 p-1'
          />
          <div>
            <p className='font-medium text-sm'>{row.nombre || '-'}</p>
            <p className='text-xs text-gray-500'>{row.identificacion_fiscal || '-'}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4'>
        <div>
          <p className='text-sm'>{row.contacto?.email || '-'}</p>
          <p className='text-xs text-gray-500'>{row.contacto?.telefono || '-'}</p>
        </div>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.tipo_cliente || '-'}</td>
      <td className='py-4 px-4'>
        <Tag
          status={row.estatus}
          variant={row.estatus === 'activo' ? 'emerald' : 'red'}
        >
          {row.estatus || 'Unknown'}
        </Tag>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{row.interes_principal || '-'}</td>
      <td className='py-4 px-4'>
        <span className='text-sm text-gray-700'>
          {row.propiedades_vinculadas ?? row.propiedad?.title ?? (row.propiedad_id ? `ID: ${row.propiedad_id}` : '0')} vinculadas
        </span>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.agente?.nombre || row.agente_id || '-'}</td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <Tooltip content="Ver detalle">
            <Link href={`/clients/${row.id}`}>
              <button className='p-1.5 bg-slate-200 rounded-md transition-all hover:bg-slate-300'>
                <Eye size={16} className='text-gray-600' />
              </button>
            </Link>
          </Tooltip>
          <Tooltip content="Editar">
            <Link href={`/clients/edit-client/${row.id}`}>
              <button className='p-1.5 bg-slate-200 rounded-md transition-all hover:bg-slate-300'>
                <Pencil size={16} className='text-gray-600' />
              </button>
            </Link>
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
  );

  const FilterPills = ({ label, options, selectedValue, onChange }: { label: string, options: any[], selectedValue: string, onChange: (val: string) => void }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
      <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">{label}:</span>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onChange('all')}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 whitespace-nowrap ${
            selectedValue === 'all'
              ? 'bg-primary_color text-white font-medium shadow-sm'
              : 'bg-slate-100 text-gray-600 hover:bg-slate-200 active:scale-95'
          }`}
        >
          Todos
        </button>
        {options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 whitespace-nowrap ${
              selectedValue === opt.value
                ? 'bg-primary_color text-white font-medium shadow-sm'
                : 'bg-slate-100 text-gray-600 hover:bg-slate-200 active:scale-95'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Clientes', href: '/clients', active: true }
      ]} />
      <ClientsCard />
      <div className='bg-white w-full max-h-max rounded-lg p-4 sm:p-6 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
            <div>
              <h1 className='text-black font-[700] text-xl sm:text-2xl'>Listado de clientes</h1>
              <p className='text-sm sm:text-md text-gray-500'>Filtra por estado, tipo, interés y agente</p>
            </div>
            <div className='flex items-center gap-3 w-full sm:w-auto justify-end'>
              <button
                type='button'
                onClick={() => setIsFilterOpen(true)}
                className='p-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center relative border border-slate-200 shadow-sm'
                title="Filtros"
              >
                <SlidersHorizontal className='w-5 h-5' />
                {activeFiltersCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-primary_color text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm'>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <Link href='/clients/add-client' className='w-full sm:w-auto'>
                <button type='button'
                  className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium text-sm sm:text-base'>
                  <UserPlus size={18} className='sm:w-5 sm:h-5' /> <span className='hidden sm:inline'>Agregar Cliente</span><span className='sm:hidden'>Agregar</span>
                </button>
              </Link>
            </div>
          </div>

          <div className='mb-6 space-y-6'>
            {/* Buscador y Estatus Lado a Lado */}
            <div className='flex flex-col lg:flex-row lg:items-center gap-4 w-full'>
              <Search 
                title='Buscar por nombre, email, teléfono, RFC o CURP...' 
                className='max-w-[450px] w-full' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className='flex-shrink-0 flex items-center justify-start lg:justify-end min-w-max gap-3'>
                <FilterPills 
                  label="Estatus" 
                  options={statusOptions} 
                  selectedValue={selectedStatus} 
                  onChange={setSelectedStatus} 
                />
              </div>
            </div>

            {/* Píldoras de Filtro Tipo de Cliente */}
            <div className='py-1'>
              <FilterPills 
                label="Tipo de cliente" 
                options={typeOptions} 
                selectedValue={selectedType} 
                onChange={setSelectedType} 
              />
            </div>

            {/* Filtros Secundarios Desplegables */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              {/* Responsable comentado en todas las partes de la selección */}
              {/* <div className='flex flex-col pb-2 sm:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Responsable</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className='w-full border-0 bg-transparent p-0 h-auto font-medium text-gray-900 focus:ring-0 focus:ring-offset-0 hover:text-blue-600 shadow-none'>
                    <SelectValue placeholder='Todos los agentes' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los agentes</SelectItem>
                    {responsibleOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className='flex flex-col pb-2 sm:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Origen</label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className='w-full border-0 bg-transparent p-0 h-auto font-medium text-gray-900 focus:ring-0 focus:ring-offset-0 hover:text-blue-600 shadow-none'>
                    <SelectValue placeholder='Todos' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {sourceOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col pb-2 lg:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Interés</label>
                <Select value={selectedInterest} onValueChange={setSelectedInterest}>
                  <SelectTrigger className='w-full border-0 bg-transparent p-0 h-auto font-medium text-gray-900 focus:ring-0 focus:ring-offset-0 hover:text-blue-600 shadow-none'>
                    <SelectValue placeholder='Cualquier operación' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cualquier operación</SelectItem>
                    {interestOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col pb-2 lg:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Estado de la República</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className='w-full border-0 bg-transparent p-0 h-auto font-medium text-gray-900 focus:ring-0 focus:ring-offset-0 hover:text-blue-600 shadow-none'>
                    <SelectValue placeholder='Todos los estados' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="cdmx">Ciudad de México</SelectItem>
                    <SelectItem value="jalisco">Jalisco</SelectItem>
                    <SelectItem value="nuevo_leon">Nuevo León</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Table data={filteredClients} headers={headers} renderRow={renderRow} isLoading={initialLoading || isPageLoading} />

          {pagination.total_paginas > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_paginas}
              onPageChange={setCurrentPage}
              disabled={initialLoading || isPageLoading}
            />
          )}
        </div>
      </div>

      {/* Filter Sidebar de Filtros Aplicados */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onClear={handleClearFilters}
        onApply={handleApplyFilters}
        title="Filtros Aplicados"
      >
        <div className="space-y-4">
          {activeFiltersCount === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No hay filtros aplicados actualmente.</p>
          ) : (
            <div className="space-y-5">
              {selectedStatus !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estatus</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar estatus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estatus</SelectItem>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedType !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo de cliente</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedSource !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Origen</label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar origen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los orígenes</SelectItem>
                      {sourceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedInterest !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Interés</label>
                  <Select value={selectedInterest} onValueChange={setSelectedInterest}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar interés" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Cualquier interés</SelectItem>
                      {interestOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedState !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado de la República</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="cdmx">Ciudad de México</SelectItem>
                      <SelectItem value="jalisco">Jalisco</SelectItem>
                      <SelectItem value="nuevo_leon">Nuevo León</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
      </FilterSidebar>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Cliente"
        itemName={deleteModal.item?.nombre || ''}
        itemDetails={deleteModal.item ? [
          { label: 'Email', value: deleteModal.item.contacto?.email || '-' },
          { label: 'Tipo', value: deleteModal.item.tipo_cliente || '-' },
          { label: 'Interés', value: deleteModal.item.interes_principal || '-' },
          { label: 'Teléfono', value: deleteModal.item.contacto?.telefono || '-' }
        ] : []}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default ClientsList;
