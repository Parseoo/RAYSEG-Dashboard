"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsLocation } from "../inputConfig"
import { Info, MapPinned, Pencil, Trash2 } from "lucide-react"
import { Table } from "@/components/ui/table"

// Headers de la tabla
const headers = [
    "Propiedad",
    "Dirección",
    "Acciones"
]

// Importar el mapa dinámicamente para evitar errores de SSR
const MapWithMarker = dynamic(
    () => import("@/components/MapLocation/MapWithMarker"),
    { ssr: false }
)

export const AddLocations = () => {
    // Estados
    const [address, setAddress] = useState("")
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Datos mock de la tabla (luego vienen del backend)
    const tableData = [
        {
            id: 1,
            title: "Casa Centro",
            address: "Av. Juárez 123, León, Gto"
        },
        {
            id: 2,
            title: "Departamento Norte",
            address: "Blvd. Campestre 456, León, Gto"
        }
    ]

    // Render de filas (mismo patrón que PropertyList)
    const renderRow = (row: any, index: number) => (
        <tr key={row.id || index} className="border-b border-slate-100 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                {row.title}
            </td>

            <td className="py-4 px-4 text-sm text-gray-700">
                {row.address}
            </td>

            <td className='py-4 px-4'>
                <div className='flex items-center gap-2'>
                    <button className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
                        <Pencil size={16} className='text-gray-600' />
                    </button>
                    <button className='p-1.5 bg-red-500 rounded-md transition-colors hover:bg-red-600'>
                        <Trash2 size={16} className='text-white' />
                    </button>
                </div>
            </td>
        </tr>
    )

    // Fijar dirección en el mapa
    const fijarEnMapa = async () => {
        if (!address.trim()) {
            setError("Por favor ingresa una dirección")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
            )
            const data = await response.json()

            if (data && data.length > 0) {
                const { lat, lon } = data[0]
                setMarkerPosition({
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                })
            } else {
                setError("No se encontró la dirección. Intenta con más detalles.")
            }
        } catch {
            setError("Error al buscar la dirección. Intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full rounded-lg p-5 border">
            <h1 className="font-[500] text-lg">Vista previa del mapa</h1>
            <p className="text-md text-gray-500">
                Visualización de las propiedades según su ubicación registrada.
            </p>

            {/* Inputs */}
            <div className="mt-4">
                <DynamicInputs
                    inputs={inputsLocation.filter(i => i.id !== "direccion")}
                    withBgWhite
                />

                {/* Dirección */}
                <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="direccion" className="text-sm font-medium text-gray-700">
                        Dirección a fijar en el mapa
                    </label>

                    <div className="flex gap-2">
                        <input
                            id="direccion"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ej: Calle 123, Colonia, Ciudad, Estado"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onKeyDown={(e) => e.key === "Enter" && fijarEnMapa()}
                        />

                        <button type="button" onClick={fijarEnMapa} className="bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 font-medium">
                            <MapPinned size={20} />
                            Fijar en el mapa
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>

            <p className="text-gray-500 text-sm mt-4 mb-4">
                Usa la dirección completa para una mejor precisión del pin en el mapa.
            </p>

            {markerPosition && (
                <p className="text-green-600 text-sm mb-4">
                    📍 Coordenadas: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                </p>
            )}

            {/* Mapa */}
            <MapWithMarker markerPosition={markerPosition} address={address} />

            {/* Info */}
            <div className="flex items-start gap-2 text-sm text-gray-500 mt-5">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div className="space-y-1">
                    <p>
                        El mapa muestra automáticamente las propiedades con estatus
                        <strong> "Disponible"</strong> que tienen una dirección valida registrada.
                    </p>
                    <p>Los marcadores se actualizan en tiempo real.</p>
                    <p>Puedes ajustar manualmente la dirección para mejorar la precisión del pin en el mapa público.</p>
                </div>
            </div>

            {/* Tabla */}
            <div className="mt-6 bg-white rounded-lg p-4">
                <h2 className="text-md font-medium mb-3">Propiedades con ubicación registrada</h2>
                <Table data={tableData} headers={headers} renderRow={renderRow} isLoading={isLoading} />
            </div>
            <p className="text-sm text-gray-500 mt-5">Esta lista solo afecta cómo se muestran los marcadores en el mapa público. No modifica la dirección oficial de la propiedad en tu inventario.</p>
        </div>
    )
}
