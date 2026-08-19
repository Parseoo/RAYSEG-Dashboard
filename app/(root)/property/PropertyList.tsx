"use client"

import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Plus, SlidersHorizontal, Eye, Pencil, Trash2, Star, FileDown, X, Loader2, MoreVertical } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from '@/components/ui/badges';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Search from '@/components/ui/Search';
import { Table } from '@/components/ui/table';
import { operationProperty, statusProperty } from '@/components/SelectProperties.data';
import { GetCatalogPropertyTypes, GetPropertyOperationTypes, GetCatalogByName } from '@/lib/api/catalog-api';
import { resolveCatalogDisplayValue } from '@/lib/utils/catalog';
import Breadcrumb from '@/components/ui/breadcrumb';
import { GetAllProperties, DeleteProperty, GetEstados, GetCiudades } from '@/lib/api/property/property-api';
import { GetReportsProperties } from '@/lib/api/report-api';
import FilterSidebar from '@/components/ui/FilterSidebar';
import Tooltip from '@/components/ui/Tooltip';
import DeleteModal from '@/components/ui/DeleteModal';
import { PropertyListItemResponse, ItemResponse, Pagination as PaginationType } from '@/lib/@type';
import { Pagination } from '@/components/ui/Pagination';
import { showToast } from 'nextjs-toast-notify';
import { getImageUrl } from '@/lib/utils';

const headers = ['Propiedad', 'Tipo', 'Operación', 'Precio', 'Estatus', 'Publicación web', 'Fecha de Creación', 'Destacada', 'Acciones'];

