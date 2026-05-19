import React from 'react';
import { Upload } from 'lucide-react';

const cardClient = [
  {
    title: 'Clientes activos',
    number: '132',
    description: 'Con operaciones en curso',
    group: 1,
  },
  {
    title: 'Nuevos este mes',
    number: '23',
    description: 'Clientes captados',
    group: 1,
  },
  {
    title: 'Prospectos',
    number: '54',
    description: 'Contactos recientes',
    group: 1,
  },
  {
    title: 'Clientes propietarios',
    number: '19',
    description: 'Con propiedades listadas',
    group: 1,
  },
]

// Agrupa un array de items por la propiedad `group`
const groupBy = (items: typeof cardClient) => {
  const map: Record<string | number, typeof cardClient> = {}
  items.forEach((it) => {
    const g = it.group ?? 0
    if (!map[g]) map[g] = []
    map[g].push(it)
  })
  return Object.values(map)
}

export const ClientsCard = () => {
  const grouped = groupBy(cardClient)

  return (
    <div className='bg-white w-full max-h-max rounded-lg p-5 mb-5 shadow-md'>
      <div className='w-full h-full'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
          <div>
            <h1 className='text-black font-[700] text-2xl'>Clientes</h1>
            <p className='text-md text-gray-500'>Gestión de clientes, prospectos y propietarios</p>
          </div>
          <button type='button'
            className='w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
            <Upload size={20} /> Importar CSV
          </button>
        </div>

        {grouped.map((group, gi) => (
          <div key={gi} className='flex gap-4'>
            {group.map((card, index) => (
              <div key={index} className='bg-slate-100 flex-1 rounded-lg p-5'>
                <h2 className='text-gray-500 text-md'>{card.title}</h2>
                <p className='text-2xl font-bold text-black mt-2'>{card.number}</p>
                <p className='text-md text-gray-500 mt-2'>{card.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}