"use client"

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TableProps<T> {
    data: T[]
    headers: string[]
    renderRow: (item: T, index: number) => React.ReactNode
    isLoading: boolean
    hidePagination?: boolean
}

const headerValueExtractors = [
    {
        match: (h: string) => ['cliente', 'agente', 'propiedad', 'nombre', 'usuario'].includes(h),
        get: (item: any) => item.name || item.nombre || item.title || item.nombre_rol || ''
    },
    {
        match: (h: string) => h === 'tipo',
        get: (item: any) => (item.property_type && typeof item.property_type === 'object') ? item.property_type.name || '' : item.type || item.tipo || ''
    },
    {
        match: (h: string) => h === 'operacion',
        get: (item: any) => {
            const op = item.operation_type || item.operation;
            return typeof op === 'object' && op !== null ? op.name || '' : op || '';
        }
    },
    {
        match: (h: string) => ['precio', 'monto'].includes(h),
        get: (item: any) => Number.parseFloat(String(item.price || item.precio || item.monto || 0).replace(/[^0-9.]/g, '')) || 0
    },
    {
        match: (h: string) => ['estatus', 'estado'].includes(h),
        get: (item: any) => item.property_status || item.status || item.estatus || item.property_status_label || ''
    },
    {
        match: (h: string) => h === 'publicacion',
        get: (item: any) => (item.property_post_status && typeof item.property_post_status === 'object') ? item.property_post_status.name || '' : item.status_publication || ''
    },
    {
        match: (h: string) => ['mls', 'clave'].includes(h),
        get: (item: any) => item.number_mls || item.clave || ''
    },
    {
        match: (h: string) => h === 'telefono',
        get: (item: any) => item.phone || item.telefono || item.number || ''
    },
    {
        match: (h: string) => h === 'rfc',
        get: (item: any) => item.rfc || ''
    },
    {
        match: (h: string) => h === 'curp',
        get: (item: any) => item.curp || ''
    },
    {
        match: (h: string) => ['rol', 'rol/permisos'].includes(h),
        get: (item: any) => item.type || item.role?.name || item.role || item.rol || ''
    },
    {
        match: (h: string) => h === 'propiedades activas',
        get: (item: any) => Number(item.propertiesActive || 0)
    },
    {
        match: (h: string) => h === 'citas',
        get: (item: any) => Number(item.dates || 0)
    },
    {
        match: (h: string) => h === 'contacto',
        get: (item: any) => item.email || item.contacto || ''
    },
    {
        match: (h: string) => ['alta', 'inicio', 'fin', 'ultimo acceso'].includes(h),
        get: (item: any) => item.high || item.created_at || item.updated_at || item.inicio || item.fin || ''
    },
    {
        match: (h: string) => h === 'calle y numero',
        get: (item: any) => `${item.street || ''} ${item.street_number || ''}`.trim()
    },
    {
        match: (h: string) => h === 'colonia',
        get: (item: any) => item.neighborhood || item.colonia || ''
    },
    {
        match: (h: string) => h === 'ciudad',
        get: (item: any) => item.city || item.ciudad || ''
    },
    {
        match: (h: string) => h === 'cp',
        get: (item: any) => item.postal_code || item.cp || ''
    },
    {
        match: (h: string) => h === 'latitud',
        get: (item: any) => Number(item.latitude || 0)
    },
    {
        match: (h: string) => h === 'longitud',
        get: (item: any) => Number(item.longitude || 0)
    },
    {
        match: (h: string) => h === 'clientes',
        get: (item: any) => Array.isArray(item.clients) ? item.clients.map((c: any) => c.name || c.nombre || '').join(', ') : item.clients || ''
    },
    {
        match: (h: string) => h === 'responsable',
        get: (item: any) => (item.responsable && typeof item.responsable === 'object') ? item.responsable.name || item.responsable.nombre || '' : item.responsable || ''
    },
    {
        match: (h: string) => ['creado en', 'creado', 'fecha', 'fecha de creacion', 'fecha creacion'].includes(h),
        get: (item: any) => item.created_at || item.createdAt || item.fecha || item.date || ''
    },
    {
        match: (h: string) => ['publicacion web', 'web'].includes(h),
        get: (item: any) => item.is_active || item.is_published || item.status || ''
    }
];

const getValueByHeader = (item: any, header: string): any => {
    if (!item) return '';
    const h = header.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const extractor = headerValueExtractors.find(e => e.match(h));
    if (extractor) return extractor.get(item);

    // 2. Búsqueda directa o anidada en keys del objeto
    const exactKey = Object.keys(item).find(k => k.toLowerCase() === h);
    if (exactKey && item[exactKey] !== undefined && item[exactKey] !== null) {
        if (typeof item[exactKey] === 'object') return item[exactKey].name || item[exactKey].title || '';
        return item[exactKey];
    }

    return '';
};

const isEmptyValue = (val: any) => val === '' || val === null || val === undefined;

