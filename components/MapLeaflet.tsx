"use client"

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapLeafletProps {
    center: { lat: number; lng: number };
    zoom?: number;
}

export const MapLeaflet = ({ center, zoom = 6 }: MapLeafletProps) => {
    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={zoom}
            scrollWheelZoom={false}
            className="h-[700px] relative z-0"
            style={{ position: 'relative', zIndex: 0 }}
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png" />
        </MapContainer>
    );
};

export default MapLeaflet;
