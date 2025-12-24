import React from 'react';

const loading = () => {
  return (
    <section>
      <section>
        <div className='mt-5 flex gap-6 w-full justify-between h-auto'>
          {[1, 2, 3, 4].map((item) => (
            <ul key={item} className='animate-pulse p-5  bg-[#4d4b47] w-full h-[110px] rounded-lg shadow-sm overflow-hidden'>
              <p className='text-white'>Loading...</p>
            </ul>
          ))}
        </div>
      </section>

      <section className='animate-pulse mt-6 w-full h-[360px] bg-[#4d4b47] rounded-lg'>
        <p className='text-white'>Loading...</p>
      </section>
      <section className='animate-pulse ml-6 mt-6 w-full max-w-[30vw] h-[360px] v rounded-lg'>
        <p className='text-white'>Loading...</p>
      </section>
      <section className='animate-pulse w-full h-[330px] mt-6 rounded-lg bg-[#4d4b47]'>
        <p className='text-white'>Loading...</p>
      </section>
    </section>

  )
}

export default loading