const parseDateValue = (strVal: string) => {
    const date = new Date(strVal);
    const isValid = date instanceof Date && !Number.isNaN(date.getTime()) && (strVal.includes('-') || strVal.includes('/') || strVal.includes('T'));
    return isValid ? date.getTime() : null;
};

const compareNumbers = (a: number, b: number, dir: 'asc' | 'desc') => dir === 'asc' ? a - b : b - a;

const compareBooleans = (a: boolean, b: boolean, dir: 'asc' | 'desc') => {
    if (a === b) return 0;
    const ascResult = a ? -1 : 1;
    return dir === 'asc' ? ascResult : -ascResult;
};

const compareStrings = (a: string, b: string, dir: 'asc' | 'desc') => {
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const strA = normalize(a);
    const strB = normalize(b);
    if (strA < strB) return dir === 'asc' ? -1 : 1;
    if (strA > strB) return dir === 'asc' ? 1 : -1;
    return 0;
};

const compareValues = (valA: any, valB: any, sortDirection: 'asc' | 'desc') => {
    if (isEmptyValue(valA)) return 1;
    if (isEmptyValue(valB)) return -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
        return compareNumbers(valA, valB, sortDirection);
    }

    if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return compareBooleans(valA, valB, sortDirection);
    }

    const strValA = String(valA);
    const strValB = String(valB);
    
    const timeA = parseDateValue(strValA);
    const timeB = parseDateValue(strValB);
    
    if (timeA !== null && timeB !== null) {
        return compareNumbers(timeA, timeB, sortDirection);
    }

    return compareStrings(strValA, strValB, sortDirection);
};

export const Table = <T,>({ data, headers, renderRow, isLoading, hidePagination = false }: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortHeader, setSortHeader] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const handleSort = (header: string) => {
        if (sortHeader === header) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else {
                setSortHeader(null);
                setSortDirection('asc');
            }
        } else {
            setSortHeader(header);
            setSortDirection('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortHeader || !data || data.length === 0) return data || [];

        return [...data].sort((a, b) => {
            const valA = getValueByHeader(a, sortHeader);
            const valB = getValueByHeader(b, sortHeader);

            return compareValues(valA, valB, sortDirection);
        });
    }, [data, sortHeader, sortDirection]);

    const totalItems = sortedData.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = hidePagination ? sortedData : sortedData.slice(startIndex, endIndex)

    return (
        <div className='w-full mt-6'>
            <div className='w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm'>
                <table className='w-full border-collapse overflow-hidden bg-white'>
                    <thead>
                        <tr className='bg-slate-100 border-b border-gray-200'>
                            {headers.map((header, index) => {
                                const h = header.toLowerCase();
                                const isSortable = h !== 'acciones' && h !== 'imagen' && h !== 'imagenes';
                                const isCurrent = sortHeader === header;

                                return (
                                    <th
                                        key={header}
                                        onClick={() => isSortable && handleSort(header)}
                                        className={`py-2 px-3 font-medium text-xs text-gray-700 select-none text-left whitespace-nowrap ${
                                            isSortable ? 'cursor-pointer hover:bg-slate-200 transition-colors' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span>{header}</span>
                                            {isSortable && (
                                                <span className="text-gray-400">
                                                    {isCurrent && sortDirection === 'asc' && <ArrowUp size={14} className="text-primary_color font-bold" />}
                                                    {isCurrent && sortDirection === 'desc' && <ArrowDown size={14} className="text-primary_color font-bold" />}
                                                    {!isCurrent && <ArrowUpDown size={14} className="opacity-40 hover:opacity-100 transition-opacity" />}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={headers.length} className='text-center py-12'>
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="w-8 h-8 text-primary_color animate-spin" />
                                        <p className="text-sm text-gray-500 font-medium">Cargando información...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <>
                                {currentData.length > 0 ? (
                                    currentData.map((item, index) => renderRow(item, index))
                                ) : (
                                    <tr>
                                        <td colSpan={headers.length} className='text-center py-8 text-gray-500'>
                                            No hay registros disponibles
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {!hidePagination && (
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4'>
                    <div className='text-xs sm:text-sm text-gray-600'>
                        Mostrando {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, totalItems)} de {totalItems} registros
                    </div>
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto'>
                        <div className='flex items-center gap-2'>
                            <span className='text-xs sm:text-sm text-gray-600 whitespace-nowrap'>Por página:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                                setItemsPerPage(Number(value))
                                setCurrentPage(1)
                            }}>
                                <SelectTrigger className='w-[80px] h-8'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='10'>10</SelectItem>
                                    <SelectItem value='20'>20</SelectItem>
                                    <SelectItem value='50'>50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex items-center gap-2 justify-center sm:justify-start'>
                            <button type='button' onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                                className='p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                                <ChevronLeft size={16} className='text-gray-700' />
                            </button>
                            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                const pageNum = i + 1
                                return (
                                    <button type='button' key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-md text-sm font-medium transition-colors 
                                    ${currentPage === pageNum ? 'bg-primary_color text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>
                                        {pageNum}
                                    </button>
                                )
                            })}
                            <button type='button' onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
                                className='p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                                <ChevronRight size={16} className='text-gray-700' />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}