"use client"
import { User } from "@/lib/@type"

interface ProfessionalProfileProps {
    user?: User | null;
}

export const ProfessionalProfile = ({ user }: ProfessionalProfileProps) => {
    return (
        <div className="bg-white rounded-lg p-6 border shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Perfil Profesional</h2>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                {user?.description || "Especialista en propiedades residenciales de lujo y comerciales en la zona poniente de la Ciudad de México. Con más de 10 años de experiencia en el sector inmobiliario, enfocada en brindar un servicio personalizado y eficiente para la gestión de compra-venta y renta de inmuebles premium."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-500 font-medium">Propiedades Activas</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <div className="text-xs text-gray-500 font-medium">Leads Totales</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">4.9</div>
                    <div className="text-xs text-gray-500 font-medium">Calificación</div>
                </div>
            </div>

            <div className="mt-auto">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Certificaciones</h3>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">AMPI Certificado</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">Luxury Real Estate</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">Gestión Hipotecaria</span>
                </div>
            </div>
        </div>
    )
}
