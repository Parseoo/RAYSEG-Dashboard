"use client"

import Breadcrumb from "@/components/ui/breadcrumb"
import { AddPrivacyNotice } from "../privacy-notice/addPrivacyNotice"
import { useState, useEffect } from "react"
import { FileKey, Save, ScrollText, Loader2, X } from "lucide-react"
import { AddTermsConditions } from "../terms-and-conditions/addTermsConditions"
import { GetLegalPages, UpdateLegalPages } from "@/lib/api/web-content-api"
import { showToast } from "nextjs-toast-notify"
import { LegalPagesResponse } from "@/lib/@type-web"

const ContentWebPrivacyNoticePage = () => {
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [legalData, setLegalData] = useState<LegalPagesResponse>({
        privacy_title: '',
        privacy_content: '',
        terms_title: '',
        terms_content: ''
    });

    useEffect(() => {
        const fetchLegalPages = async () => {
            try {
                const res = await GetLegalPages();
                if (res.data) {
                    setLegalData(res.data);
                }
            } catch (error) {
                console.error("Error fetching legal pages:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLegalPages();
    }, []);

    const handlePrivacyChange = (id: string, value: string) => {
        setLegalData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleTermsChange = (id: string, value: string) => {
        setLegalData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await UpdateLegalPages(legalData);
            showToast.success("Páginas legales actualizadas correctamente");
        } catch (error) {
            console.error("Error saving legal pages:", error);
            showToast.error("Error al actualizar las páginas legales");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary_color" size={40} />
            </div>
        );
    }

    return (
        <>
            <Breadcrumb items={[
                { label: 'Contenido Web', href: '/content-web' },
                { label: 'Páginas Legales', href: '/content-web/legal-pages', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Paginas legales</h1>
                            <p className='text-md text-gray-500'>Este aviso describe la forma en que se recaban, utilizan y protegen los datos personales de los usuarios.</p>
                        </div>
                    </div>
                    <div className="border-b border-default">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-body">
                            <li className="me-2">
                                <button
                                    onClick={() => setActiveTab('privacy')}
                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-colors duration-200 ${activeTab === 'privacy'
                                        ? 'text-primary_color border-primary_color bg-blue-50/50'
                                        : 'border-transparent hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}>
                                    <FileKey className={`mr-2 w-5 h-5 ${activeTab === 'privacy' ? 'text-primary_color' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                    Aviso de Privacidad
                                </button>
                            </li>
                            <li className="me-2">
                                <button
                                    onClick={() => setActiveTab('terms')}
                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-colors duration-200 ${activeTab === 'terms'
                                        ? 'text-primary_color border-primary_color bg-blue-50/50'
                                        : 'border-transparent hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}>
                                    <ScrollText className={`mr-2 w-5 h-5 ${activeTab === 'terms' ? 'text-primary_color' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                    Terminos y Condiciones
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        {activeTab === 'privacy' && (
                            <AddPrivacyNotice
                                data={{ privacy_title: legalData.privacy_title, privacy_content: legalData.privacy_content }}
                                onChange={handlePrivacyChange}
                            />
                        )}
                        {activeTab === 'terms' && (
                            <AddTermsConditions
                                data={{ terms_title: legalData.terms_title, terms_content: legalData.terms_content }}
                                onChange={handleTermsChange}
                            />
                        )}
                    </div>

                    <div className="flex items-center mt-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full">
                            <button
                                type="button"
                                onClick={() => setLegalData({ privacy_title: '', privacy_content: '', terms_title: '', terms_content: '' })}
                                className="bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium shadow-md">
                                <X size={20} /> Limpiar campos
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md disabled:opacity-50">
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Guardar
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ContentWebPrivacyNoticePage;