"use client"

import React, { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsLocation } from "../inputConfig"
import { Info, Loader2, MapPinned, Pencil, Trash2, MoreVertical } from "lucide-react"
import { Table } from "@/components/ui/table"
import { GetPropertiesLocations, GetAllProperties, DeleteLocation, AddLocation, GetPropertyById, GetPropertyLocationById } from "@/lib/api/property/property-api"
import { GetCatalogPropertyTypes } from "@/lib/api/catalog-api"
import Link from "next/link"
import DeleteModal from "@/components/ui/DeleteModal"
import { showToast } from 'nextjs-toast-notify'
import Search from "@/components/ui/Search"

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
    "Acciones",
]

// Importar el mapa dinámicamente para evitar errores de SSR
const MapWithMarker = dynamic(
    () => import("@/components/MapLocation/MapWithMarker"),
    { ssr: false }
)

// Helper para mapear la respuesta del API a las filas de la tabla
const mapLocationsToRows = (locations: any[], properties: any[] = []) => {
    return locations.map((loc: any) => {
        const addr = loc.address || {};
        const location = loc.location || {};

        const exterior = addr.exterior_number || addr.street_number || "";
        const interior = addr.interior_number ? ` Int ${addr.interior_number}` : "";
        const streetNumber = `${exterior}${interior}`.trim();

        // Buscar el título de la propiedad usando property_id o property_address_id
        const propId = loc.property_id || loc.property_address_id;
        const property = properties.find((p: any) => String(p.property_id) === String(propId));
        const propertyTitle = property?.title || loc.property_title || loc.title || `Propiedad Dir: ${loc.property_address_id}`;

        return {
            id: loc.property_address_id,
            property_id: loc.property_id || loc.property_address_id,
            address_id: loc.property_address_id,
            title: propertyTitle,
            street: addr.street || "-",
            street_number: streetNumber || "",
            neighborhood: addr.neighborhood || "-",
            city: addr.city || "-",
            state: addr.state || "-",
            postal_code: addr.zip_code || addr.postal_code || "-",
            latitude: location.latitude != null ? parseFloat(location.latitude) : NaN,
            longitude: location.longitude != null ? parseFloat(location.longitude) : NaN,
        };
    });
};

interface AddLocationsProps {
    onClearRef?: React.MutableRefObject<(() => void) | null>;
}

