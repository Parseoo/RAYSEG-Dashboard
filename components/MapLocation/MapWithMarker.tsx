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
    id?: string | number;
    lat: number;
    lng: number;
    title: string;
    address: string;
    image?: string;
}

interface MapWithMarkerProps {
    markers?: MapMarker[];
    markerPosition?: { lat: number; lng: number } | null;
    address?: string;
    onMarkerDragEnd?: (lat: number, lng: number) => void;
}

export default function MapWithMarker({ markers, markerPosition, address, onMarkerDragEnd }: Readonly<MapWithMarkerProps>) {
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
                    <div style="min-width:180px;text-align:center;">
                        <div style="display:flex;align-items:center;margin-bottom:8px;">
                            <span style="font-size:1.5rem;margin-right:8px;">📍</span>
                            <strong style="font-size:1rem;color:#1a303d;text-align:left;">${m.title}</strong>
                        </div>
                        <p style="margin:4px 0 12px 0;color:#555;font-size:0.8rem;text-align:left;">${m.address}</p>
                        ${m.image ? `<img src="${m.image}" alt="${m.title}" style="width:100%;height:auto;margin-bottom:8px;border-radius:4px;" />` : ''}
                        ${m.id ? `<a href="/property/${m.id}" style="display:inline-block;padding:8px 12px;color:white;background-color:#1a303d;border-radius:8px;text-decoration:none;font-size:0.9rem;width:100%;">Ver propiedad</a>` : `<button style="display:inline-block;padding:8px 12px;color:white;background-color:#1a303d;border-radius:8px;border:none;font-size:0.9rem;width:100%;cursor:pointer;">Ver propiedad</button>`}
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

    // ── Modo single (búsqueda manual / geocodificación automática por dirección) ──
    useEffect(() => {
        if (!mapRef.current) return;
        let isCancelled = false;

        const clearSingleMarker = () => {
            if (singleMarkerRef.current) {
                singleMarkerRef.current.remove();
                singleMarkerRef.current = null;
            }
        };

        const setSingleMarker = (lat: number, lng: number, label: string, draggable: boolean) => {
            if (layerRef.current) layerRef.current.clearLayers();
            clearSingleMarker();

            const marker = L.marker([lat, lng], { icon: createFaviconIcon(), draggable })
                .addTo(mapRef.current!)
                .bindPopup(`
                    <div style="padding:8px">
                        <strong>📍 Ubicación de la propiedad</strong>
                        <p style="margin:4px 0;color:#666">${label}</p>
                    </div>
                `);

            if (draggable && onMarkerDragEnd) {
                marker.on('dragend', (e) => {
                    const pos = e.target.getLatLng();
                    onMarkerDragEnd(pos.lat, pos.lng);
                });
            }

            singleMarkerRef.current = marker;
            mapRef.current!.flyTo([lat, lng], 15, { duration: 1.5 });
        };

        const handleGeocode = (cleanAddress: string) => {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}`)
                .then(res => res.json())
                .then(data => {
                    if (isCancelled || !mapRef.current) return;
                    if (Array.isArray(data) && data.length > 0) {
                        const lat = Number.parseFloat(data[0].lat);
                        const lng = Number.parseFloat(data[0].lon);
                        if (Number.isFinite(lat) && Number.isFinite(lng)) {
                            setSingleMarker(lat, lng, cleanAddress, false);
                        }
                    }
                })
                .catch(err => console.warn('Geocoding failed:', err));
        };

        const hasValidMarkerPos = markerPosition && 
            Number.isFinite(markerPosition.lat) && 
            Number.isFinite(markerPosition.lng) && 
            (markerPosition.lat !== 0 || markerPosition.lng !== 0);

        if (hasValidMarkerPos) {
            setSingleMarker(markerPosition!.lat, markerPosition!.lng, address ?? '', !!onMarkerDragEnd);
        } else if (address && address.trim().length > 3) {
            handleGeocode(address.trim());
        } else if (markers && markers.length > 0) {
            clearSingleMarker();
            if (layerRef.current) renderMarkers(mapRef.current, layerRef.current, markers);
        } else {
            clearSingleMarker();
            if (layerRef.current) layerRef.current.clearLayers();
        }

        return () => {
            isCancelled = true;
        };
    }, [markerPosition, address, markers, onMarkerDragEnd]);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-[500px] rounded-xl shadow-md relative z-0"
        />
    );
}
