import React from 'react';
import { PropertyFrame } from '../ui/PropertyFrame';

export const PropertyList = () => {
  const data = [
    { name: 'Star Sun Hotel & Apartment', price: 500, image: 'test.webp', location: 'North Carolina, USA'},
    { name: 'Letdo Ji Hotel & Apartment', price: 532, image: 'test.webp', location: 'New Yrk City, USA'},
    { name: 'Metro Jayakar Apartment', price: 300, image: 'test.webp', location: 'North Carolina, USA'},
    { name: 'Star Sun Hotel & Apartment', price: 600, image: 'test.webp', location: 'North Ablion, USA'},
    { name: 'Almander Hotel & Apartment ', price: 343, image: 'test.webp', location: 'Word Carolina, FCE'},
    { name: 'Monter Hotel & Apartment ', price: 8345, image: 'test.webp', location: 'Word Carolina, FCE'},
  ];
  
  return (
    <section className='w-full h-[350px] mt-6 rounded-lg bg-white p-5 shadow-md'>
        <div className='flex mb-4'>
            <h2 className='justify-start font-[600] text-xl'>Lista de Propiedades</h2>
        </div>
        <PropertyFrame data={data} />
    </section>
  )
}
