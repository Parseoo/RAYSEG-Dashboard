"use client"

import React, { useState } from "react";
import { CirclePlus, CloudUpload, Eye, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import { DynamicInputs } from "@/components/ui/Input";
import Image from "next/image";
import { inputsServiceItem, inputsServicesSection } from "../inputConfig";
import DragAndDrop from '@/components/ui/DragAndDrop';
import IconSelector from "@/components/ui/IconSelector";

export const AddServices = () => {

    const [openModal, setOpenModal] = useState(false);
    const [showIconSelector, setShowIconSelector] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<keyof typeof LucideIcons>("CirclePlus");

    const SelectedIconComponent = LucideIcons[selectedIcon] as LucideIcons.LucideIcon;

    return (
        <>
            <div className='bg-slate-100 w-full max-h-max rounded-lg p-5'>
                <h1 className='font-[500] text-lg'>Encabezado de la sección de servicios</h1>
                <p className='text-md text-gray-500'>Fotos a mostrar en la sección de servicios.</p>
                <div className='mt-4'>
                    <DynamicInputs inputs={inputsServicesSection} withBgWhite={true} />
                </div>

                <div
                    className='bg-white flex items-center justify-center w-full mt-5 rounded-md'
                    onClick={() => document.getElementById('dropzone-file-2')?.click()}>
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

                    <input id='dropzone-file-2' type='file' className='hidden' />
                </div>

                <div className="mt-6">
                    <div className="group w-full relative h-[250px] rounded-md overflow-hidden border">
                        <Image src="/Banner.png" alt="image" fill className="object-cover" />
                        <a className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                        <button
                            onClick={() => setOpenModal(true)}
                            className="absolute top-2 left-1.5 p-1.5 bg-white rounded-full hover:bg-gray-100 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Eye size={16} className="text-blue-600" />
                        </button>

                        <button className="absolute top-2 right-1.5 p-1.5 bg-white rounded-full hover:bg-gray-100 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Trash2 size={16} className="text-red-600" />
                        </button>
                    </div>
                </div>


                {openModal && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center
           bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpenModal(false)}>
                        <div className="relative w-11/12 md:w-2/3 lg:w-1/2 bg-white rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setOpenModal(false)}>
                               <X />
                            </button>

                            <img
                                src="/Banner.png"
                                alt="Vista completa"
                                className="w-full h-[30rem] object-cover"
                            />
                        </div>
                    </div>
                )}

            </div>

            <div className="bg-slate-100 w-full min-w-full rounded-lg p-5">
                <h1 className="font-[500] text-lg mb-4">
                    Lista de servicios
                </h1>

                <div className="flex w-full items-start gap-x-4 py-3 px-4">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowIconSelector(!showIconSelector)}
                            className="group bg-white p-4 rounded-md shadow-xs flex flex-col items-center justify-center border hover:border-blue-500 transition-colors"
                        >
                            {SelectedIconComponent ? (
                                <SelectedIconComponent size={20} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                            ) : (
                                <CirclePlus size={20} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                            )}
                            <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                                Icono
                            </p>
                        </button>

                        {showIconSelector && (
                            <IconSelector
                                selectedIcon={selectedIcon}
                                onSelect={(iconName) => setSelectedIcon(iconName)}
                                onClose={() => setShowIconSelector(false)}
                            />
                        )}
                    </div>

                    <div className="flex-1 -mt-7">
                        <DynamicInputs inputs={inputsServiceItem} withBgWhite={true} />
                    </div>

                    <button type="button" className="bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shrink-0">
                        <Plus size={20} />
                        Agregar Servicio
                    </button>
                </div>

                <div className="mt-4 w-full">
                    <DragAndDrop />
                </div>
            </div>
        </>
    )
}