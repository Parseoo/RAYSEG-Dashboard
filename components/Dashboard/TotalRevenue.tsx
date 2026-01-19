import React from 'react';
import RevenueChart from '../ui/chart/RevenueChart';

export const TotalRevenue = () => {
  return (
    <section className='mt-6 w-full h-[400px] sm:h-[500px] bg-white rounded-lg p-4 sm:p-5 shadow-md'>
        <RevenueChart />
    </section>
  )
}
