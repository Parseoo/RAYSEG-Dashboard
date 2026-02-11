"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

{/* Define la interface de props para la tabla */}
interface TableProps<T> { 
    data: T[]
    headers: string[]
    renderRow: (item: T, index: number) => React.ReactNode
    isLoading: boolean
}

{/* Implementa la tabla */}
export const Table = <T extends any>({ data = [], headers, renderRow, isLoading }: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const totalItems = data.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = data.slice(startIndex, endIndex)

    return (
        <div className='w-full mt-6 overflow-x-auto'>
            <table className='w-full border-collapse rounded-lg overflow-hidden shadow-sm'>
                <thead>
                    <tr className='bg-slate-100 rounded-t-lg'>
                        {headers.map((header, index) => (
                            <th key={index} className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>{header}</th>
                        ))}
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
                            setCurrentPage(1)}}>
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
                                ${currentPage === pageNum ? 'bg-primary_color text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100' }`}>
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