"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { addMarkerHouse } from "./MarkerHouse";

export default function MapLocation() {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Si el mapa ya existe, no lo inicialices de nuevo
        if (mapRef.current) return;

        // Verificar que el contenedor existe
        if (!mapContainerRef.current) return;

        // Coordenadas del marcador
        const markerPosition = { lat: 21.1222, lng: -101.68 };

        // Inicializar el mapa
        mapRef.current = L.map(mapContainerRef.current, {
            center: [markerPosition.lat, markerPosition.lng],
            zoom: 6,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapRef.current);

        // Agregar el marcador con favicon usando la función helper
        addMarkerHouse({
            map: mapRef.current,
            position: markerPosition,
            onSelect: (position: { lat: number; lng: number }, map: L.Map) => {
                map.flyTo([position.lat, position.lng], 10, {
                    duration: 1.5
                });
            }
        });

        // Cleanup cuando el componente se desmonta
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            style={{ height: "400px", width: "100%" }}
            className="rounded-lg shadow-md"
        ></div>
    );
}

