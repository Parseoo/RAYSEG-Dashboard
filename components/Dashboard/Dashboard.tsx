"use client"

import React from 'react';
import Info from './Info';
import { PropertyList } from './PropertyFrame';
import { TotalRevenue } from './TotalRevenue';
import PropertyReferrals from './PropertyReferrals';



export const Dashboard = () => {
  return (
    <>
    <div className=''>
        <h1 className='text-black font-[700] text-3xl'>Dashboard</h1>
        <Info />
        <div className='flex w-full'>
          <TotalRevenue />
          <PropertyReferrals />
        </div> 
        <PropertyList />
    </div>
    </>
  )
}
