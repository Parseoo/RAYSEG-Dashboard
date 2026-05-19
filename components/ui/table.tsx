"use client"

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

{/* Define la interface de props para la tabla */}
interface TableProps<T> {
    data: T[]
    headers: string[]
    renderRow: (item: T, index: number) => React.ReactNode
    isLoading: boolean
}

// Mapper de valores para ordenación genérica
const getValueByHeader = (item: any, header: string): any => {
    if (!item) return '';
    const h = header.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    // 1. Mapeos manuales prioritarios y bien definidos:
    if (h === 'cliente' || h === 'agente' || h === 'propiedad' || h === 'nombre' || h === 'usuario') {
        return item.name || item.nombre || item.title || item.nombre_rol || '';
    }
    if (h === 'tipo') {
        if (item.property_type && typeof item.property_type === 'object') {
            return item.property_type.name || '';
        }
        return item.type || item.tipo || '';
    }
    if (h === 'operacion') {
        return item.operation_type || item.operation || '';
    }
    if (h === 'precio' || h === 'monto') {
        return parseFloat(String(item.price || item.precio || item.monto || 0).replace(/[^0-9.]/g, '')) || 0;
    }
    if (h === 'estatus' || h === 'estado') {
        return item.property_status || item.status || item.estatus || item.property_status_label || '';
    }
    if (h === 'publicacion') {
        if (item.property_post_status && typeof item.property_post_status === 'object') {
            return item.property_post_status.name || '';
        }
        return item.status_publication || '';
    }
    if (h === 'mls' || h === 'clave') {
        return item.number_mls || item.clave || '';
    }
    if (h === 'telefono') {
        return item.phone || item.telefono || item.number || '';
    }
    if (h === 'rfc') return item.rfc || '';
    if (h === 'curp') return item.curp || '';
    if (h === 'rol' || h === 'rol/permisos') {
        return item.type || item.role?.name || item.role || item.rol || '';
    }
    if (h === 'propiedades activas') {
        return Number(item.propertiesActive || 0);
    }
    if (h === 'citas') {
        return Number(item.dates || 0);
    }
    if (h === 'contacto') {
        return item.email || item.contacto || '';
    }
    if (h === 'alta' || h === 'fecha' || h === 'inicio' || h === 'fin' || h === 'ultimo acceso') {
        return item.high || item.created_at || item.updated_at || item.inicio || item.fin || '';
    }
    if (h === 'calle y numero') {
        return `${item.street || ''} ${item.street_number || ''}`.trim();
    }
    if (h === 'colonia') return item.neighborhood || item.colonia || '';
    if (h === 'ciudad') return item.city || item.ciudad || '';
    if (h === 'cp') return item.postal_code || item.cp || '';
    if (h === 'latitud') return Number(item.latitude || 0);
    if (h === 'longitud') return Number(item.longitude || 0);
    if (h === 'clientes') {
        if (Array.isArray(item.clients)) {
            return item.clients.map((c: any) => c.name || c.nombre || '').join(', ');
        }
        return item.clients || '';
    }
    if (h === 'responsable') {
        if (item.responsable && typeof item.responsable === 'object') {
            return item.responsable.name || item.responsable.nombre || '';
        }
        return item.responsable || '';
    }

    // 2. Caídas dinámicas por propiedad
    const cleanKey = h.replace(/\s+/g, '_');
    if (item[cleanKey] !== undefined) return item[cleanKey];

    const camelKey = h.replace(/\s+(.)/g, (_, c) => c.toUpperCase());
    if (item[camelKey] !== undefined) return item[camelKey];

    return '';
};

{/* Implementa la tabla */}
export const Table = <T extends any>({ data = [], headers, renderRow, isLoading }: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    
    // Estados de ordenación
    const [sortHeader, setSortHeader] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    const handleSort = (header: string) => {
        const h = header.toLowerCase();
        if (h === 'acciones' || h === 'imagen' || h === 'imagenes') return;

        if (sortHeader === header) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortHeader(null);
                setSortDirection(null);
            } else {
                setSortDirection('asc');
            }
        } else {
            setSortHeader(header);
            setSortDirection('asc');
        }
    };

    // Ordenar los datos antes de paginar
    const sortedData = useMemo(() => {
        if (!sortHeader || !sortDirection) return data;

        return [...data].sort((a, b) => {
            const valA = getValueByHeader(a, sortHeader);
            const valB = getValueByHeader(b, sortHeader);

            // Ordenación de números
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }

            // Ordenación de cadenas
            const strA = String(valA).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const strB = String(valB).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
            if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortHeader, sortDirection]);

    const totalItems = sortedData.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = sortedData.slice(startIndex, endIndex)

    return (
        <div className='w-full mt-6 overflow-x-auto'>
            <table className='w-full border-collapse rounded-lg overflow-hidden shadow-sm'>
                <thead>
                    <tr className='bg-slate-100 rounded-t-lg'>
                        {headers.map((header, index) => {
                            const h = header.toLowerCase();
                            const isSortable = h !== 'acciones' && h !== 'imagen' && h !== 'imagenes';
                            const isCurrent = sortHeader === header;

                            return (
                                <th 
                                    key={index} 
                                    onClick={() => isSortable && handleSort(header)}
                                    className={`py-3 px-4 font-semibold text-sm text-gray-700 select-none text-left ${
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
                            <td colSpan={headers.length} className='text-center py-8 text-gray-500'>Cargando...</td>
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

            {/* Paginación */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200'>
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
                        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                            className='p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                            <ChevronLeft size={16} className='text-gray-700' />
                        </button>
                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            const pageNum = i + 1
                            return (
                                <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-md text-sm font-medium transition-colors 
                                ${currentPage === pageNum ? 'bg-primary_color text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>
                                    {pageNum}
                                </button>
                            )
                        })}
                        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
                            className='p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                            <ChevronRight size={16} className='text-gray-700' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}