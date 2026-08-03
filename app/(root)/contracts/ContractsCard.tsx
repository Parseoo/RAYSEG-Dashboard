import React from 'react';
import { Clock4 } from 'lucide-react';

const cardClient = [
  {
    title: 'Contratos activos',
    number: '20',
    description: 'Alquiler y compraventa',
    group: 1,
  },
  {
    title: 'Próximos a vencer (60 días)',
    number: '7',
    description: 'Requieren seguimiento',
    group: 1,
  },
  {
    title: 'Vencido / en renovación',
    number: '4',
    description: 'Revisión urgente',
    group: 1,
  },
  {
    title: 'Borradores',
    number: '9',
    description: 'Pendiente firma',
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
            <h1 className='text-black font-[700] text-2xl'>Contratos</h1>
            <p className='text-md text-gray-500'>Gestión centralizada de contratos de renta y compraventa.</p>
          </div>
          <button type='button'
            className='w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity font-medium text-gray-500'>
            <Clock4 size={20} /> Próximos vencimientos
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