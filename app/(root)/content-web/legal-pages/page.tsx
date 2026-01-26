"use client"

import Breadcrumb from "@/components/ui/breadcrumb"
import { AddPrivacyNotice } from "../privacy-notice/addPrivacyNotice"
import { useState } from "react"
import { FileKey, Save, ScrollText } from "lucide-react"
import { AddTermsConditions } from "../terms-and-conditions/addTermsConditions"

const ContentWebPrivacyNoticePage = () => {
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

    return (
        <>
            <Breadcrumb items={[
                { label: 'Contenido Web', href: '/content-web' },
                { label: 'Páginas Legales', href: '/content-web/legal-pages', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex items-center justify-between mb-3'>
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
                            <AddPrivacyNotice />
                        )}
                        {activeTab === 'terms' && (
                            <AddTermsConditions />
                        )}
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

export default ContentWebPrivacyNoticePage;