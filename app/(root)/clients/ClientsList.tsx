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
import { GetEstados } from '@/lib/api/property/property-api';
import { Pagination as PaginationType } from '@/lib/@type';
import { Pagination } from '@/components/ui/Pagination';
import { formatInterestLabel, normalizeInterest } from '@/lib/utils/catalog';

const headers = [
  'Cliente',
  'Contacto',
  'Tipo',
  'Estado',
  'Interés principal',
  'Origen',
  'Agente',
  'Creado en',
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

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (selectedSource !== 'all') count++;
    if (selectedInterest !== 'all') count++;
    if (selectedAgent !== 'all') count++;
    return count;
  }, [selectedStatus, selectedType, selectedSource, selectedInterest, selectedAgent]);

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedSource("all");
    setSelectedInterest("all");
    setSelectedAgent("all");
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
  const [agentOptions, setAgentOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { GetAllUsers } = await import('@/lib/api/user-api');

        // Helper to fetch catalog safely (ignora errores 404)
        const safeCatalog = async (name: string) => {
          try {
            return await GetCatalogByName(name);
          } catch (e: any) {
            if (e?.response?.status === 404) return null;
            throw e;
          }
        };

        const [segmentRes, statusRes, sourceRes, interestRes, usersRes] = await Promise.all([
          safeCatalog('client-type'),
          safeCatalog('client-status'),
          safeCatalog('client-origin'),
          safeCatalog('operation-type') || safeCatalog('primary_interest'),
          GetAllUsers({ perPage: 100 })
        ]);

        const extractItems = (res: any) => {
          if (!res?.data) return [];
          if (res.data.items) return res.data.items;
          if (res.data.catalogItems) return res.data.catalogItems;
          if (Array.isArray(res.data)) return res.data;
          return [];
        };

        const mapOptions = (items: any[]) => items.map((i: any) => ({ value: i.name, label: i.name }));

        const types = extractItems(segmentRes);
        if (types.length > 0) setTypeOptions(mapOptions(types));

        const statuses = extractItems(statusRes);
        if (statuses.length > 0) setStatusOptions(mapOptions(statuses));

        const sources = extractItems(sourceRes);
        if (sources.length > 0) setSourceOptions(mapOptions(sources));

        const interests = extractItems(interestRes);
        if (interests.length > 0) {
          setInterestOptions(interests.map((i: any) => ({
            value: normalizeInterest(i.value || i.name) || i.name,
            label: i.name || formatInterestLabel(i.value)
          })));
        } else {
          setInterestOptions([
            { value: 'compra', label: 'Compra' },
            { value: 'renta', label: 'Renta' },
            { value: 'venta', label: 'Venta' }
          ]);
        }

        // Extraer agentes del listado de usuarios
        const users = usersRes?.data?.users || [];
        const agents = users
          .filter((u: any) => u.role === 'Agente' || u.role?.name === 'Agente' || String(u.role).toLowerCase().includes('agente'))
          .map((u: any) => ({
            label: `${u.name || ''} ${u.paternal_last_name || ''} ${u.maternal_last_name || ''}`.trim().replace(/\s+/g, ' '),
            value: String(u.user_id || u.id)
          }));
        if (agents.length > 0) setAgentOptions(agents);

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
        c.name?.toLowerCase().includes(term) ||
        c.contact?.email?.toLowerCase().includes(term) ||
        c.contact?.phone?.toLowerCase().includes(term) ||
        c.tax_id?.toLowerCase().includes(term);

      const matchesStatus = selectedStatus === "all" || c.client_status === selectedStatus;
      const matchesType = selectedType === "all" || c.client_type === selectedType;
      const matchesAgent = selectedAgent === "all" || String(c.agent?.id || c.agent_id) === selectedAgent;
      const matchesSource = selectedSource === "all" || c.lead_source === selectedSource;
      const matchesInterest = selectedInterest === "all" || normalizeInterest(c.main_interest) === normalizeInterest(selectedInterest);

      return matchesSearch && matchesStatus && matchesType && matchesAgent && matchesSource && matchesInterest;
    });
  }, [clients, searchTerm, selectedStatus, selectedType, selectedAgent, selectedSource, selectedInterest]);

  const handleDeleteClick = (item: any) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      const hasLinkedProperty = deleteModal.item.property || deleteModal.item.property_id || deleteModal.item.linked_properties > 0;

      if (hasLinkedProperty) {
        // Si tiene propiedad vinculada, solo lo desactivamos (soft delete)
        await DesactiveClient(deleteModal.item.id, { client_status: "inactivo" });
        setClients(prev => prev.filter(c => c.id !== deleteModal.item.id));
        showToast.success("El cliente tiene propiedades vinculadas, ha sido desactivado correctamente.");
      } else {
        // Si no tiene propiedades vinculadas, lo eliminamos completamente
        await DeleteClient(deleteModal.item.id);
        setClients(prev => prev.filter(c => c.id !== deleteModal.item.id));
        showToast.success("El cliente ha sido eliminado correctamente.");
      }
    } catch (error: any) {
      showToast.error(error?.response?.data?.detail || "Error al procesar la solicitud");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const renderRow = (row: any, index: number) => (
    <tr key={row.id || index} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center'>
            <Image
              src={'/user.svg'}
              alt={row.name || 'Cliente'}
              width={28}
              height={28}
              className='object-contain'
            />
          </div>
          <div>
            <p className='font-medium text-sm'>{row.name || '-'}</p>
            <p className='text-xs text-gray-500'>CLI-{row.id}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4'>
        <div>
          <p className='text-sm'>{row.contact?.email || '-'}</p>
          <p className='text-xs text-gray-500'>{row.contact?.phone || '-'}</p>
        </div>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.client_type || '-'}</td>
      <td className='py-4 px-4'>
        <Tag
          status={row.client_status}
          variant={row.client_status === 'activo' ? 'emerald' : 'red'}
        >
          {row.client_status || 'Unknown'}
        </Tag>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{formatInterestLabel(row.main_interest)}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.origin || '-'}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.agent?.name || row.agent_id || '-'}</td>
      <td className='py-4 px-4 text-sm text-gray-500'>
        {row.created_date ? new Date(row.created_date).toLocaleDateString('es-MX', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
      </td>
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap max-w-full">
      <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">{label}:</span>
      <div className="flex flex-wrap items-center gap-1.5 py-1">
        <button
          onClick={() => onChange('all')}
          className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            selectedValue === 'all'
              ? 'bg-primary_color text-white font-medium shadow-md'
              : 'bg-slate-100 text-gray-600 hover:bg-slate-200 active:scale-95'
          }`}
        >
          Todos
        </button>
        {options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              selectedValue === opt.value
                ? 'bg-primary_color text-white font-medium shadow-md'
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
                className='p-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center relative border border-slate-200 shadow-sm gap-2'
              >
                <SlidersHorizontal className='w-5 h-5' />
                <span className='text-sm text-gray-600'>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-primary_color text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm'>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <Link href='/clients/add-client' className='w-full sm:w-auto'>
                <button type='button'
                  className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md text-sm sm:text-base'>
                  <UserPlus size={18} className='sm:w-5 sm:h-5' /> <span className='hidden sm:inline'>Agregar Cliente</span><span className='sm:hidden'>Agregar</span>
                </button>
              </Link>
            </div>
          </div>

          <div className='mb-6 space-y-6'>
            {/* Buscador y Estatus al lado derecho */}
            <div className='flex flex-col sm:flex-row sm:items-end gap-4 w-full'>
              <div className='max-w-[420px] w-full'>
                <Search
                  title='Buscar por nombre, email, teléfono, RFC o CURP'
                  className='w-full'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='flex flex-col w-full sm:w-[200px]'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Estatus</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Todos los estatus' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estatus</SelectItem>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Píldoras de Filtros - Tipo de cliente e Interés principal */}
            <div className='flex flex-col xl:flex-row xl:items-center gap-6 w-full py-1'>
              <FilterPills
                label="Tipo de cliente"
                options={typeOptions}
                selectedValue={selectedType}
                onChange={setSelectedType}
              />
              <FilterPills
                label="Interés principal"
                options={interestOptions}
                selectedValue={selectedInterest}
                onChange={setSelectedInterest}
              />
            </div>

            {/* Filtros Secundarios Desplegables: Agente y Origen del prospecto */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className='flex flex-col pb-2 sm:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Agente</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Todos los agentes' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los agentes</SelectItem>
                    {agentOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col pb-2 sm:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Origen del prospecto</label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Seleccione una opción' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {sourceOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
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
        itemName={deleteModal.item?.name || ''}
        itemDetails={deleteModal.item ? [
          { label: 'Email', value: deleteModal.item.contact?.email || '-' },
          { label: 'Tipo', value: deleteModal.item.client_type || '-' },
          { label: 'Interés', value: formatInterestLabel(deleteModal.item.main_interest) },
          { label: 'Teléfono', value: deleteModal.item.contact?.phone || '-' },
          { label: 'Origen', value: deleteModal.item.origin || '-' }
        ] : []}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default ClientsList;
