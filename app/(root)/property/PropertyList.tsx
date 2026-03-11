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
import { PropertyListItemResponse } from '@/lib/@type';
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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await GetAllProperties();
        if (response.data?.properties) setProperties(response.data.properties);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          showToast.error(error?.response?.data?.detail || "Solo los administradores pueden listar propiedades", {
            duration: 5000, position: "top-right", transition: "topBounce", icon: "", sound: true,
          })
        }
      }
    };
    fetchProperties();
  }, []);

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
          </div>
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Search
              title="Buscar por dirección, código postal, ciudad, etc."
              className="w-full sm:min-w-[400px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={() => setIsFilterOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><SlidersHorizontal className="w-5 h-5" /></button>
              <Link href="/property/add-property">
                <button type="button" className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium text-sm sm:text-base">
                  <Plus size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Agregar Propiedad</span><span className="sm:hidden">Agregar</span>
                </button>
              </Link>
            </div>
          </div>
          <Table data={filteredProperties} headers={headers} renderRow={renderRow} isLoading={isLoading} />
        </div>
      </div>
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filtrar Propiedades">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Propiedad</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {typeProperty.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <Select><SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
              <SelectContent><SelectItem value="Estados">Estados</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operación</label>
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar operación" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las operaciones</SelectItem>
                {operationProperty.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estatus</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar estatus" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estatus</SelectItem>
                {statusProperty.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publicación Web</label>
            <Select value={selectedPublication} onValueChange={setSelectedPublication}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar publicación" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las publicaciones</SelectItem>
                {webPublication.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700">Solo destacadas</span>
            </label>
          </div>
          <button onClick={() => { setSearchTerm(""); setSelectedType("all"); setSelectedOperation("all"); setSelectedStatus("all"); setSelectedPublication("all"); setIsFeatured(false); }} className="w-full py-2 text-sm text-primary_color font-medium border border-primary_color rounded-lg hover:bg-slate-50 transition-colors">Limpiar filtros</button>
        </div>
      </FilterSidebar>

      <DeleteModal
        isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, item: null })} onConfirm={handleDeleteConfirm} title="Eliminar Propiedad"
        itemName={deleteModal.item?.title || ''} isDeleting={isDeleting}
        itemDetails={deleteModal.item ? [{ label: 'Tipo', value: deleteModal.item.property_type?.name || '-' }, { label: 'Operación', value: formatOperationType(deleteModal.item.operation_type) || '-' }, { label: 'Precio', value: formatPrice(deleteModal.item.price) || '-' }, { label: 'Ubicación', value: formatAddress(deleteModal.item.address) || '-' }] : []}
      />
    </>
  )
}

export default PropertyList