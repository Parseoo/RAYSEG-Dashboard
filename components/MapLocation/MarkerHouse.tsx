import L from "leaflet";

interface MarkerHouseProps {
    map: L.Map;
    position: { lat: number; lng: number };
    onSelect?: (position: { lat: number; lng: number }, map: L.Map) => void;
}

export function addMarkerHouse({ map, position, onSelect }: MarkerHouseProps): L.Marker {
    // Crear ícono personalizado con el favicon
    const faviconIcon = L.icon({
        iconUrl: "/favicon.ico",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    const marker = L.marker([position.lat, position.lng], { icon: faviconIcon })
        .addTo(map)
        .bindPopup("Ubicación");

    if (onSelect) {
        marker.on("click", () => {
            onSelect(position, map);
        });
    }

    return marker;
}

