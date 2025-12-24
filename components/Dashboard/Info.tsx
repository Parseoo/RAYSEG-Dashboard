"use client"

import React from 'react';
import InfoCard from '../ui/InfoCard';


function Info() {
  const sale = [
    { name: 'Sale', title: 'Propiedades en Venta', totalProperties: 684, occupiedProperties: 566, color: "#475BE8" },
  ]
  const rent = [
    { name: 'Rent', title: 'Propiedades en Renta', totalProperties: 546, occupiedProperties: 364, color: "#FD8539" },
  ]
  const customers = [
    { name: 'Customer', title: 'Total de Clientes', totalProperties: 5732, occupiedProperties: 4788, color: "#2ED480" },
  ]
  const city = [
    { name: 'city', title: 'Total de Ciudades ', totalProperties: 90, occupiedProperties: 75, color: "#FE6D8E" },
  ]

  return (
    <section className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <InfoCard data={sale} />
      <InfoCard data={rent} />
      <InfoCard data={customers} />
      <InfoCard data={city} />
    </section>
  )
}

export default Info