"use client"
import React, { useRef } from 'react';
import Breadcrumb from "@/components/ui/breadcrumb"

import { AddLocations } from './addLocations';

const ContentWebLocationsPage = () => {
    const onClearRef = useRef<(() => void) | null>(null);

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Contenido Web', href: '/content-web/home' },
                { label: 'Localización', href: '/content-web/locations', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Localización</h1>
                            <p className='text-md text-gray-500'>Configura las direcciones que se mostrarán como pines en el mapa del sitio.</p>
                        </div>

                    </div>
                    <div className='flex flex-col gap-6'>
                        <AddLocations onClearRef={onClearRef} />
                    </div>



                </div>
            </div>
        </>
    )
}

export default ContentWebLocationsPage