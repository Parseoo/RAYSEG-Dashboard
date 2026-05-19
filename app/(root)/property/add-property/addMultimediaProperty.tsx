"use client"

import React, { useState } from 'react';
import { CloudUpload, Eye, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import Image from 'next/image';
import { useProperty } from '../propertyContext';

// Configuración de los inputs
const inputs: InputFieldConfig[] = [
  { type: 'url', id: 'url', label: 'Video (URL)', placeholder: 'Pega enlace de Youtube' },
];

interface ImageItem {
  id: number;
  src: string;
  isMain: boolean;
}

export const AddMultimediaProperty = () => {
  const { state, updateField } = useProperty();
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ fileID: number; file: string; is_main?: boolean } | null>(null);

  const images = state.images;
  const plans = state.plans || [];

  const handleSetMain = (id: number) => {
    const newImages = images.map((img: any) => ({
      ...img,
      is_main: img.fileID === id
    }));
    updateField('images', newImages);
  };

  const handleViewImage = (image: { fileID: number; file: string; is_main?: boolean }) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleDeletePlan = (id: number) => {
    const newPlans = plans.filter((p: any) => p.fileID !== id);
    updateField('plans', newPlans);
  };

  const handleDelete = (id: number) => {
    const newImages = images.filter((img: any) => img.fileID !== id);
    updateField('images', newImages);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          fileID: Date.now() + i,
          file: reader.result as string,
          is_main: newImages.length === 0
        });
        updateField('images', [...newImages]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlanFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPlans = [...plans];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newPlans.push({
          fileID: Date.now() + i,
          file: reader.result as string,
        });
        updateField('plans', [...newPlans]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='w-full max-h-max rounded-lg p-5 border bg-white'>
      <div className='flex justify-between items-center mb-2'>
        <h1 className='font-[500] text-lg'>Galería</h1>
       <h3 className="text-sm text-gray-500">
  {images.length} {images.length === 1 ? "Imagen cargada" : "Imagenes cargadas"}
</h3>
      </div>
      <p className='text-md text-gray-500'>Fotos y video para destacar la propiedad.</p>

      <div
        className='bg-white flex items-center justify-center w-full mt-5 rounded-md'
        onClick={() => document.getElementById('dropzone-file-2')?.click()}
      >
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
        <input id='dropzone-file-2' type='file' className='hidden' multiple onChange={handleFileChange} accept="image/*" />
      </div>

      <div className='mt-4'>
        <DynamicInputs inputs={inputs} withBgWhite={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {images.map((image) => (
          <div key={image.fileID} className="group w-full relative max-w-sm mx-auto h-[150px] rounded-md overflow-hidden">
            <Image src={image.file} alt="image" fill className="object-cover" />

            <a className={`absolute inset-0 bg-black transition-opacity duration-300 z-10 ${image.is_main ? 'opacity-0' : 'opacity-0 group-hover:opacity-40'}`} />

            {image.is_main ? (
              <div className="absolute top-2 left-2 bg-[#1B2533] text-white text-sm font-medium px-4 py-1.5 rounded-full z-20">
                Principal
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleViewImage(image)}
                  className="absolute top-2 left-1.5 
                  p-1.5 bg-white rounded-full hover:bg-gray-100 z-20
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Eye size={16} className="text-blue-600" />
                </button>

                <button
                  className="absolute top-2 right-1.5 
                  p-1.5 bg-white rounded-full hover:bg-gray-100 z-20
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleDelete(image.fileID)}
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>

                <button
                  onClick={() => handleSetMain(image.fileID)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 
                  w-[90%] bg-white text-xs font-semibold py-1 
                  rounded-sm shadow-md z-20
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  Marcar principal
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      </div>

      <div className='w-full max-h-max rounded-lg p-5 border bg-white'>
        <div className='flex justify-between items-center mb-2'>
          <h1 className='font-[500] text-lg'>Planos</h1>
        <h3 className="text-sm text-gray-500">
          {plans.length} {plans.length === 1 ? "Plano cargado" : "Planos cargados"}
        </h3>
      </div>
      <p className='text-md text-gray-500'>Sube los planos arquitectónicos de la propiedad.</p>

      <div
        className='bg-white flex items-center justify-center w-full mt-5 rounded-md'
        onClick={() => document.getElementById('dropzone-file-plans')?.click()}
      >
        <div className='flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-md hover:bg-blue-50  hover:border-blue-500 transition-colors cursor-pointer'>
          <div className='flex flex-col items-center justify-center text-body pt-5 pb-6'>
            <CloudUpload size={30} className='mb-3 text-blue-500' />
            <p className='mb-2 text-sm font-semibold'>Haz click o arrastra planos aquí </p>
            <div className='inline-flex items-center text-sm font-medium'>
              <ImageIcon size={20} className='mr-2' />
              Seleccionar archivos
            </div>
            <p className='text-sm mt-2 text-gray-500'>Formatos JPG/PNG/PDF <span className='font-semibold'>30MB</span> por archivo.</p>
          </div>
        </div>

        <input id='dropzone-file-plans' type='file' className='hidden' multiple onChange={handlePlanFileChange} accept="image/*,application/pdf" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {plans.map((plan) => (
          <div key={plan.fileID} className="group w-full relative max-w-sm mx-auto h-[150px] rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            {plan.file.includes('application/pdf') ? (
              <span className="text-gray-500 font-medium text-lg">PDF</span>
            ) : (
              <Image src={plan.file} alt="plano" fill className="object-contain" />
            )}

            <a className={`absolute inset-0 bg-black transition-opacity duration-300 z-10 opacity-0 group-hover:opacity-40`} />

            <button
              onClick={() => handleViewImage(plan)}
              className="absolute top-2 left-1.5 
              p-1.5 bg-white rounded-full hover:bg-gray-100 z-20
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Eye size={16} className="text-blue-600" />
            </button>

            <button
              className="absolute top-2 right-1.5 
              p-1.5 bg-white rounded-full hover:bg-gray-100 z-20
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => handleDeletePlan(plan.fileID)}
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {openModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center
    bg-black/60 backdrop-blur-sm"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="relative w-11/12 md:w-2/3 lg:w-1/2 bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
            >
              <X />
            </button>

            {/* Imagen grande */}
            {selectedImage && (
              selectedImage.file.includes('application/pdf') ? (
                <iframe src={selectedImage.file} className="w-full h-[40rem]" />
              ) : (
                <img
                  src={selectedImage.file}
                  alt="Vista completa"
                  className="w-full h-[30rem] object-contain"
                />
              )
            )}
          </div>
        </div>
      )}

      </div>
    </div>
  )
}

export default AddMultimediaProperty;