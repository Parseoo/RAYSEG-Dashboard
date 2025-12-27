import { Marker, Popup, useMap } from 'react-leaflet';
import { MarkerHouseProps } from './MarkerHouse.types'
import { icon } from 'leaflet';
import { housesData } from './MarkerHouse.data';
import Image from 'next/image';

export function MarkerHouse(props: MarkerHouseProps) {
    const { selectMarker } = props;
    const fnMap = useMap();
    const customIcon = icon({
        iconUrl: '/assets/favicon.ico',
        iconSize: [32, 32],
    })

    return (
        housesData.map(({ id, name, position, image }) => (
            <Marker key={id} position={position} icon={customIcon} eventHandlers={{
                click: () => { selectMarker(position, fnMap) }
            }}>
                <Popup>
                    <div className='flex items-center mb-2'>
                        <span className='mr-2 text-2xl text-secondary'>📍</span>
                        <h5 className='text-md text-secondary'>{name}</h5>
                    </div>
                    <Image src='/casa.jpeg' alt={name} width={100} height={100} className="w-full h-auto" />
                    <button className="px-3 py-2 mt-2 text-white rounded-lg bg-secondary mx-auto">Ver popiedad</button>
                </Popup>
            </Marker>
        ))
    )
}
