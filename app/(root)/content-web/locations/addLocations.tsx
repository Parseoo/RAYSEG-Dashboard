"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsLocation } from "../inputConfig"
import { Info, Loader2, MapPinned } from "lucide-react"
import { Table } from "@/components/ui/table"
import { GetPropertiesLocations } from "@/lib/api/property/property-api"
import { GetCatalogPropertyTypes } from "@/lib/api/catalog-api"

// Headers de la tabla
const headers = [
    "Propiedad",
    "Calle y número",
    "Colonia",
    "Ciudad",
    "Estado",
    "CP",
    "Latitud",
    "Longitud",
]

// Importar el mapa dinámicamente para evitar errores de SSR
const MapWithMarker = dynamic(
    () => import("@/components/MapLocation/MapWithMarker"),
    { ssr: false }
)

export const AddLocations = () => {
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [tableData, setTableData] = useState<any[]>([])
    const [manualPosition, setManualPosition] = useState<{ lat: number, lng: number } | null>(null)

    const [filters, setFilters] = useState({
        typeProperty: "",
    })

    const [propertyTypes, setPropertyTypes] = useState<{ label: string, value: string }[]>([])

    // Fetch catalog property types
    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const res = await GetCatalogPropertyTypes()
                if (res?.data?.items) {
                    const options = res.data.items.map(item => ({
                        label: item.name,
                        value: item.value || String(item.catalogItemID)
                    }))
                    setPropertyTypes(options)
                }
            } catch (err) {
                console.error("Error fetching property types:", err)
            }
        }
        fetchPropertyTypes()
    }, [])

    // Fetch de datos desde el API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await GetPropertiesLocations()
                const properties = response.data?.properties || response.data || []
                const rows: any[] = []
                properties.forEach((prop: any) => {
                    if (prop.address && prop.address.length > 0) {
                        prop.address.forEach((addr: any) => {
                            rows.push({
                                id: prop.property_id,
                                title: prop.title || '-',
                                street: addr.street || '-',
                                street_number: addr.street_number || '',
                                neighborhood: addr.neighborhood || '-',
                                city: addr.city || '-',
                                state: addr.state || '-',
                                postal_code: addr.postal_code || '-',
                                latitude: addr.latitude != null ? parseFloat(addr.latitude) : NaN,
                                longitude: addr.longitude != null ? parseFloat(addr.longitude) : NaN,
                            })
                        })
                    } else {
                        rows.push({
                            id: prop.property_id,
                            title: prop.title || '-',
                            street: '-', street_number: '',
                            neighborhood: '-', city: '-',
                            state: '-', postal_code: '-',
                            latitude: NaN, longitude: NaN,
                        })
                    }
                })
                setTableData(rows)
            } catch (err) {
                console.error('Error fetching locations:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLocations()
    }, [])

    // Construir lista de marcadores válidos desde la tabla
    const mapMarkers = tableData
        .filter((row) => Number.isFinite(row.latitude) && Number.isFinite(row.longitude))
        .map((row) => ({
            lat: row.latitude as number,
            lng: row.longitude as number,
            title: row.title,
            address: `${row.street} ${row.street_number}, ${row.neighborhood}, ${row.city}, ${row.state} CP ${row.postal_code}`,
        }))

    // Render de filas
    const renderRow = (row: any, index: number) => (
        <tr key={`${row.id}-${index}`} className="border-b border-slate-100 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-sm font-medium text-gray-900">{row.title}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.street} {row.street_number}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.neighborhood}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.city}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.state}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.postal_code}</td>
            <td className="py-4 px-4 text-sm text-gray-500 font-mono">{Number.isFinite(row.latitude) ? (row.latitude as number).toFixed(6) : '-'}</td>
            <td className="py-4 px-4 text-sm text-gray-500 font-mono">{Number.isFinite(row.longitude) ? (row.longitude as number).toFixed(6) : '-'}</td>
        </tr>
    )

    // Buscar dirección manualmente y centrar el mapa (con marcador)
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
                const result = data[0]
                const lat = parseFloat(result.lat)
                const lng = parseFloat(result.lon)
                setManualPosition({ lat, lng })
            } else {
                setError("No se encontró la dirección. Intenta con más detalles.")
                setManualPosition(null)
            }
        } catch {
            setError("Error al buscar la dirección. Intenta de nuevo.")
            setManualPosition(null)
        } finally {
            setLoading(false)
        }
    }

    const dynamicInputsLocation = inputsLocation
        .filter(i => i.id !== "direccion")
        .map(input => {
            let options = input.options;
            if (input.id === "typeProperty" && propertyTypes.length > 0) {
                options = propertyTypes;
            }
            return {
                ...input,
                options,
                value: filters[input.id as keyof typeof filters] || "",
                onChange: (val: any) => {
                    const value = val?.target ? val.target.value : val;
                    setFilters(prev => ({ ...prev, [input.id]: value }));
                }
            }
        })

    return (
        <div className="w-full rounded-lg p-5 border">
            <h1 className="font-[500] text-lg">Vista previa del mapa</h1>
            <p className="text-md text-gray-500">
                Visualización de las propiedades según su ubicación registrada.
            </p>

            {/* Inputs de filtro */}
            <div className="mt-4">
                <DynamicInputs
                    inputs={dynamicInputsLocation}
                    withBgWhite
                />

                {/* Input de dirección */}
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
                        <button
                            type="button"
                            onClick={fijarEnMapa}
                            disabled={loading}
                            className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 font-medium disabled:opacity-60"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <MapPinned size={20} />}
                            Fijar en el mapa
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>

            <p className="text-gray-500 text-sm mt-4 mb-2">
                Usa la dirección completa para una mejor precisión del pin en el mapa.
            </p>

            {/* Indicador de marcadores activos */}
            {!isLoading && (
                <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full border border-green-200">
                        <MapPinned size={14} />
                        {mapMarkers.length} propiedad{mapMarkers.length !== 1 ? 'es' : ''} con ubicación en el mapa
                    </span>
                </div>
            )}

            {/* Mapa con todos los marcadores de la tabla */}
            <MapWithMarker markers={mapMarkers} markerPosition={manualPosition} address={address} />

            {/* Info */}
            <div className="flex items-start gap-2 text-sm text-gray-500 mt-5">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div className="space-y-1">
                    <p>
                        El mapa muestra automáticamente las propiedades con estatus
                        <strong> &quot;Disponible&quot;</strong> que tienen una dirección válida registrada.
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
