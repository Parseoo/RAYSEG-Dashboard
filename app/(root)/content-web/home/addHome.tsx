"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { CloudUpload, Eye, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { DynamicInputs } from '@/components/ui/Input';
import Image from 'next/image';
import { inputsBannerConfiguration, inputsIntroductoryContent } from '../inputConfig';
import { GetHome, UpdateHome, UploadMainImage } from '@/lib/api/web-content-api';
import { showToast } from 'nextjs-toast-notify';
import { getImageUrl } from '@/lib/utils';

interface AddHomeProps {
    onSaveRef?: React.MutableRefObject<(() => Promise<void>) | null>;
    onClearRef?: React.MutableRefObject<(() => void) | null>;
}

export const AddHome = ({ onSaveRef, onClearRef }: AddHomeProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
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
            setIsSaving(true);
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
        } finally {
            setIsSaving(false);
        }
    };

    // Manejar subida de imagen principal
    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            await UploadMainImage(formData);

            // Recargar para obtener la nueva URL
            const res = await GetHome();
            if (res.data?.main_image_url) {
                setMainImage(res.data.main_image_url);
                setMainImagePreview(getImageUrl(res.data.main_image_url));
            }

            showToast.success("Imagen principal subida correctamente");
        } catch (error) {
            console.error("Error al subir imagen:", error);
            showToast.error("Error al subir la imagen");
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
                
                <div
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

                    {/* Hidden File Input */}
                    <input
                        id='dropzone-file-2'
                        type='file'
                        className='hidden'
                        onChange={handleMainImageChange}
                        accept="image/*"
                        disabled={isUploadingImage}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 mt-6">
                    <div className="group w-full relative rounded-md overflow-hidden h-[200px] md:h-[300px] lg:h-[400px]">
                        {mainImagePreview ? (
                            <Image
                                src={mainImagePreview}
                                alt="image"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                src="/Banner.png"
                                alt="image"
                                fill
                                className="object-cover"
                            />
                        )}

                        {/* Overlay de carga */}
                        {isUploadingImage && (
                            <div className='absolute inset-0 flex items-center justify-center bg-black/40 z-10'>
                                <Loader2 size={32} className='animate-spin text-white' />
                            </div>
                        )}

                        <a className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                        <button
                            onClick={() => setOpenModal(true)}
                            className="absolute top-4 left-4 p-2 bg-white rounded-full hover:bg-gray-100
                 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <Eye size={18} className="text-blue-600" />
                        </button>

                        <button
                            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100
                 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <Trash2 size={18} className="text-red-600" />
                        </button>

                    </div>
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
                                ✕
                            </button>

                            {/* Imagen grande */}
                            <Image
                                src={mainImagePreview || "/casa.jpeg"}
                                alt="Vista completa"
                                width={800}
                                height={480}
                                className="w-full h-[30rem] object-cover"
                            />
                        </div>
                    </div>
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