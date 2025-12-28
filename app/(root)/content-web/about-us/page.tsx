import Breadcrumb from '@/components/ui/breadcrumb';
import { ArrowUpToLine, Save } from 'lucide-react';
import React from 'react';
import { AddAboutUs } from './addAboutUs';

const ContentWebAboutUsPage = () => {
    return (
        <>
            <Breadcrumb items={[
                { label: 'Contenido Web', href: '/content-web' },
                { label: 'Sobre Nosotros', href: '/content-web/about-us', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Sobre Nosotros</h1>
                            <p className='text-md text-gray-500'> Información sobre quiénes somos, nuestra misión y visión.</p>
                        </div>

                    </div>
                    <div className='flex flex-col gap-6'>
                        <AddAboutUs />
                    </div>

                    <div className="flex items-center mt-6">

                        <div className="flex items-center gap-4 justify-end w-full">
                            <button
                                type="button"
                                className="bg-slate-100 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium">
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium">
                                <Save size={20} /> Guardar
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ContentWebAboutUsPage

