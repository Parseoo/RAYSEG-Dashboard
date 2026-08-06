"use client"

import React, { useState, useEffect } from 'react';

const data = [
  { name: 'Redes sociales', value: 64, color: '#8884d8' },
  { name: 'Mercado', value: 40, color: '#82ca9d' },
  { name: 'Sitio web', value: 50, color: '#ffc658' },
  { name: 'Anuncios digitales', value: 80, color: '#ff8042' },
  { name: 'Otros', value: 15, color: '#ff6b6b' },
];

const PropertyReferralsChart = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Задержка для начала анимации после рендеринга компонента
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='h-full'>
      <h2 className='text-xl font-semibold mb-4'>Referencias inmobiliarias</h2>
      <div className='space-y-4 h-full'>
        {data.map((item) => (
          <div key={item.name} className='block h-auto sm:h-16'>
            <div className='flex items-center mb-2'>
              <div className='flex-1 min-w-0 text-gray-600 font-[600] text-sm sm:text-base truncate pr-2'>{item.name}</div>
              <div className='text-sm sm:text-lg font-[600] shrink-0'>
                {animate ? `${item.value}%` : '0%'}
              </div>
            </div>

            <div className='flex-grow bg-gray-200 rounded-full overflow-hidden h-2'>
              <div 
                className='h-full rounded-full transition-all duration-1000 ease-out'
                style={{ 
                  width: animate ? `${item.value}%` : '0%',
                  backgroundColor: item.color 
                }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyReferralsChart;