"use client"

import React, { useState } from 'react';
import { CloudUpload, Eye, Image as ImageIcon, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useProperty } from '../propertyContext';
import { getImageUrl } from '@/lib/utils';
import DeleteModal from '@/components/ui/DeleteModal';

export const AddMultimediaProperty = () => {
  const { state, updateField } = useProperty();
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ fileID: number | string; file: string; is_main?: boolean } | null>(null);
  const [deleteImageModal, setDeleteImageModal] = useState<{ isOpen: boolean; id: number | string | null; type: 'image' | 'plan' }>({
    isOpen: false,
    id: null,
    type: 'image'
  });

  const images = state.images || [];
  const plans = state.plans || [];

  const handleSetMain = (id: number | string) => {
    const newImages = images.map((img: any) => ({
      ...img,
      is_main: String(img.fileID) === String(id)
    }));
    updateField('images', newImages);
  };

  const handleViewImage = (image: { fileID: number | string; file: string; is_main?: boolean }) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const triggerDeleteImage = (id: number | string) => {
    setDeleteImageModal({ isOpen: true, id, type: 'image' });
  };

  const triggerDeletePlan = (id: number | string) => {
    setDeleteImageModal({ isOpen: true, id, type: 'plan' });
  };

  const handleConfirmDelete = () => {
    if (deleteImageModal.id === null) return;
    if (deleteImageModal.type === 'image') {
      const newImages = images.filter((img: any) => String(img.fileID) !== String(deleteImageModal.id));
      updateField('images', newImages);
    } else {
      const newPlans = plans.filter((p: any) => String(p.fileID) !== String(deleteImageModal.id));
      updateField('plans', newPlans);
    }
    setDeleteImageModal({ isOpen: false, id: null, type: 'image' });
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
    <div className='flex flex-col lg:flex-row gap-5 lg:gap-6 w-full'>
      {/* Galería de Imágenes */}
      <div className='w-full lg:w-1/2 max-h-max rounded-lg p-4 sm:p-5 border border-gray-200 bg-white'>
        <div className='flex justify-between items-center mb-1.5'>
          <h1 className='font-[500] text-lg'>Galería</h1>
          <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
            {images.length} {images.length === 1 ? "imagen" : "imágenes"}
          </span>
        </div>
        <p className='text-sm sm:text-md text-gray-500 mb-4'>Sube las fotografías que se mostrarán en la publicación de la propiedad.</p>

        <div
          className='bg-white flex items-center justify-center w-full rounded-md'
          onClick={() => document.getElementById('dropzone-file-2')?.click()}
        >
          <div className='flex flex-col items-center justify-center w-full h-44 sm:h-52 bg-slate-50/70 border-2 border-dashed border-gray-300 rounded-lg hover:bg-blue-50/50 hover:border-blue-500 transition-all cursor-pointer p-4 text-center'>
            <div className='flex flex-col items-center justify-center text-body'>
              <CloudUpload size={28} className='mb-2 text-blue-500' />
              <p className='mb-1 text-sm font-semibold text-gray-700'>Haz clic o arrastra imágenes aquí</p>
              <div className='inline-flex items-center text-xs text-blue-600 font-medium'>
                <ImageIcon size={16} className='mr-1.5' />
                Seleccionar archivos
              </div>
              <p className='text-xs mt-2 text-gray-400'>JPG, PNG · Máx. 30 MB por imagen</p>
            </div>
          </div>

          <input id='dropzone-file-2' type='file' className='hidden' multiple onChange={handleFileChange} accept="image/*" />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
            {images.map((image, idx) => {
              const srcUrl = getImageUrl(image.file);

              return (
                <div key={image.fileID || idx} className="group w-full relative h-[120px] sm:h-[135px] rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <Image
                    src={srcUrl}
                    alt="imagen de propiedad"
                    fill
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target && !target.src.endsWith('/property.jpg') && !target.src.endsWith('/casa.jpeg')) {
                        target.src = '/property.jpg';
                      }
                    }}
                    className="object-cover"
                  />

                  <a className="absolute inset-0 bg-black/40 transition-opacity duration-200 z-10 opacity-0 group-hover:opacity-100" />

                  {image.is_main && (
                    <div className="absolute top-2 left-2 bg-[#1B2533] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-20 shadow">
                      Principal
                    </div>
                  )}

                  {/* Hover Action - Eye (Top Left) */}
                  <button
                    type="button"
                    onClick={() => handleViewImage(image)}
                    className={`absolute top-2 ${image.is_main ? 'left-20' : 'left-2'} p-1.5 bg-white rounded-full hover:bg-gray-100 shadow-md transition-all duration-200 z-20 opacity-0 group-hover:opacity-100`}
                    title="Ver imagen"
                  >
                    <Eye size={15} className="text-blue-600" />
                  </button>

                  {/* Hover Action - Trash (Top Right) */}
                  <button
                    type="button"
                    onClick={() => triggerDeleteImage(image.fileID)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100 shadow-md transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
                    title="Eliminar imagen"
                  >
                    <Trash2 size={15} className="text-red-600" />
                  </button>

                  {!image.is_main && (
                    <button
                      type="button"
                      onClick={() => handleSetMain(image.fileID)}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2
                      w-[90%] bg-white text-[11px] font-semibold py-1
                      rounded-md shadow-md z-30
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 text-gray-800"
                    >
                      Marcar principal
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Planos de la Propiedad */}
      <div className='w-full lg:w-1/2 max-h-max rounded-lg p-4 sm:p-5 border border-gray-200 bg-white'>
        <div className='flex justify-between items-center mb-1.5'>
          <h1 className='font-[500] text-lg'>Planos</h1>
          <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
            {plans.length} {plans.length === 1 ? "plano" : "planos"}
          </span>
        </div>
        <p className='text-sm sm:text-md text-gray-500 mb-4'>Sube los planos o croquis de la propiedad.</p>

        <div
          className='bg-white flex items-center justify-center w-full rounded-md'
          onClick={() => document.getElementById('dropzone-file-plans')?.click()}
        >
          <div className='flex flex-col items-center justify-center w-full h-44 sm:h-52 bg-slate-50/70 border-2 border-dashed border-gray-300 rounded-lg hover:bg-blue-50/50 hover:border-blue-500 transition-all cursor-pointer p-4 text-center'>
            <div className='flex flex-col items-center justify-center text-body'>
              <CloudUpload size={28} className='mb-2 text-blue-500' />
              <p className='mb-1 text-sm font-semibold text-gray-700'>Haz clic o arrastra planos aquí</p>
              <div className='inline-flex items-center text-xs text-blue-600 font-medium'>
                <ImageIcon size={16} className='mr-1.5' />
                Seleccionar archivos
              </div>
              <p className='text-xs mt-2 text-gray-400'>JPG, PNG o PDF · Máx. 30 MB por archivo</p>
            </div>
          </div>

          <input id='dropzone-file-plans' type='file' className='hidden' multiple onChange={handlePlanFileChange} accept="image/*,application/pdf" />
        </div>

        {plans.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
            {plans.map((plan: any, idx: number) => {
              const fileStr = typeof plan.file === 'string' ? plan.file : (plan.file?.plan || plan.file?.file || plan.file?.url || '');
              const isPdf = typeof fileStr === 'string' && (fileStr.includes('application/pdf') || fileStr.toLowerCase().endsWith('.pdf') || fileStr.startsWith('data:application/pdf'));
              const planUrl = getImageUrl(fileStr);

              return (
                <div key={plan.fileID || idx} className="group w-full relative h-[120px] sm:h-[135px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-slate-200 shadow-sm">
                  {isPdf ? (
                    <span className="text-gray-500 font-semibold text-sm select-none">PDF Documento</span>
                  ) : (
                    <Image
                      src={planUrl}
                      alt="plano de propiedad"
                      fill
                      unoptimized={true}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target && !target.src.endsWith('/property.jpg') && !target.src.endsWith('/casa.jpeg')) {
                          target.src = '/property.jpg';
                        }
                      }}
                      className="object-contain"
                    />
                  )}

                  <a className="absolute inset-0 bg-black/40 transition-opacity duration-200 z-10 opacity-0 group-hover:opacity-100" />

                  {/* Hover Action - Eye (Top Left) */}
                  <button
                    type="button"
                    onClick={() => handleViewImage(plan)}
                    className="absolute top-2 left-2 p-1.5 bg-white rounded-full hover:bg-gray-100 shadow-md transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
                    title="Ver plano"
                  >
                    <Eye size={15} className="text-blue-600" />
                  </button>

                  {/* Hover Action - Trash (Top Right) */}
                  <button
                    type="button"
                    onClick={() => triggerDeletePlan(plan.fileID)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100 shadow-md transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
                    title="Eliminar plano"
                  >
                    <Trash2 size={15} className="text-red-600" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {openModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Vista previa</span>
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1.5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content modal */}
            <div className="p-3 sm:p-6 flex items-center justify-center max-h-[75vh] overflow-auto">
              {selectedImage && (
                (() => {
                  const fileStr = typeof selectedImage.file === 'string' ? selectedImage.file : '';
                  const isPdf = fileStr.includes('application/pdf') || fileStr.toLowerCase().endsWith('.pdf') || fileStr.startsWith('data:application/pdf');
                  const modalUrl = getImageUrl(selectedImage.file);

                  if (isPdf) {
                    return <iframe src={modalUrl} className="w-full h-[60vh] rounded-lg border border-gray-200" title="Vista previa PDF" />;
                  }

                  return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={modalUrl}
                      alt="Vista completa"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target && !target.src.endsWith('/property.jpg') && !target.src.endsWith('/casa.jpeg')) {
                          target.src = '/property.jpg';
                        }
                      }}
                      className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
                    />
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteImageModal.isOpen}
        onClose={() => setDeleteImageModal({ isOpen: false, id: null, type: 'image' })}
        onConfirm={handleConfirmDelete}
        title={deleteImageModal.type === 'image' ? 'Eliminar Imagen' : 'Eliminar Plano'}
        message={
          deleteImageModal.type === 'image'
            ? '¿Estás seguro de que deseas eliminar esta imagen de la galería?'
            : '¿Estás seguro de que deseas eliminar este plano?'
        }
      />
    </div>
  );
};

export default AddMultimediaProperty;