"use client"

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Plus, SlidersHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from '@/components/ui/badges';
import Link from 'next/link';
import Search from '@/components/ui/Search';
import { Table } from '@/components/ui/table';
import { operationProperty, statusProperty, typeProperty, webPublication } from '@/components/SelectProperties.data';
import Breadcrumb from '@/components/ui/breadcrumb';
import { GetAllProperties, DeleteProperty } from '@/lib/api/property/property-api';
import FilterSidebar from '@/components/ui/FilterSidebar';
import Tooltip from '@/components/ui/Tooltip';
import DeleteModal from '@/components/ui/DeleteModal';
import { PropertyListItemResponse, Pagination as PaginationType } from '@/lib/@type';
import { Pagination } from '@/components/ui/Pagination';
import { showToast } from 'nextjs-toast-notify';

const headers = ['Propiedad', 'Tipo', 'Operación', 'Precio', 'Dirección', 'Estatus', 'Publicación web', 'Fecha alta', 'Destacada', 'Acciones'];

function PropertyList({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: PropertyListItemResponse | null }>({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [properties, setProperties] = useState<PropertyListItemResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedOperation, setSelectedOperation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPublication, setSelectedPublication] = useState("all");
  const [isFeatured, setIsFeatured] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    pagina_actual: 1,
    registros_por_pagina: 10,
    total_paginas: 1
  });
  const [isPageLoading, setIsPageLoading] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (selectedOperation !== 'all') count++;
    if (selectedPublication !== 'all') count++;
    if (isFeatured) count++;
    return count;
  }, [selectedStatus, selectedType, selectedOperation, selectedPublication, isFeatured]);

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedOperation("all");
    setSelectedPublication("all");
    setIsFeatured(false);
    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const FilterPills = ({ label, options, selectedValue, onChange }: { label: string, options: any[], selectedValue: string, onChange: (val: string) => void }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
      <span className="text-sm font-semibold text-gray-500 whitespace-nowrap sm:min-w-[120px]">{label}:</span>
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

  const fetchProperties = async (page: number) => {
    setIsPageLoading(true);
    try {
      const response = await GetAllProperties(page);
      if (response.data?.properties) {
        setProperties(response.data.properties);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        showToast.error(error?.response?.data?.detail || "Solo los administradores pueden listar propiedades", {
          duration: 5000, position: "top-right", transition: "topBounce", icon: "", sound: true,
        })
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  const formatAddress = (address: PropertyListItemResponse['address']) => {
    if (!address || address.length === 0) return '-';
    const addr = address[0];
    return `${addr.street} ${addr.street_number}, ${addr.neighborhood}, ${addr.city}, ${addr.state}`;
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
  };

  const formatOperationType = (op: string) => {
    const map: Record<string, string> = { sale: 'Venta', rent: 'Renta', both: 'Venta/Renta' };
    return map[op] || op;
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || p.title?.toLowerCase().includes(term) || p.number_mls?.toLowerCase().includes(term) || formatAddress(p.address).toLowerCase().includes(term);
      const matchesType = selectedType === "all" || p.property_type?.name === selectedType;
      const matchesOperation = selectedOperation === "all" || p.operation_type === selectedOperation || formatOperationType(p.operation_type) === selectedOperation;
      const matchesStatus = selectedStatus === "all" || p.property_status === selectedStatus;
      const matchesPublication = selectedPublication === "all" || p.property_post_status?.name === selectedPublication;
      const matchesFeatured = !isFeatured || p.is_featured === true; // Ajustar campo si es diferente
      return matchesSearch && matchesType && matchesOperation && matchesStatus && matchesPublication && matchesFeatured;
    });
  }, [properties, searchTerm, selectedType, selectedOperation, selectedStatus, selectedPublication, isFeatured]);

  const handleDeleteClick = (item: PropertyListItemResponse) => setDeleteModal({ isOpen: true, item });

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      await DeleteProperty(String(deleteModal.item.property_id));
      setProperties(prev => prev.filter(p => p.property_id !== deleteModal.item?.property_id));
      showToast.success("Propiedad eliminada correctamente");
    } catch (error) {
      showToast.error("Error al eliminar la propiedad");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const renderRow = (property: PropertyListItemResponse) => (
    <tr key={property.property_id} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <Image src={'/property.svg'} alt={property.title || 'Property'} width={60} height={60} className='rounded-lg object-cover w-[60px] h-[60px]' />
          <div>
            <p className='font-medium text-sm text-gray-900'>{property.title || '-'}</p>
            <p className='text-xs text-gray-500'>{property.number_mls || '-'}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-4 text-sm text-gray-700'>{property.property_type?.name || '-'}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{formatOperationType(property.operation_type)}</td>
      <td className='py-4 px-4 text-sm text-gray-700 font-medium'>{formatPrice(property.price)}</td>
      <td className='py-4 px-4 text-sm text-gray-700'>{formatAddress(property.address)}</td>
      <td className='py-4 px-4'><Tag status={property.property_status} statusType='property'>{property.property_status || '-'}</Tag></td>
      <td className='py-4 px-4'><Tag status={property.property_post_status?.name} statusType='publication'>{property.property_post_status?.name || '-'}</Tag></td>
      <td className='py-4 px-4 text-sm text-gray-700'>{property.created_at ? new Date(property.created_at).toLocaleDateString('es-MX') : '-'}</td>
      <td className='py-4 px-4'><div className='flex items-center justify-center'><span className='text-xs text-gray-400'>-</span></div></td>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <Tooltip content="Ver detalle">
            <Link href={`/property/${property.property_id}`}><button className='p-1.5 bg-slate-200 rounded-md hover:bg-slate-300'><Eye size={16} className='text-gray-600' /></button></Link>
          </Tooltip>
          <Tooltip content="Editar">
            <Link href={`/property/edit-property/${property.property_id}`}><button className='p-1.5 bg-slate-200 rounded-md hover:bg-slate-300'><Pencil size={16} className='text-gray-600' /></button></Link>
          </Tooltip>
          <Tooltip content="Eliminar">
            <button onClick={() => handleDeleteClick(property)} className='p-1.5 bg-red-500 rounded-md hover:bg-red-600'><Trash2 size={16} className='text-white' /></button>
          </Tooltip>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Propiedades', href: '/property', active: true }]} />
      <div className='bg-white w-full max-h-max rounded-lg p-4 sm:p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
            <div>
              <h1 className='text-black font-[700] text-xl sm:text-2xl'>Propiedades</h1>
              <p className='text-sm sm:text-md text-gray-500'>Listado principal de propiedades</p>
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
              <Link href="/property/add-property" className='w-full sm:w-auto'>
                <button type="button" className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium text-sm sm:text-base">
                  <Plus size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Agregar Propiedad</span><span className="sm:hidden">Agregar</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="mb-6 space-y-6">
            {/* Buscador y Estatus Lado a Lado */}
            <div className='flex flex-col lg:flex-row lg:items-center gap-4 w-full'>
              <Search
                title="Buscar por dirección, código postal, ciudad, etc."
                className="max-w-[450px] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className='flex-shrink-0 flex items-center justify-start lg:justify-end min-w-max gap-3'>
                <FilterPills
                  label="Estatus"
                  options={statusProperty}
                  selectedValue={selectedStatus}
                  onChange={setSelectedStatus}
                />
              </div>
            </div>

            {/* Píldoras de Filtro Tipo de Propiedad */}
            <div className='py-1'>
              <FilterPills
                label="Tipo de propiedad"
                options={typeProperty}
                selectedValue={selectedType}
                onChange={setSelectedType}
              />
            </div>

            {/* Filtros Secundarios Desplegables */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              <div className='flex flex-col pb-2 sm:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Operación</label>
                <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                  <SelectTrigger className='w-full border-0 bg-transparent p-0 h-auto font-medium text-gray-900 focus:ring-0 focus:ring-offset-0 hover:text-blue-600 shadow-none'>
                    <SelectValue placeholder='Todas las operaciones' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las operaciones</SelectItem>
                    {operationProperty.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col pb-2 sm:pb-0'>
                <label className="text-xs text-gray-500 mb-1 font-semibold">Publicación Web</label>
                <Select value={selectedPublication} onValueChange={setSelectedPublication}>
                  <SelectTrigger className='w-full border-0 bg-transparent p-0 h-auto font-medium text-gray-900 focus:ring-0 focus:ring-offset-0 hover:text-blue-600 shadow-none'>
                    <SelectValue placeholder='Todas las publicaciones' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las publicaciones</SelectItem>
                    {webPublication.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center gap-2.5 pb-2 lg:pb-0 h-full sm:pt-6'>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={isFeatured} 
                    onChange={(e) => setIsFeatured(e.target.checked)} 
                    className="w-4.5 h-4.5 rounded border-gray-300 text-primary_color focus:ring-primary_color cursor-pointer transition-colors" 
                  />
                  <span className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Solo destacadas</span>
                </label>
              </div>
            </div>
          </div>

          <Table data={filteredProperties} headers={headers} renderRow={renderRow} isLoading={isLoading || isPageLoading} />

          {pagination.total_paginas > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_paginas}
              onPageChange={setCurrentPage}
              disabled={isLoading || isPageLoading}
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
                      {statusProperty.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedType !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo de propiedad</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {typeProperty.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedOperation !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Operación</label>
                  <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar operación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las operaciones</SelectItem>
                      {operationProperty.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedPublication !== 'all' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Publicación Web</label>
                  <Select value={selectedPublication} onValueChange={setSelectedPublication}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar publicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las publicaciones</SelectItem>
                      {webPublication.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {isFeatured && (
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100 mt-2">
                  <input 
                    type="checkbox" 
                    checked={isFeatured} 
                    onChange={(e) => setIsFeatured(e.target.checked)} 
                    className="w-4.5 h-4.5 rounded border-gray-300 text-primary_color focus:ring-primary_color cursor-pointer transition-colors" 
                  />
                  <span className="text-sm font-semibold text-gray-700 select-none">Solo destacadas</span>
                </div>
              )}
            </div>
          )}
        </div>
      </FilterSidebar>

      <DeleteModal
        isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, item: null })} onConfirm={handleDeleteConfirm} title="Eliminar Propiedad"
        itemName={deleteModal.item?.title || ''} isDeleting={isDeleting}
        itemDetails={deleteModal.item ? [{ label: 'Tipo', value: deleteModal.item.property_type?.name || '-' }, { label: 'Operación', value: formatOperationType(deleteModal.item.operation_type) || '-' }, { label: 'Precio', value: formatPrice(deleteModal.item.price) || '-' }, { label: 'Ubicación', value: formatAddress(deleteModal.item.address) || '-' }] : []}
      />
    </>
  );
}

export default PropertyList;