"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { CloudUpload, Eye, Image as ImageIcon, Trash2, Loader2, X } from 'lucide-react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsBannerConfiguration, inputsIntroductoryContent } from '../inputConfig';
import { GetHome, UpdateHome, UploadMainImage, DeleteMainImage } from '@/lib/api/web-content-api';
import { showToast } from 'nextjs-toast-notify';
import { getImageUrl, fileToBase64 } from '@/lib/utils';

interface AddHomeProps {
    onSaveRef?: React.MutableRefObject<(() => Promise<void>) | null>;
    onClearRef?: React.MutableRefObject<(() => void) | null>;
}

export const AddHome = ({ onSaveRef, onClearRef }: AddHomeProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Banner data
    const [bannerData, setBannerData] = useState<Record<string, string>>({
        titlePrinciple: "",
        subtitlePrinciple: ""
    });

    // Introductory content data
    const [introData, setIntroData] = useState<Record<string, string>>({
        titleIntroductory: "",
        introduction: ""
    });

    useEffect(() => {
        if (onClearRef) {
            onClearRef.current = () => {
                setBannerData({ titlePrinciple: "", subtitlePrinciple: "" });
                setIntroData({ titleIntroductory: "", introduction: "" });
                setMainImage(null);
                setMainImagePreview(null);
            };
        }
    }, [onClearRef]);

    // Load existing home data
    const fetchHomeData = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await GetHome();
            if (res?.data) {
                setBannerData({
                    titlePrinciple: res.data.main_title || "",
                    subtitlePrinciple: res.data.main_subtitle || ""
                });
                setIntroData({
                    titleIntroductory: res.data.introductory_title || "",
                    introduction: res.data.introductory_subtitle || ""
                });
                if (res.data.main_image_url) {
                    setMainImage(res.data.main_image_url);
                    setMainImagePreview(getImageUrl(res.data.main_image_url));
                } else {
                    setMainImage(null);
                    setMainImagePreview(null);
                }
            }
        } catch (error) {
            console.error("Error al cargar datos de home:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    // Handle save home content
    const handleSaveHome = async () => {
        try {
            await UpdateHome({
                main_title: bannerData.titlePrinciple || "",
                main_subtitle: bannerData.subtitlePrinciple || "",
                introductory_title: introData.titleIntroductory || "",
                introductory_subtitle: introData.introduction || ""
            });
            showToast.success("Configuración de home guardada correctamente");
        } catch (error) {
            console.error("Error al guardar home:", error);
            showToast.error("Error al guardar la configuración de home");
        }
    };

    // Manejar subida de imagen principal
    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const base64 = await fileToBase64(file);
            setMainImagePreview(base64);

            const res = await UploadMainImage({ file: base64 });

            if (res.data?.main_image_url) {
                setMainImage(res.data.main_image_url);
                setMainImagePreview(getImageUrl(res.data.main_image_url));
            } else {
                const refreshed = await GetHome();
                if (refreshed.data?.main_image_url) {
                    setMainImage(refreshed.data.main_image_url);
                    setMainImagePreview(getImageUrl(refreshed.data.main_image_url));
                }
            }

            showToast.success("Imagen principal subida correctamente");
        } catch (error: any) {
            console.error("Error al subir imagen:", error);
            showToast.error(error?.response?.data?.detail || error?.response?.data?.message || "Error al subir la imagen");
            if (!mainImage) {
                setMainImagePreview(null);
            } else {
                setMainImagePreview(getImageUrl(mainImage));
            }
        } finally {
            setIsUploadingImage(false);
            e.target.value = '';
        }
    };

    // Manejar eliminación de imagen principal
    const handleDeleteMainImage = async () => {
        setIsUploadingImage(true);
        try {
            await DeleteMainImage();
            setMainImage(null);
            setMainImagePreview(null);
            showToast.success("Imagen principal eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            setMainImage(null);
            setMainImagePreview(null);
            showToast.success("Imagen quitada correctamente");
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Expose save function to parent via ref
    useEffect(() => {
        if (onSaveRef) {
            onSaveRef.current = handleSaveHome;
        }
    }, [onSaveRef, bannerData, introData]);

    const mappedBannerInputs = inputsBannerConfiguration.map(input => ({
        ...input,
        value: bannerData[input.id] || "",
        onChange: (val: any) => {
            const value = val?.target ? val.target.value : val;
            setBannerData(prev => ({ ...prev, [input.id]: value }));
        }
    }));

    const mappedIntroInputs = inputsIntroductoryContent.map(input => ({
        ...input,
        value: introData[input.id] || "",
        onChange: (val: any) => {
            const value = val?.target ? val.target.value : val;
            setIntroData(prev => ({ ...prev, [input.id]: value }));
        }
    }));

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Banner Principal</h1>
                <p className='text-md text-gray-500'>Configura el banner de inicio: texto e imágen destacada.</p>

   <div className='mt-4'>
                    {isLoading ? (
                        <div className='flex items-center justify-center py-8'>
                            <Loader2 size={24} className='animate-spin text-gray-400' />
                        </div>
                    ) : (
                        <DynamicInputs inputs={mappedBannerInputs} withBgWhite={true} />
                    )}
                </div>
                
                <button
                    type="button"
                    className='bg-white flex items-center justify-center w-full mt-5 rounded-md'
                    onClick={() => document.getElementById('dropzone-file-2')?.click()}
                >
                    <div className='flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-md hover:bg-blue-50  hover:border-blue-500 transition-colors cursor-pointer'>
                        <div className='flex flex-col items-center justify-center text-body pt-5 pb-6'>
                            <CloudUpload size={30} className='mb-3 text-blue-500' />
                            <div className='inline-flex items-center text-smfont-medium'>
                                <ImageIcon size={20} className='mr-2' />
                                <p className='text-sm font-semibold'>Haz click o arrastra para subir o cambiar la imágen</p>
                            </div>
                            <p className='text-sm mt-2 text-gray-500'>Formatos JPG/PNG <span className='font-semibold'>30MB</span> por foto.</p>
                            <p className='text-sm mt-1 text-gray-500'>Dimensiones requeridas: <span className='font-semibold'>1920 × 1080</span> píxeles.</p>

                        </div>
                    </div>
                </button>

                {/* Hidden File Input */}
                <input
                    id='dropzone-file-2'
                    type='file'
                    className='hidden'
                    onChange={handleMainImageChange}
                    accept="image/*"
                    disabled={isUploadingImage}
                />

                {mainImagePreview && (
                    <div className="grid grid-cols-1 gap-6 mt-6">
                        <div className="group w-full relative rounded-md overflow-hidden h-[200px] md:h-[300px] lg:h-[400px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={mainImagePreview}
                                alt="Imagen de banner"
                                className="object-cover w-full h-full"
                            />

                            {/* Overlay de carga */}
                            {isUploadingImage && (
                                <div className='absolute inset-0 flex items-center justify-center bg-black/40 z-10'>
                                    <Loader2 size={32} className='animate-spin text-white' />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 z-10" />
                            <button
                                type="button"
                                onClick={() => setOpenModal(true)}
                                className="absolute top-4 left-4 p-2 bg-white rounded-full hover:bg-gray-100 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="Ver imagen"
                            >
                                <Eye size={18} className="text-blue-600" />
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteMainImage}
                                disabled={isUploadingImage}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                                title="Eliminar imagen"
                            >
                                <Trash2 size={18} className="text-red-600" />
                            </button>
                        </div>
                    </div>
                )}

                {openModal && mainImagePreview && (
                    <dialog
                        open
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-transparent border-none w-full h-full p-0 m-0"
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                setOpenModal(false);
                            }
                        }}
                    >
                        {/* Backdrop button */}
                        <button
                            type="button"
                            className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-default border-none outline-none"
                            onClick={() => setOpenModal(false)}
                            aria-label="Cerrar modal"
                            tabIndex={-1}
                        />

                        {/* Modal content */}
                        <div className="relative z-10 p-4 pointer-events-none w-full max-w-5xl h-full flex items-center justify-center">
                            <div className="pointer-events-auto relative flex items-center justify-center w-full h-full">
                                {/* Botón cerrar */}
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 shadow z-10 transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                {/* Imagen grande */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                src={mainImagePreview}
                                alt="Vista completa"
                                className="max-w-full max-h-full object-contain"
                            />
                            </div>
                        </div>
                    </dialog>
                )}


             
            </div>

            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Contenido introductorio</h1>
                <p className='text-md text-gray-500'>Texto breve que aparece debajo de la sección de propiedades para explicar la propuesta de valor.</p>
                <div className='mt-4'>
                    {isLoading ? (
                        <div className='flex items-center justify-center py-8'>
                            <Loader2 size={24} className='animate-spin text-gray-400' />
                        </div>
                    ) : (
                        <DynamicInputs inputs={mappedIntroInputs} withBgWhite={true} />
                    )}
                </div>
            </div>
        </>
    )
}

export default AddHome;