"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícono personalizado con favicon
const createFaviconIcon = () => L.icon({
    iconUrl: '/favicon.ico',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

interface MapWithMarkerProps {
    markerPosition: { lat: number; lng: number } | null;
    address: string;
}

export default function MapWithMarker({ markerPosition, address }: MapWithMarkerProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Centro inicial del mapa (México)
    const defaultCenter: [number, number] = [21.1222, -101.68];

    // Inicializar el mapa
    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        mapRef.current = L.map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 6,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Actualizar marcador cuando cambian las coordenadas
    useEffect(() => {
        if (!mapRef.current) return;

        // Remover marcador anterior si existe
        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }

        // Si hay posición, crear nuevo marcador
        if (markerPosition) {
            const faviconIcon = createFaviconIcon();

            markerRef.current = L.marker([markerPosition.lat, markerPosition.lng], { icon: faviconIcon })
                .addTo(mapRef.current)
                .bindPopup(`
                    <div style="padding: 8px;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="margin-right: 8px; font-size: 1.5rem;">📍</span>
                            <strong>Ubicación</strong>
                        </div>
                        <p style="margin: 0 0 8px 0; color: #666;">${address}</p>
                        <p style="margin: 0; font-size: 0.75rem; color: #999;">
                            Lat: ${markerPosition.lat.toFixed(6)}<br/>
                            Lng: ${markerPosition.lng.toFixed(6)}
                        </p>
                    </div>
                `)
                .openPopup();

            // Volar a la nueva ubicación
            mapRef.current.flyTo([markerPosition.lat, markerPosition.lng], 15, {
                duration: 1.5
            });
        }
    }, [markerPosition, address]);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-[400px] rounded-lg shadow-md"
        />
    );
}
