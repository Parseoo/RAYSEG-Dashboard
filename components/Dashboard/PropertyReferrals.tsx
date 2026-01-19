import React from 'react';
import PropertyReferralsChart from '../ui/PropertyReferralsChart';

const PropertyReferrals = () => {
  return (
    <section className='lg:ml-6 mt-6 w-full lg:max-w-[30vw] h-[400px] sm:h-[500px] bg-white rounded-lg p-4 sm:p-6 shadow-md'>
        <PropertyReferralsChart />
    </section>
  )
}

export default PropertyReferrals