export const AddLocations = ({ onClearRef }: AddLocationsProps) => {
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [tableData, setTableData] = useState<any[]>([])
    const [manualPosition, setManualPosition] = useState<{ lat: number, lng: number } | null>(null)
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
    const [properties, setProperties] = useState<any[]>([])
    const [rawLocations, setRawLocations] = useState<any[]>([])

    const [filters, setFilters] = useState({
        typeProperty: "",
    })

    const [propertyTypes, setPropertyTypes] = useState<{ label: string, value: string }[]>([])
    const [tableSearchTerm, setTableSearchTerm] = useState("")
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; propertyId: string | null; addressId: string | null }>({
        isOpen: false,
        propertyId: null,
        addressId: null,
    })
    const [saving, setSaving] = useState(false)
    const [openActionMenu, setOpenActionMenu] = useState<string | number | null>(null)

    useEffect(() => {
        if (onClearRef) {
            onClearRef.current = () => {
                setAddress("")
                setManualPosition(null)
                setSelectedPropertyId("")
            }
        }
    }, [onClearRef])

    // Fetch lista de propiedades para el select
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res: any = await GetAllProperties(1, 100)
                console.log('Respuesta completa de GetAllProperties:', res)
                let items: any[] = []
                if (Array.isArray(res?.data?.properties)) {
                    items = res.data.properties
                } else if (Array.isArray(res?.data?.items)) {
                    items = res.data.items
                } else if (Array.isArray(res?.data)) {
                    items = res.data
                } else if (Array.isArray(res?.properties)) {
                    items = res.properties
                }
                setProperties(items)
            } catch (err) {
                console.error("Error fetching properties:", err)
            }
        }
        fetchProperties()
    }, [])

    // Update address when a property is selected
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            if (!selectedPropertyId) {
                setAddress("")
                return
            }
            try {
                const res = await GetPropertyById(selectedPropertyId)
                const prop = res.data
                if (prop && prop.address) {
                    const addr = Array.isArray(prop.address) ? prop.address[0] : prop.address
                    if (addr) {
                        if (addr.full_address) {
                            setAddress(addr.full_address);
                        } else {
                            const street = addr.street || ""
                            const exterior = addr.exterior_number || addr.street_number || ""
                            const interior = addr.interior_number ? ` Int ${addr.interior_number}` : ""
                            const streetNumber = `${exterior}${interior}`.trim()

                            const segments = [
                                addr.street,
                                streetNumber,
                                addr.neighborhood,
                                addr.city,
                                addr.state,
                                addr.zip_code || addr.postal_code
                            ].filter(Boolean).map(s => String(s).trim()).filter(s => s.length > 0)

                            setAddress(segments.join(", "))
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching property details for address:", err)
            }
        }
        fetchPropertyDetails()
    }, [selectedPropertyId])

    // Fetch catalog property types
    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const res = await GetCatalogPropertyTypes()
                if (res?.data?.items) {
                    setPropertyTypes(
                        res.data.items.map((item) => ({
                            label: item.name,
                            value: item.name,
                        }))
                    )
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
                const locations = response.data?.locations || []
                setRawLocations(locations)
            } catch (err) {
                console.error('Error fetching locations:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLocations()
    }, [])

    // Sincronizar tableData cuando rawLocations o properties cambien
    useEffect(() => {
        setTableData(mapLocationsToRows(rawLocations, properties))
    }, [rawLocations, properties])

    const filteredTableData = useMemo(() => {
        if (!tableSearchTerm.trim()) return tableData;
        const term = tableSearchTerm.toLowerCase().trim();
        return tableData.filter(row =>
            (row.title || "").toLowerCase().includes(term) ||
            (row.street || "").toLowerCase().includes(term) ||
            (row.street_number || "").toLowerCase().includes(term) ||
            (row.neighborhood || "").toLowerCase().includes(term) ||
            (row.city || "").toLowerCase().includes(term) ||
            (row.state || "").toLowerCase().includes(term) ||
            (row.postal_code || "").toLowerCase().includes(term)
        );
    }, [tableData, tableSearchTerm]);

    // Construir lista de marcadores válidos desde la tabla
    const mapMarkers = tableData
        .filter((row) => Number.isFinite(row.latitude) && Number.isFinite(row.longitude))
        .map((row) => ({
            lat: row.latitude as number,
            lng: row.longitude as number,
            title: row.title,
            address: `${row.street} ${row.street_number}, ${row.neighborhood}, ${row.city}, ${row.state} CP ${row.postal_code}`,
        }))

    // Eliminar ubicación
    const handleDelete = async () => {
        if (!deleteModal.propertyId || !deleteModal.addressId) return;
        try {
            await DeleteLocation(deleteModal.propertyId, deleteModal.addressId);
            setDeleteModal({ isOpen: false, propertyId: null, addressId: null });
            // Recargar datos
            const response = await GetPropertiesLocations();
            const locations = response.data?.locations || [];
            setTableData(mapLocationsToRows(locations, properties));
        } catch (err) {
            console.error('Error deleting location:', err);
            showToast.error('Error al eliminar la ubicación');
        }
    }

    // Guardar ubicación en base de datos
    const handleSaveLocation = async () => {
        if (!selectedPropertyId) {
            setError("Por favor selecciona una propiedad");
            return;
        }
        if (!manualPosition) {
            setError("Por favor ubica la dirección en el mapa primero (clic en Fijar en el mapa)");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const propRes = await GetPropertyById(selectedPropertyId);
            const prop = propRes.data;
            let addrData: any = {};
            if (prop && prop.address) {
                addrData = Array.isArray(prop.address) ? prop.address[0] : prop.address;
            }

            const exterior = addrData?.exterior_number || addrData?.street_number || "";
            const interior = addrData?.interior_number ? ` Int ${addrData.interior_number}` : "";
            const streetNumber = `${exterior}${interior}`.trim();

            const locationData = {
                latitude: manualPosition.lat,
                longitude: manualPosition.lng,
            };
            const addRes = await AddLocation(selectedPropertyId, locationData);
            const newAddressId = addRes.data?.data?.property_address_id || "new";

            // Agregar a la tabla inmediatamente para que el usuario lo vea
            const newRow = {
                id: selectedPropertyId,
                property_id: selectedPropertyId,
                address_id: newAddressId,
                title: prop?.title || prop?.name || `Propiedad ${selectedPropertyId}`,
                street: addrData?.street || "Calle",
                street_number: streetNumber || "S/N",
                neighborhood: addrData?.neighborhood || "Colonia",
                city: addrData?.city || "Ciudad",
                state: addrData?.state || "Guanajuato",
                postal_code: addrData?.zip_code || addrData?.postal_code || "38000",
                latitude: manualPosition.lat,
                longitude: manualPosition.lng,
            };

            setTableData((prev) => {
                const filtered = prev.filter(r => r.property_id !== selectedPropertyId);
                return [newRow, ...filtered];
            });

            setAddress("");
            setSelectedPropertyId("");
            setManualPosition(null);

            // Recargar datos en segundo plano
            GetPropertiesLocations().then(locResponse => {
                const locations = locResponse.data?.locations || []
                setTableData(mapLocationsToRows(locations, properties))
            }).catch(err => console.error("Error recargando tabla tras guardar:", err));
            const message = addRes?.data?.message || "Ubicación guardada correctamente";
            showToast.success(message);
        } catch (err) {
            console.error("Error al guardar ubicación:", err);
            setError("Error al guardar la ubicación. Intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    }

    // Editar ubicación en el formulario superior
    const handleEditLocation = async (row: any) => {
        if (!row.property_id) return;

        try {
            // Se consume GetPropertyLocationById según requerimiento
            const res = await GetPropertyLocationById(String(row.property_id));
            const locationData = res.data?.location || res.data;

            // Llenar el select con la propiedad correspondiente
            setSelectedPropertyId(String(row.property_id));

            // Colocar el marcador en el mapa usando la respuesta
            if (locationData && locationData.latitude && locationData.longitude) {
                setManualPosition({
                    lat: parseFloat(locationData.latitude),
                    lng: parseFloat(locationData.longitude)
                });
            } else if (Number.isFinite(row.latitude) && Number.isFinite(row.longitude)) {
                // Fallback a los datos de la fila de la tabla si la API no los trae completos
                setManualPosition({
                    lat: row.latitude as number,
                    lng: row.longitude as number
                });
            }

            showToast.success("Propiedad seleccionada para edición");

            // Hacer scroll hacia arriba donde está el mapa (opcional)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Error al obtener la ubicación:", error);
            showToast.error("Error al cargar la información de la ubicación");
        }
    }

    // Render de filas
    const renderRow = (row: any, index: number) => (
        <tr key={`${row.id}-${index}`} className="border-b border-slate-100 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-sm font-medium text-gray-900">{row.title}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.street || "-"} {row.street_number || ""}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.neighborhood || "-"}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.city || "-"}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.state || "-"}</td>
            <td className="py-4 px-4 text-sm text-gray-700">{row.postal_code || "-"}</td>
            <td className="py-4 px-4 text-sm text-gray-500 font-mono">{Number.isFinite(row.latitude) ? (row.latitude as number).toFixed(6) : '-'}</td>
            <td className="py-4 px-4 text-sm text-gray-500 font-mono">{Number.isFinite(row.longitude) ? (row.longitude as number).toFixed(6) : '-'}</td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => handleEditLocation(row)} className="p-1.5 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors">
                        <Pencil size={16} className="text-gray-600" />
                    </button>
                    <button
                        onClick={() => row.address_id && setDeleteModal({ isOpen: true, propertyId: row.property_id, addressId: row.address_id })}
                        disabled={!row.address_id}
                        className={`p-1.5 rounded-md ${row.address_id ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        <Trash2 size={16} className="text-white" />
                    </button>
                </div>
            </td>
        </tr>
    )

    const toggleActionMenu = (id: string | number) => {
        setOpenActionMenu(prev => prev === id ? null : id);
    };

    const renderMobileCard = (row: any, index: number) => (
        <div key={`${row.id}-${index}`} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative">
            {/* Header: Title and Actions */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className='font-bold text-base text-gray-800 mb-1'>{row.title}</h3>
                    <p className="text-xs text-gray-500">ID: {row.property_id}</p>
                </div>
                
                {/* Actions Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => toggleActionMenu(`${row.id}-${index}`)}
                        className="p-1.5 text-gray-500 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        <MoreVertical size={20} />
                    </button>
                    
                    {openActionMenu === `${row.id}-${index}` && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                            <button 
                                onClick={() => {
                                    setOpenActionMenu(null);
                                    handleEditLocation(row);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2"
                            >
                                <Pencil size={16} /> Editar
                            </button>
                            <button 
                                onClick={() => {
                                    setOpenActionMenu(null);
                                    row.address_id && setDeleteModal({ isOpen: true, propertyId: row.property_id, addressId: row.address_id });
                                }}
                                disabled={!row.address_id}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                    row.address_id 
                                        ? 'text-red-600 hover:bg-red-50' 
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                            >
                                <Trash2 size={16} /> Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Address Details */}
            <div className="space-y-2.5 text-sm mb-3">
                <div className="flex items-start gap-2">
                    <MapPinned size={16} className="text-primary_color mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                            {row.street || "-"} {row.street_number || ""}
                        </p>
                        <p className="text-gray-600 text-xs">
                            {row.neighborhood || "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-sm pt-3 border-t border-slate-100">
                <div>
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Ciudad</p>
                    <p className="text-gray-800">{row.city || '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Estado</p>
                    <p className="text-gray-800">{row.state || '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">CP</p>
                    <p className="text-gray-800">{row.postal_code || '-'}</p>
                </div>
                <div className="col-span-2 border-t border-slate-100 pt-2 mt-1">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Coordenadas</p>
                    <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-gray-700">
                            <span className="text-gray-500">Lat:</span> {Number.isFinite(row.latitude) ? (row.latitude as number).toFixed(6) : '-'}
                        </span>
                        <span className="text-gray-700">
                            <span className="text-gray-500">Lng:</span> {Number.isFinite(row.longitude) ? (row.longitude as number).toFixed(6) : '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

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
        <div className="w-full rounded-lg p-4 sm:p-5 border">
            <div className="mb-4">
                <h1 className="font-[500] text-lg sm:text-xl">Vista previa del mapa</h1>
                <p className="text-sm sm:text-md text-gray-500 mt-1">
                    Visualización de las propiedades según su ubicación registrada.
                </p>
            </div>

            {/* Inputs de filtro */}
            <div className="mt-4 space-y-4">
                {/* Select de Propiedad */}
                <div className="w-full">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                        Selecciona una propiedad
                    </label>
                    <select
                        value={selectedPropertyId}
                        onChange={(e) => {
                            setSelectedPropertyId(e.target.value)
                            console.log('ID de propiedad seleccionada:', e.target.value)
                            const selectedProp = properties.find(p => String(p.property_id || p.id) === String(e.target.value))
                            console.log('Propiedad completa seleccionada:', selectedProp)
                        }}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
                    >
                        <option value="">Seleccionar propiedad</option>
                        {properties && properties.length > 0 && properties.map((prop) => {
                            const propIdStr = String(prop.property_id || prop.id || '');
                            const propTitleStr = prop.title || prop.name || `Propiedad ${propIdStr}`;
                            return (
                                <option key={propIdStr} value={propIdStr}>
                                    {propTitleStr}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Input de dirección */}
                <div className="w-full">
                    <label htmlFor="direccion" className="text-sm font-medium text-gray-700 block mb-2">
                        Dirección a fijar en el mapa
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="direccion"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ej: Calle 123, Colonia, Ciudad, Estado"
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm h-[42px]"
                            onKeyDown={(e) => e.key === "Enter" && fijarEnMapa()}
                        />
                        <button
                            type="button"
                            onClick={fijarEnMapa}
                            disabled={loading}
                            className="bg-primary_color text-white w-full sm:w-auto sm:min-w-[180px] h-[42px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 font-medium disabled:opacity-60 shadow-md text-sm whitespace-nowrap px-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Buscando...</span>
                                </>
                            ) : (
                                <>
                                    <MapPinned size={18} />
                                    <span>Fijar en el mapa</span>
                                </>
                            )}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </div>

            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500 mt-4 mb-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />
                <p>
                    Usa la dirección completa para una mejor precisión del pin en el mapa.
                </p>
            </div>

            {/* Indicador de marcadores activos */}
            {!isLoading && (
                <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-full border border-green-200">
                        <MapPinned size={14} className="flex-shrink-0" />
                        <span className="whitespace-nowrap">
                            {mapMarkers.length} propiedad{mapMarkers.length !== 1 ? 'es' : ''}
                        </span>
                    </span>
                </div>
            )}

            {/* Mapa con todos los marcadores de la tabla */}
            <MapWithMarker
                markers={manualPosition ? undefined : mapMarkers}
                markerPosition={manualPosition}
                address={address}
                onMarkerDragEnd={(lat, lng) => setManualPosition({ lat, lng })}
            />

            {manualPosition && (
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleSaveLocation}
                        disabled={saving}
                        className="bg-[#16a34a] text-white w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium shadow-md hover:bg-[#15803d] disabled:opacity-60 flex items-center justify-center gap-2 text-sm transition-all"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Guardando...</span>
                            </>
                        ) : (
                            <>
                                <MapPinned size={18} />
                                <span>Guardar ubicación</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500 mt-5 bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
                <Info size={16} className="mt-0.5 shrink-0 text-slate-600" />
                <div className="space-y-1.5">
                    <p>
                        El mapa muestra automáticamente las propiedades con estatus
                        <strong> &quot;Disponible&quot;</strong> que tienen una dirección válida registrada.
                    </p>
                    <p>Los marcadores se actualizan en tiempo real.</p>
                    <p>Puedes ajustar manualmente la dirección para mejorar la precisión del pin en el mapa público.</p>
                </div>
            </div>

            {/* Tabla */}
            <div className="mt-6 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                    <h2 className="text-base sm:text-md font-semibold text-gray-800">
                        Propiedades con ubicación registrada
                    </h2>
                    <Search
                        title="Buscar propiedad o ubicación..."
                        value={tableSearchTerm}
                        onChange={(e) => setTableSearchTerm(e.target.value)}
                        className="w-full sm:max-w-[350px]"
                    />
                </div>
                
                <div className="hidden md:block">
                    <Table data={filteredTableData} headers={headers} renderRow={renderRow} isLoading={isLoading} />
                </div>

                <div className="md:hidden mt-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color"></div>
                        </div>
                    ) : filteredTableData.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {filteredTableData.map((row, idx) => renderMobileCard(row, idx))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-slate-100">
                            No hay localizaciones registradas
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-amber-800 flex items-start gap-2">
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                    <span>Esta lista solo afecta cómo se muestran los marcadores en el mapa público. No modifica la dirección oficial de la propiedad en tu inventario.</span>
                </p>
            </div>

            {/* Modal de confirmación para eliminar */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, propertyId: null, addressId: null })}
                onConfirm={handleDelete}
                title="Eliminar Localización"
                itemName={tableData.find(r => r.property_id === deleteModal.propertyId && r.address_id === deleteModal.addressId)?.title}
                customDeletePhrase="eliminar la localización de"
                itemDetails={[
                    { label: 'Calle', value: tableData.find(r => r.property_id === deleteModal.propertyId && r.address_id === deleteModal.addressId)?.street || '-' },
                    { label: 'Ciudad', value: tableData.find(r => r.property_id === deleteModal.propertyId && r.address_id === deleteModal.addressId)?.city || '-' },
                ]}
            />
        </div>
    )
}
