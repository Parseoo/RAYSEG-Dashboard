import React from 'react';
import SingUp from '@/components/SingUp/SingUp';

const page = () => {
  return (
    <section>
      <SingUp />
    </section>
  )
}

page.getLayout = (page: React.ReactNode) => page;


export default page