function PropertyList({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: PropertyListItemResponse | null }>({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [properties, setProperties] = useState<PropertyListItemResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedOperation, setSelectedOperation] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedStatusProperty, setSelectedStatusProperty] = useState("all");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    pagina_actual: 1,
    registros_por_pagina: 10,
    total_paginas: 1
  });
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<{ label: string; value: string }[]>([]);
  const [operationCatalog, setOperationCatalog] = useState<ItemResponse[]>([]);
  const [propertyStateCatalog, setPropertyStateCatalog] = useState<ItemResponse[]>([]);
  const [operationOptions, setOperationOptions] = useState<{ label: string; value: string }[]>(operationProperty);
  const [availabilityOptions, setAvailabilityOptions] = useState<{ label: string; value: string }[]>(statusProperty);
  const [estados, setEstados] = useState<{ label: string; value: string }[]>([]);
  const [selectedEstado, setSelectedEstado] = useState("all");
  const [citiesOptions, setCitiesOptions] = useState<{ label: string; value: string }[]>([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfParams, setPdfParams] = useState({
    year: '',
    month: '',
    date_from: '',
    date_to: ''
  });
  const [openActionMenu, setOpenActionMenu] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      const [typesRes, operationRes, estadosRes, propertyStateRes] = await Promise.allSettled([
        GetCatalogPropertyTypes(),
        GetPropertyOperationTypes(),
        GetEstados(),
        GetCatalogByName('property-type-status'),
      ]);

      const extractItems = (res: any) => {
        if (!res) return [];
        const target = res?.value?.data || res?.value || res?.data || res;
        if (target?.items && Array.isArray(target.items)) return target.items;
        if (target?.catalogItems && Array.isArray(target.catalogItems)) return target.catalogItems;
        if (Array.isArray(target)) return target;
        return [];
      };

      if (typesRes.status === 'fulfilled') {
        const items = extractItems(typesRes);
        if (items.length > 0) {
          setPropertyTypeOptions(items.map((item: any) => ({ label: item.name, value: item.name })));
        }
      }

      if (operationRes.status === 'fulfilled') {
        const items = extractItems(operationRes);
        setOperationCatalog(items);
        if (items.length > 0) {
          setOperationOptions(items.map((item: any) => ({ label: item.name, value: item.name })));
        }
      }

      if (propertyStateRes.status === 'fulfilled') {
        const items = extractItems(propertyStateRes);
        setPropertyStateCatalog(items);
        if (items.length > 0) {
          setAvailabilityOptions(items.map((item: any) => ({ label: item.name, value: item.name })));
        }
      }

      console.log('estadosRes status:', estadosRes.status);
      if (estadosRes.status === 'fulfilled') {
        // La API externa devuelve: { data: { datos: [ { codigo_estado, estado } ] } }
        const rawData: any = estadosRes.value?.data || estadosRes.value;
        let estadosData: any[] = [];

        if (rawData?.datos && Array.isArray(rawData.datos)) {
          estadosData = rawData.datos;
        } else if (Array.isArray(rawData)) {
          estadosData = rawData;
        } else if (rawData?.data && Array.isArray(rawData.data)) {
          estadosData = rawData.data;
        }

        if (estadosData.length > 0) {
          setEstados(estadosData.map((item: any) => ({
            label: item.estado || item.nombre || item.name || String(item),
            value: item.codigo_estado || item.clave || item.id || String(item)
          })));
        }
      } else {
        console.error('Error fetching estados:', estadosRes.reason);
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedEstado === "all") {
        setCitiesOptions([]);
        setSelectedCity("all");
        return;
      }
      try {
        const res = await GetCiudades(selectedEstado);
        const rawData: any = res?.data || res;
        let ciudadesData: any[] = [];
        if (Array.isArray(rawData)) {
          ciudadesData = rawData;
        } else if (rawData?.datos && Array.isArray(rawData.datos)) {
          ciudadesData = rawData.datos;
        }

        setCitiesOptions(ciudadesData.map((item: any) => ({
          label: item.ciudad || item.nombre || String(item),
          value: item.ciudad || item.nombre || String(item)
        })));
        setSelectedCity("all");
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [selectedEstado]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedEstado !== 'all') count++;
    if (selectedCity !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (selectedOperation !== 'all') count++;
    if (selectedAvailability !== 'all') count++;
    if (selectedStatusProperty !== 'all') count++;
    if (isFeaturedOnly) count++;
    return count;
  }, [selectedEstado, selectedCity, selectedType, selectedOperation, selectedAvailability, selectedStatusProperty, isFeaturedOnly]);

  const handleClearFilters = () => {
    setSelectedEstado("all");
    setSelectedCity("all");
    setSelectedType("all");
    setSelectedOperation("all");
    setSelectedAvailability("all");
    setSelectedStatusProperty("all");
    setIsFeaturedOnly(false);
    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const handleGeneratePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const yearNum = pdfParams.year ? Number.parseInt(pdfParams.year) : undefined;
      const monthNum = pdfParams.month ? Number.parseInt(pdfParams.month) : undefined;

      const response = await GetReportsProperties({
        year: yearNum,
        month: monthNum,
        date_from: pdfParams.date_from || undefined,
        date_to: pdfParams.date_to || undefined
      });

      const blob = response.data;
      const contentType = blob.type;
      if (contentType !== 'application/pdf' && contentType !== 'application/octet-stream') {
        throw new Error("El contenido devuelto no es un reporte PDF válido.");
      }

      const url = window.URL.createObjectURL(blob);
      if (!url.startsWith('blob:')) {
        throw new Error("URL de descarga no segura.");
      }

      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_general_propiedades_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      showToast.success("PDF generado y descargado correctamente");
      setIsPdfModalOpen(false);
      setPdfParams({ year: '', month: '', date_from: '', date_to: '' });
    } catch (error: any) {
      console.error("Error al generar PDF:", error);
      showToast.error("Error al generar el reporte PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

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

  const formatAddress = (address: any) => {
    if (!address) return '-';
    const addr = Array.isArray(address) ? address[0] : address;
    if (!addr) return '-';
    
    let streetPart = addr.street || '';
    if (addr.exterior_number && addr.exterior_number !== 'S/N') streetPart += ` ${addr.exterior_number}`;
    if (addr.interior_number) streetPart += ` Int. ${addr.interior_number}`;
    
    const parts = [
      streetPart.trim(), 
      addr.neighborhood, 
      addr.city, 
      addr.state
    ].filter(Boolean);
    return parts.join(', ') || '-';
  };

  const getAddressString = (property: PropertyListItemResponse) => {
    if ((property as any).full_address) return (property as any).full_address;
    return formatAddress(property.address);
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price ? `${price} MXN` : '-';
    const formatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
    return `${formatted} MXN`;
  };

  const formatOperationType = useCallback((op: any) => {
    if (typeof op === 'object' && op !== null) return op.name || '-';
    return resolveCatalogDisplayValue(op, operationCatalog) || op || '-';
  }, [operationCatalog]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const term = searchTerm.toLowerCase().trim();
      const addr = p.address && p.address.length > 0 ? p.address[0] : null;
      const matchesSearch = !term ||
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        addr?.city?.toLowerCase().includes(term) ||
        addr?.neighborhood?.toLowerCase().includes(term) ||
        addr?.street?.toLowerCase().includes(term);

      const selectedEstadoObj = estados.find(e => e.value === selectedEstado);
      const matchesEstado = selectedEstado === "all" ||
        (selectedEstadoObj && addr?.state?.toLowerCase() === selectedEstadoObj.label.toLowerCase());

      const matchesCity = selectedCity === "all" || addr?.city === selectedCity;
      const matchesType = selectedType === "all" || p.property_type?.name === selectedType;

      const matchesOperation = selectedOperation === "all" ||
        p.operation_type === selectedOperation ||
        formatOperationType(p.operation_type) === selectedOperation;

      const matchesAvailability = selectedAvailability === "all" ||
        p.property_status === selectedAvailability ||
        resolveCatalogDisplayValue(p.property_status, propertyStateCatalog) === selectedAvailability;

      const matchesStatusProperty = selectedStatusProperty === "all" || p.property_post_status?.name === selectedStatusProperty;

      const checkIsFeatured = (val: any): boolean => {
        if (!val) return false;
        if (val === true || val === 1) return true;
        if (typeof val === 'string') {
          const lower = val.trim().toLowerCase();
          return lower === 'true' || lower === '1';
        }
        return false;
      };

      const matchesFeatured = !isFeaturedOnly || checkIsFeatured(p.is_featured);

      return matchesSearch && matchesEstado && matchesCity && matchesType && matchesOperation && matchesAvailability && matchesStatusProperty && matchesFeatured;
    });
  }, [properties, searchTerm, selectedEstado, selectedCity, selectedType, selectedOperation, selectedAvailability, selectedStatusProperty, isFeaturedOnly, formatOperationType, propertyStateCatalog, estados]);

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

  const renderRow = (property: PropertyListItemResponse) => {
    // Priorizar la imagen marcada como principal (is_main === true) dentro del arreglo `images`
    const images = (property as any).images;
    let imageUrl = '';

    if (images && Array.isArray(images) && images.length > 0) {
      const mainImage = images.find((img: any) => img.is_main === true || img.is_main === 1 || img.is_main === 'true' || img.isMain === true) || images[0];
      const imgPath = mainImage?.image || mainImage?.file || mainImage?.image_url || mainImage?.url || mainImage?.src || (typeof mainImage === 'string' ? mainImage : null);
      if (imgPath) {
        imageUrl = getImageUrl(imgPath);
      }
    } else if ((property as any).main_image) {
      const mainImg = (property as any).main_image;
      const imgPath = typeof mainImg === 'string' ? mainImg : (mainImg?.image || mainImg?.file || mainImg?.url || mainImg?.image_url);
      if (imgPath) {
        imageUrl = getImageUrl(imgPath);
      }
    } else if ((property as any).main_image_url) {
      imageUrl = getImageUrl((property as any).main_image_url);
    } else if ((property as any).mainImage) {
      const mainImg = (property as any).mainImage;
      const imgPath = typeof mainImg === 'string' ? mainImg : (mainImg?.image || mainImg?.file || mainImg?.url || mainImg?.image_url);
      if (imgPath) {
        imageUrl = getImageUrl(imgPath);
      }
    }

    return (
      <tr key={property.property_id} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
        <td className='py-4 px-4 min-w-[220px]'>
          <div className='flex items-center gap-3.5'>
            <div className='relative w-[84px] h-[58px] rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-sm'>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={property.title || 'Property'}
                  fill
                  sizes="84px"
                  unoptimized={true}
                  
                  className='object-cover'
                />
              )}
            </div>
            <div className='min-w-0 flex flex-col justify-center'>
              <p className='text-xs text-gray-500 font-medium line-clamp-1'>{property.number_mls || '-'}</p>
              <p className='font-semibold text-sm text-gray-900 line-clamp-1'>{property.title || '-'}</p>
              <p className='text-xs text-gray-500 line-clamp-1'>{getAddressString(property)}</p>
            </div>
          </div>
        </td>
        <td className='py-4 px-4 text-sm text-gray-700 whitespace-nowrap'>{property.property_type?.name || '-'}</td>
        <td className='py-4 px-4 text-sm text-gray-700 whitespace-nowrap'>{formatOperationType(property.operation_type)}</td>
        <td className='py-4 px-4 text-sm text-gray-700 font-medium whitespace-nowrap'>{formatPrice(property.price)}</td>
        <td className='py-4 px-4 whitespace-nowrap'><Tag status={property.property_status} statusType='property'>{property.property_status || '-'}</Tag></td>
        <td className='py-4 px-4 whitespace-nowrap'><Tag status={property.property_post_status?.name} statusType='publication'>{property.property_post_status?.name || '-'}</Tag></td>
        <td className='py-4 px-4 text-sm text-gray-700 whitespace-nowrap'>{property.created_at ? new Date(property.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</td>
        <td className='py-4 px-4 whitespace-nowrap'>
          <div className='flex items-center justify-center'>
            {((property.is_featured as any) === true || (property.is_featured as any) === 1 || String(property.is_featured).toLowerCase() === 'true' || String(property.is_featured) === '1') ? (
              <Star size={20} fill="#eab308" stroke="#eab308" />
            ) : (
              <Star size={20} fill="none" stroke="#eab308" />
            )}
          </div>
        </td>
        <td className='py-4 px-4 whitespace-nowrap'>
          <div className='flex items-center gap-2'>
            <Tooltip content="Ver detalle">
              <Link href={`/property/${property.property_id}`}><button type='button' className='p-1.5 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors'><Eye size={16} className='text-gray-600' /></button></Link>
            </Tooltip>
            <Tooltip content="Editar">
              <Link href={`/property/edit-property/${property.property_id}`}><button type='button' className='p-1.5 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors'><Pencil size={16} className='text-gray-600' /></button></Link>
            </Tooltip>
            <Tooltip content="Eliminar">
              <button type='button' onClick={() => handleDeleteClick(property)} className='p-1.5 bg-red-500 rounded-md hover:bg-red-600 transition-colors'><Trash2 size={16} className='text-white' /></button>
            </Tooltip>
          </div>
        </td>
      </tr>
    );
  };

  const toggleActionMenu = (id: string | number) => {
    setOpenActionMenu(prev => prev === id ? null : id);
  };

  const renderMobileCard = (property: PropertyListItemResponse) => {
    const images = (property as any).images;
    let imageUrl = '';

    if (images && Array.isArray(images) && images.length > 0) {
      const mainImage = images.find((img: any) => img.is_main === true || img.is_main === 1 || img.is_main === 'true' || img.isMain === true) || images[0];
      const imgPath = mainImage?.image || mainImage?.file || mainImage?.image_url || mainImage?.url || mainImage?.src || (typeof mainImage === 'string' ? mainImage : null);
      if (imgPath) imageUrl = getImageUrl(imgPath);
    } else if ((property as any).main_image || (property as any).main_image_url || (property as any).mainImage) {
      const mainImg = (property as any).main_image || (property as any).main_image_url || (property as any).mainImage;
      const imgPath = typeof mainImg === 'string' ? mainImg : (mainImg?.image || mainImg?.file || mainImg?.url || mainImg?.image_url);
      if (imgPath) imageUrl = getImageUrl(imgPath);
    }

    return (
      <Card key={property.property_id} className="overflow-hidden">
        {/* Image */}
        <div className="relative w-full h-48 bg-slate-100">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={property.title || 'Property'}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              unoptimized={true}
              
              className='object-cover'
            />
          )}
          {/* Actions Button */}
          <div className="absolute top-2 right-2">
            <button type='button'
              onClick={() => toggleActionMenu(property.property_id)}
              className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full shadow-md transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            
            {openActionMenu === property.property_id && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                <Link href={`/property/${property.property_id}`}>
                  <button type='button' className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2">
                    <Eye size={16} /> Ver detalle
                  </button>
                </Link>
                <Link href={`/property/edit-property/${property.property_id}`}>
                  <button type='button' className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2">
                    <Pencil size={16} /> Editar
                  </button>
                </Link>
                <button type='button'
                  onClick={() => {
                    setOpenActionMenu(null);
                    handleDeleteClick(property);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title, MLS and Address */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 font-medium mb-0.5">{property.number_mls || '-'}</p>
            <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-0.5">
              {property.title || '-'}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1">{getAddressString(property)}</p>
          </div>

          {/* Price */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-primary_color">
              {formatPrice(property.price)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-3 pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Tipo</p>
              <p className="text-gray-800">{property.property_type?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Operación</p>
              <p className="text-gray-800">{formatOperationType(property.operation_type)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Estatus</p>
              <Tag status={property.property_status} statusType='property'>
                {property.property_status || '-'}
              </Tag>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Publicación</p>
              <Tag status={property.property_post_status?.name} statusType='publication'>
                {property.property_post_status?.name || '-'}
              </Tag>
            </div>
          </div>

          {/* Footer with Featured Star and Date */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Fecha de Creación: {property.created_at ? new Date(property.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
            </div>
            <div className="flex items-center gap-1.5">
              {((property.is_featured as any) === true || (property.is_featured as any) === 1 || String(property.is_featured).toLowerCase() === 'true' || String(property.is_featured) === '1') ? (
                <Star size={20} fill="#eab308" stroke="#eab308" />
              ) : (
                <Star size={20} fill="none" stroke="#eab308" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Propiedades', href: '/property', active: true }]} />
      <Card className='w-full max-h-max mb-9'>
        <CardContent className="p-4 sm:p-5">
        <div className='w-full h-full'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5'>
            <div>
              <h1 className='text-black font-[700] text-xl sm:text-2xl'>Propiedades</h1>
              <p className='text-xs sm:text-sm text-gray-500'>Listado principal de propiedades</p>
            </div>
            <div className='flex items-center gap-3 w-full sm:w-auto justify-end'>
              {activeFiltersCount > 0 && (
                <button
                  type='button'
                  onClick={handleClearFilters}
                  className='hidden sm:flex h-[40px] px-3.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors items-center justify-center relative border border-slate-200 shadow-sm gap-2 shrink-0 font-medium text-xs sm:text-sm'
                >
                  <X className='w-4 h-4 sm:w-4.5 sm:h-4.5' />
                  <span>Limpiar Filtros</span>
                </button>
              )}
              <Link href="/property/add-property" className='flex-1 sm:flex-initial'>
                <button type="button" className="bg-primary_color text-white w-full sm:w-auto sm:min-w-[170px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-3 sm:px-4 hover:opacity-90 transition-opacity font-medium shadow-md text-xs sm:text-sm whitespace-nowrap">
                  <Plus size={18} /> <span>Agregar Propiedad</span>
                </button>
              </Link>
              <button
                type='button'
                onClick={() => setIsPdfModalOpen(true)}
                className='flex-1 sm:flex-initial bg-red-50 text-red-600 border border-red-200 w-full sm:w-auto sm:min-w-[140px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-3 sm:px-4 hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap'
              >
                <FileDown size={18} /> <span>Generar PDF</span>
              </button>
            </div>
          </div>

          <div className="mb-6 space-y-5">
            {/* Buscador, Botón Destacadas y Píldoras de Filtros */}
            <div className='flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 lg:gap-6 w-full'>
              <div className='flex items-center gap-2 w-full lg:w-fit lg:max-w-none'>
                <div className='flex-1'>
                  <Search
                    title='Buscar propiedad por título, ID o ubicación'
                    className='w-full lg:w-[450px]'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type='button'
                  onClick={() => setIsFilterOpen(true)}
                  className='sm:hidden h-[40px] px-3.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center relative border border-slate-200 shadow-sm shrink-0'
                  title="Filtros"
                >
                  <SlidersHorizontal className='w-5 h-5 text-gray-600' />
                  {activeFiltersCount > 0 && (
                    <span className='absolute -top-2 -right-2 bg-primary_color text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm'>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsFeaturedOnly(!isFeaturedOnly)}
                className={`hidden sm:flex h-[40px] px-4 rounded-lg items-center justify-center gap-2 font-medium text-xs sm:text-sm border transition-all duration-200 shrink-0 cursor-pointer whitespace-nowrap self-start sm:self-auto ${
                  isFeaturedOnly
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title="Filtrar sólo destacadas"
              >
                <Star size={18} fill={isFeaturedOnly ? "#eab308" : "none"} stroke="#eab308" />
                <span>Destacadas</span>
              </button>
              <div className='hidden sm:block flex-auto lg:flex-none'>
                <FilterPills
                  label="Operación"
                  options={operationOptions}
                  selectedValue={selectedOperation}
                  onChange={setSelectedOperation}
                />
              </div>
              <div className='hidden sm:block flex-auto lg:flex-none'>
                <FilterPills
                  label="Disponibilidad"
                  options={availabilityOptions}
                  selectedValue={selectedAvailability}
                  onChange={setSelectedAvailability}
                />
              </div>
              <div className='hidden sm:block flex-auto lg:flex-none'>
                <FilterPills
                  label="Tipo de propiedad"
                  options={propertyTypeOptions}
                  selectedValue={selectedType}
                  onChange={setSelectedType}
                />
              </div>
              <div className='hidden sm:block flex-auto lg:flex-none'>
                <FilterPills
                  label="Estatus"
                  options={[
                    { value: 'Borrador', label: 'Borrador' },
                    { value: 'Publicado', label: 'Publicado' },
                    { value: 'Archivado', label: 'Archivado' },
                  ]}
                  selectedValue={selectedStatusProperty}
                  onChange={setSelectedStatusProperty}
                />
              </div>
            </div>

            {/* Filtros Secundarios Desplegables */}
            <div className='hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              <div className='flex flex-col'>
                <label htmlFor='estado' className="text-xs text-gray-500 mb-1 font-semibold">Estado</label>
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Todos los estados' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {estados.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col'>
                <label htmlFor='city' className="text-xs text-gray-500 mb-1 font-semibold">Ciudad</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Todas las ciudades' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ciudades</SelectItem>
                    {citiesOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <Table data={filteredProperties} headers={headers} renderRow={renderRow} isLoading={isLoading || isPageLoading} hidePagination={true} />
          </div>

          <div className="md:hidden">
            {(isLoading || isPageLoading) && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color"></div>
              </div>
            )}
            {!(isLoading || isPageLoading) && filteredProperties.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {filteredProperties.map((property) => renderMobileCard(property))}
              </div>
            )}
            {!(isLoading || isPageLoading) && filteredProperties.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-slate-100">
                No hay propiedades disponibles
              </div>
            )}
          </div>

          {pagination.total_paginas > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_paginas}
              onPageChange={setCurrentPage}
              disabled={isLoading || isPageLoading}
            />
          )}
          </div>
        </CardContent>
      </Card>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onClear={handleClearFilters}
        onApply={handleApplyFilters}
        title="Filtros"
      >
        <div className="space-y-6 pt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor='estado' className="text-sm font-semibold text-gray-700">Estado</label>
            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {estados.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor='ciudad' className="text-sm font-semibold text-gray-700">Ciudad</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {citiesOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor='operation' className="text-sm font-semibold text-gray-700">Operación</label>
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar operación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las operaciones</SelectItem>
                {operationOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Disponibilidad</label>
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar disponibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las disponibilidades</SelectItem>
                {availabilityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Tipo de propiedad</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {propertyTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Estatus</label>
            <Select value={selectedStatusProperty} onValueChange={setSelectedStatusProperty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estatus</SelectItem>
                <SelectItem value="Borrador">Borrador</SelectItem>
                <SelectItem value="Publicado">Publicado</SelectItem>
                <SelectItem value="Archivado">Archivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Destacada</label>
            <button
              type="button"
              onClick={() => setIsFeaturedOnly(!isFeaturedOnly)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium flex items-center justify-center gap-2 w-full transition-colors ${
                isFeaturedOnly
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-gray-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Star size={16} fill={isFeaturedOnly ? "#eab308" : "none"} stroke="#eab308" />
              <span>{isFeaturedOnly ? "Solo destacadas" : "Todas"}</span>
            </button>
          </div>
        </div>
      </FilterSidebar>

      <DeleteModal
        isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, item: null })} onConfirm={handleDeleteConfirm} title="Eliminar Propiedad"
        itemName={deleteModal.item?.title || ''} isDeleting={isDeleting}
        itemDetails={deleteModal.item ? [{ label: 'Tipo', value: deleteModal.item.property_type?.name || '-' }, { label: 'Operación', value: formatOperationType(deleteModal.item.operation_type) || '-' }, { label: 'Precio', value: formatPrice(deleteModal.item.price) || '-' }, { label: 'Ubicación', value: formatAddress(deleteModal.item.address) || '-' }] : []}
      />

      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all" onClick={() => setIsPdfModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-red-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FileDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Generar Reporte PDF</h2>
                  <p className="text-xs text-gray-500 font-medium">Filtrar propiedades para el reporte</p>
                </div>
              </div>
              <button type='button' onClick={() => setIsPdfModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleGeneratePdf} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Año */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor='year' className="text-xs font-semibold text-gray-700">Año (opcional)</label>
                  <input
                    id='year'
                    type="number"
                    min="2000"
                    max="2100"
                    placeholder="Ej: 2026"
                    value={pdfParams.year}
                    onChange={(e) => setPdfParams(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all"
                  />
                </div>

                {/* Mes */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor='mes' className="text-xs font-semibold text-gray-700">Mes (opcional)</label>
                  <select id='mes' 
                    value={pdfParams.month}
                    onChange={(e) => setPdfParams(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all bg-white"
                  >
                    <option value="">Todos los meses</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
              </div>

              {/* Rango de Fechas */}
              <div className="border-t border-gray-100 pt-3 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rango de fechas específico</p>

                <div className="grid grid-cols-2 gap-4">
                  {/* Desde */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor='date_from' className="text-xs font-semibold text-gray-700">Desde</label>
                    <input id='date_from'
                      type="date"
                      value={pdfParams.date_from}
                      onChange={(e) => setPdfParams(prev => ({ ...prev, date_from: e.target.value }))}
                      className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all"
                    />
                  </div>

                  {/* Hasta */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor='date_to' className="text-xs font-semibold text-gray-700">Hasta</label>
                    <input id='date_to' 
                      type="date"
                      value={pdfParams.date_to}
                      onChange={(e) => setPdfParams(prev => ({ ...prev, date_to: e.target.value }))}
                      className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="flex-1 h-[40px] px-4 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 h-[40px] px-4 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4" />}
                  {isGenerating ? 'Generando...' : 'Descargar PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyList;