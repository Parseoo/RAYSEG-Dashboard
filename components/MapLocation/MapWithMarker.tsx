"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícono personalizado con favicon de RAYSEG (ícono de la pestaña)
const createFaviconIcon = () => L.icon({
    iconUrl: '/favicon.ico',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});

export interface MapMarker {
    lat: number;
    lng: number;
    title: string;
    address: string;
}

interface MapWithMarkerProps {
    markers?: MapMarker[];
    markerPosition?: { lat: number; lng: number } | null;
    address?: string;
    onMarkerDragEnd?: (lat: number, lng: number) => void;
}

export default function MapWithMarker({ markers, markerPosition, address, onMarkerDragEnd }: MapWithMarkerProps) {
    const mapRef          = useRef<L.Map | null>(null);
    const layerRef        = useRef<L.LayerGroup | null>(null);
    const singleMarkerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    /** Renderiza todos los marcadores multipin en el mapa */
    const renderMarkers = (map: L.Map, layer: L.LayerGroup, list: MapMarker[]) => {
        layer.clearLayers();

        const valid = list.filter(m => Number.isFinite(m.lat) && Number.isFinite(m.lng));
        if (valid.length === 0) return;

        const bounds: [number, number][] = [];
        valid.forEach((m) => {
            L.marker([m.lat, m.lng], { icon: createFaviconIcon() })
                .bindPopup(`
                    <div style="padding:8px;min-width:180px">
                        <strong style="font-size:0.9rem;color:#1a1a2e">${m.title}</strong>
                        <p style="margin:4px 0;color:#555;font-size:0.8rem">📍 ${m.address}</p>
                        <p style="margin:0;font-size:0.7rem;color:#999">
                            Lat: ${m.lat.toFixed(6)} | Lng: ${m.lng.toFixed(6)}
                        </p>
                    </div>
                `)
                .addTo(layer);
            bounds.push([m.lat, m.lng]);
        });

        if (bounds.length === 1) {
            map.flyTo(bounds[0], 14, { duration: 1.2 });
        } else {
            map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50], maxZoom: 14 });
        }
    };

    // ── Inicializar el mapa ──────────────────────────────────────────────────
    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [21.1222, -101.68],
            zoom: 6,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const layer = L.layerGroup().addTo(map);

        mapRef.current   = map;
        layerRef.current = layer;

        // Si markers ya llegaron antes de que el mapa se iniciara, renderizarlos ahora
        if (markers && markers.length > 0) {
            renderMarkers(map, layer, markers);
        }

        return () => {
            map.remove();
            mapRef.current   = null;
            layerRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Actualizar marcadores cuando cambia el array ──────────────────────────
    useEffect(() => {
        if (!mapRef.current || !layerRef.current) return;
        if (!markers || markers.length === 0) {
            layerRef.current.clearLayers();
            return;
        }
        renderMarkers(mapRef.current, layerRef.current, markers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markers]);

    // ── Modo single (búsqueda manual) – solo cuando no hay markers ───────────
    useEffect(() => {
        if (!mapRef.current) return;
        
        // Si hay markerPosition, lo mostramos SIEMPRE. Ocultamos los multi-markers (markers) 
        // para dar prioridad a la edición de la posición.
        if (markerPosition) {
            if (layerRef.current) {
                layerRef.current.clearLayers();
            }
            if (singleMarkerRef.current) {
                singleMarkerRef.current.remove();
                singleMarkerRef.current = null;
            }

            const marker = L.marker(
                [markerPosition.lat, markerPosition.lng],
                { 
                    icon: createFaviconIcon(),
                    draggable: !!onMarkerDragEnd 
                }
            )
                .addTo(mapRef.current)
                .bindPopup(`
                    <div style="padding:8px">
                        <strong>📍 Ubicación a fijar</strong>
                        <p style="margin:4px 0;color:#666">${address ?? ''}</p>
                        <p style="margin:0;font-size:0.75rem;color:#999">
                            Arrastra el pin para afinar la ubicación.
                        </p>
                    </div>
                `)
                .openPopup();

            if (onMarkerDragEnd) {
                marker.on('dragend', (e) => {
                    const pos = e.target.getLatLng();
                    onMarkerDragEnd(pos.lat, pos.lng);
                    marker.openPopup();
                });
            }

            singleMarkerRef.current = marker;
            mapRef.current.flyTo([markerPosition.lat, markerPosition.lng], 16, { duration: 1.5 });
        } else if (markers && markers.length > 0) {
            // Si no hay markerPosition y sí hay markers, renderizamos los markers normales
            if (singleMarkerRef.current) {
                singleMarkerRef.current.remove();
                singleMarkerRef.current = null;
            }
            if (layerRef.current) {
                renderMarkers(mapRef.current, layerRef.current, markers);
            }
        } else {
            // No hay ni markerPosition ni markers
            if (singleMarkerRef.current) {
                singleMarkerRef.current.remove();
                singleMarkerRef.current = null;
            }
            if (layerRef.current) {
                layerRef.current.clearLayers();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markerPosition, address, markers, onMarkerDragEnd]);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-[500px] rounded-xl shadow-md relative z-0"
        />
    );
}
