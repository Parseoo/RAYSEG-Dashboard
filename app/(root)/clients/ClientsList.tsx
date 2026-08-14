"use client"

import { useState, useEffect, useMemo } from 'react';
import { showToast } from 'nextjs-toast-notify';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Eye, Pencil, Trash2, UserPlus, User, MoreVertical, X } from 'lucide-react';
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
import { formatInterestLabel, normalizeInterest } from '@/lib/utils/catalog';
import { getUserImageUrl } from '@/lib/utils';

const headers = [
  'Cliente',
  'Contacto',
  'Tipo',
  'Estado',
  'Interés principal',
  'Origen',
  'Agente',
  'Fecha de Creación',
  'Acciones'
];

function ClientsList({ data: initialData, isLoading: initialLoading }: { readonly data: any[]; readonly isLoading: boolean }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: any | null }>({
    isOpen: false,
    item: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | number | null>(null);
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
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [interestOptions, setInterestOptions] = useState<any[]>([]);
  const [interestCatalog, setInterestCatalog] = useState<any[]>([]);
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
          setInterestCatalog(interests);
          setInterestOptions(interests.map((i: any) => ({
            value: normalizeInterest(i.value || i.name) || i.name,
            label: i.name || formatInterestLabel(i.value)
          })));
        } else {
          setInterestOptions([]);
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
          <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center'>
            {getUserImageUrl(row.profile_photo || row.profile_picture) && !getUserImageUrl(row.profile_photo || row.profile_picture).includes('ui-avatars.com') ? (
              <Image
                src={getUserImageUrl(row.profile_photo || row.profile_picture)}
                alt={row.name || 'Cliente'}
                fill
                sizes="48px"
                unoptimized={true}

                className='object-cover'
              />
            ) : (
              <User className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <div>
            <p className='font-medium text-sm'>{row.name}</p>
            <p className='text-xs text-gray-500'>CLI-{row.id}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4'>
        <div>
          <p className='text-sm'>{row.contact?.email}</p>
          <p className='text-xs text-gray-500'>{row.contact?.phone}</p>
        </div>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.client_type}</td>
      <td className='py-4 px-4'>
        <Tag
          status={row.client_status}
          variant="blue"
        >
          {row.client_status || 'Unknown'}
        </Tag>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{formatInterestLabel(row.main_interest, interestCatalog)}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.origin}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{row.agent?.name || row.agent_id}</td>
      <td className='py-4 px-4 text-sm text-gray-500'>
        {row.created_date ? new Date(row.created_date).toLocaleDateString('es-MX', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
      </td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <Tooltip content="Ver detalle">
            <Link href={`/clients/${row.id}`}>
              <button type='button' className='p-1.5 bg-slate-200 rounded-md transition-all hover:bg-slate-300'>
                <Eye size={16} className='text-gray-600' />
              </button>
            </Link>
          </Tooltip>
          <Tooltip content="Editar">
            <Link href={`/clients/edit-client/${row.id}`}>
              <button type='button' className='p-1.5 bg-slate-200 rounded-md transition-all hover:bg-slate-300'>
                <Pencil size={16} className='text-gray-600' />
              </button>
            </Link>
          </Tooltip>
          <Tooltip content="Eliminar">
            <button type='button'
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

  const toggleActionMenu = (id: string | number) => {
    setOpenActionMenu(prev => prev === id ? null : id);
  };

  const renderMobileCard = (row: any, index: number) => (
    <div key={row.id || index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative">
      {/* Header: Image, Info and Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center'>
            {getUserImageUrl(row.profile_photo || row.profile_picture) && !getUserImageUrl(row.profile_photo || row.profile_picture).includes('ui-avatars.com') ? (
              <Image
                src={getUserImageUrl(row.profile_photo || row.profile_picture)}
                alt={row.name || 'Cliente'}
                fill
                sizes="48px"
                unoptimized={true}

                className='object-cover'
              />
            ) : (
              <User className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <div>
            <p className='font-bold text-base text-gray-800'>{row.name}</p>
            <p className='text-xs text-gray-500'>CLI-{row.id}</p>
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative">
          <button type='button'
            onClick={() => toggleActionMenu(row.id)}
            className="p-1.5 text-gray-500 hover:bg-slate-100 rounded-md transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {openActionMenu === row.id && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
              <Link href={`/clients/${row.id}`}>
                <button type='button' className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2">
                  <Eye size={16} /> Ver
                </button>
              </Link>
              <Link href={`/clients/edit-client/${row.id}`}>
                <button type='button' className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2">
                  <Pencil size={16} /> Editar
                </button>
              </Link>
              <button type='button'
                onClick={() => {
                  setOpenActionMenu(null);
                  handleDeleteClick(row);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-0.5">Contacto</p>
          <p className="truncate" title={row.contact?.email}>{row.contact?.email}</p>
          <p className="text-xs text-gray-600">{row.contact?.phone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-0.5">Estado</p>
          <Tag status={row.client_status} variant="blue">
            {row.client_status || 'Unknown'}
          </Tag>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-0.5">Tipo</p>
          <p>{row.client_type}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-0.5">Interés principal</p>
          <p className="font-medium">{formatInterestLabel(row.main_interest, interestCatalog)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-0.5">Origen</p>
          <p>{row.origin}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-0.5">Agente</p>
          <p className="truncate" title={row.agent?.name || row.agent_id}>{row.agent?.name || row.agent_id}</p>
        </div>
      </div>
    </div>
  );

  const FilterPills = ({ label, options, selectedValue, onChange }: { label: string, options: any[], selectedValue: string, onChange: (val: string) => void }) => (
    <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3 w-auto">
      <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{label}:</span>
      <div className="flex flex-wrap items-center gap-1.5 py-1">
        <button type='button'
          onClick={() => onChange('all')}
          className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${selectedValue === 'all'
              ? 'bg-primary_color text-white font-medium shadow-md'
              : 'bg-slate-100 text-gray-600 hover:bg-slate-200 active:scale-95'
            }`}
        >
          Todos
        </button>
        {options.map((opt: any) => (
          <button type='button'
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${selectedValue === opt.value
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
              {activeFiltersCount > 0 && (
                <button
                  type='button'
                  onClick={handleClearFilters}
                  className='hidden sm:flex p-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors items-center justify-center relative border border-slate-200 shadow-sm gap-2'
                >
                  <X className='w-5 h-5 text-gray-600' />
                  <span className='text-sm text-gray-600'>Limpiar Filtros</span>
                </button>
              )}
              <Link href='/clients/add-client' className='w-full sm:w-auto'>
                <button type='button'
                  className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md text-sm sm:text-base'>
                  <UserPlus size={18} className='sm:w-5 sm:h-5' /> <span className='hidden sm:inline'>Agregar Cliente</span><span className='sm:hidden'>Agregar</span>
                </button>
              </Link>
            </div>
          </div>

          <div className='mb-6 space-y-6'>
            {/* Buscador y Filtros */}
            <div className='flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 lg:gap-6 w-full'>
              <div className='flex items-center gap-2 w-full lg:w-fit lg:max-w-none'>
                <div className='flex-1'>
                  <Search
                    title='Buscar por nombre, email, teléfono, RFC o CURP'
                    className='w-full lg:w-[450px]'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type='button'
                  onClick={() => setIsFilterOpen(true)}
                  className='sm:hidden h-[40px] px-3.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center relative border border-slate-200 shadow-sm shrink-0'
                >
                  <SlidersHorizontal className='w-5 h-5 text-gray-600' />
                  {activeFiltersCount > 0 && (
                    <span className='absolute -top-2 -right-2 bg-primary_color text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm'>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
              <div className='hidden sm:flex flex-col w-full sm:w-[200px]'>
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
              <div className='hidden sm:block flex-auto lg:flex-none'>
                <FilterPills
                  label="Tipo de cliente"
                  options={typeOptions}
                  selectedValue={selectedType}
                  onChange={setSelectedType}
                />
              </div>
              <div className='hidden sm:block flex-auto lg:flex-none'>
                <FilterPills
                  label="Interés principal"
                  options={interestOptions}
                  selectedValue={selectedInterest}
                  onChange={setSelectedInterest}
                />
              </div>
            </div>

            {/* Filtros Secundarios Desplegables: Agente y Origen del prospecto */}
            <div className='hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-6'>
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

          <div className="hidden md:block">
            <Table data={filteredClients} headers={headers} renderRow={renderRow} isLoading={initialLoading || isPageLoading} />
          </div>

          <div className="md:hidden mt-4">
            {initialLoading || isPageLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color"></div>
              </div>
            ) : filteredClients.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredClients.map((row, idx) => renderMobileCard(row, idx))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-slate-100">
                No hay registros disponibles
              </div>
            )}
          </div>

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
        title="Filtros"
      >
        <div className="space-y-6 pt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Estatus</label>
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Tipo de cliente</label>
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Origen</label>
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Interés</label>
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Agente</label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los agentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los agentes</SelectItem>
                {agentOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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
        title="Eliminar Cliente"
        itemName={deleteModal.item?.name || ''}
        itemDetails={deleteModal.item ? [
          { label: 'Email', value: deleteModal.item.contact?.email },
          { label: 'Tipo', value: deleteModal.item.client_type },
          { label: 'Interés', value: formatInterestLabel(deleteModal.item.main_interest, interestCatalog) },
          { label: 'Teléfono', value: deleteModal.item.contact?.phone },
          { label: 'Origen', value: deleteModal.item.origin }
        ] : []}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default ClientsList;
