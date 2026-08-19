"use client"

import Info from './Info';
import { PropertyList } from './PropertyFrame';
import { TotalRevenue } from './TotalRevenue';
import PropertyReferrals from './PropertyReferrals';



export const Dashboard = () => {
  return (
    <div className='px-1 sm:px-0'>
        <h1 className='text-black font-[700] text-2xl sm:text-3xl mb-4 sm:mb-6'>Dashboard</h1>
        <Info />
        <div className='flex flex-col lg:flex-row w-full gap-4 lg:gap-6 mt-4 lg:mt-6'>
          <TotalRevenue />
          <PropertyReferrals />
        </div> 
        <PropertyList />
    </div>
  )
}
