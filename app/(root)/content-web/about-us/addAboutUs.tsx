"use client"

import React, { useState } from 'react';
import { DynamicInputs } from "@/components/ui/Input"
import { inputsAboutUsSection } from "../inputConfig"
import { CloudUpload, Eye, Image as ImageIcon, Trash2, X } from 'lucide-react';
import Image from 'next/image';

export const AddAboutUs = () => {

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Información General</h1>
                <p className='text-md text-gray-500'>  Datos principales que describen quiénes somos y nuestra identidad.</p>

                <div className="mt-4">
                    <DynamicInputs inputs={inputsAboutUsSection} withBgWhite={true} />
                </div>
            </div>

            <div className='flex gap-3'>
                <div className='w-full max-h-max rounded-lg p-5 border'>
                    <div className='flex justify-between items-center mb-2'>
                        <h1 className='font-[500] text-lg'>Imágenes Corporativas</h1>
                        <h3>3 imágenes cargadas</h3>
                    </div>
                    <p className='text-md text-gray-500'>Fotos y video para destacar la propiedad.</p>

                    <div className='bg-white flex items-center justify-center w-full mt-5 rounded-md' onClick={() => document.getElementById('dropzone-file-2')?.click()} >
                        <div className='flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-md hover:bg-blue-50  hover:border-blue-500 transition-colors cursor-pointer'>
                            <div className='flex flex-col items-center justify-center text-body pt-5 pb-6'>
                                <CloudUpload size={30} className='mb-3 text-blue-500' />
                                <p className='mb-2 text-sm font-semibold'>Haz click o arrastra imagenes aquí </p>
                                <div className='inline-flex items-center text-sm font-medium'>
                                    <ImageIcon size={20} className='mr-2' />
                                    Seleccionar archivos
                                </div>
                                <p className='text-sm mt-2 text-gray-500'>Formatos JPG/PNG <span className='font-semibold'>30MB</span> por foto.</p>
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input id='dropzone-file-2' type='file' className='hidden' />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <div className="group w-full relative max-w-sm mx-auto h-[150px] rounded-md overflow-hidden">
                            <Image src="/casa.jpeg" alt="image" fill className="object-cover" />

                            <a className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                            <button onClick={() => setOpenModal(true)} className="absolute top-2 left-1.5  p-1.5 bg-white rounded-full hover:bg-gray-100 z-20
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Eye size={16} className="text-blue-600" />
                            </button>

                            <button className="absolute top-2 right-1.5 p-1.5 bg-white rounded-full hover:bg-gray-100 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Trash2 size={16} className="text-red-600" />
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-5">Estas imágenes se mostrarán en la sección de "Sobre Nosotros" con el diseño de la página web pública.</p>
                    {openModal && (
                        <div
                            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            onClick={() => setOpenModal(false)}>
                            <div className="relative w-11/12 md:w-2/3 lg:w-1/2 bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                {/* Botón cerrar */}
                                <button onClick={() => setOpenModal(false)} className="absolute top-3 right-3 bg-white rounded-full p-2 shadow" >
                                    <X />
                                </button>

                                <img src="/casa.jpeg" alt="Vista completa" className="w-full h-[30rem] object-cover" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}