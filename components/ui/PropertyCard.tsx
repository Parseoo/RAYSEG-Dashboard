import React from 'react';
import { PropertyCardProps } from '@/lib/@type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export const PropertyCard: React.FC<PropertyCardProps> = ({ data, opt }) => {
  const router = useRouter()
  const { id, mainImage, title, price, location, square, amountBed } = data
  if (opt === 'horizontal') {
    return (
      <>
        <div className='flex w-auto h-auto items-center transition-all hover:scale-105' onClick={() => { router.push(`/property/${id}`) }}>
          <Image
            src={mainImage}
            alt={`${title} image`}
            width={300}
            height={180}
            className='h-[180px] rounded-lg object-cover'
          />
          <div className='ml-4 '>
            <div className='rounded-lg bg-secondary_color font-[600] mr-auto w-[55px] h-[35px] flex mb-3'>
              <span className='text-primary_color m-auto'>${price}</span>
            </div>
            <div className='mb-3'>
              <p className='font-[600] text-lg'>{title}</p>
            </div>
            <div className='flex items-center mb-3'>
              <span className='mr-2'>
                <Image src='/location.svg' alt='location' width={17} height={17} />
              </span>
              <span className='font-[400] text-sm text-second_text_color'>
                {location}
              </span>
            </div>
            <div className='flex items-center gap-9'>
              <div className='flex gap-2'>
                <Image src='/bed.svg' alt='bed' width={17} height={17} />
                <p>{amountBed} Beds</p>
              </div>
              <div className='flex gap-2'>
                <Image src='/cross.svg' alt='cross' width={17} height={17} />
                <p>{square}M</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <div className='w-[330px] mr-8 mb-8'>
      <Image
        src={mainImage}
        alt={`${title} image`}
        width={330}
        height={190}
        className='h-52 object-cover rounded-lg'
      />
      <div className='flex items-center mt-2'>
        <span className='text-lg font-[600] mb-1'>{title}</span>
        <div className='rounded-lg bg-secondary_color font-[600] ml-auto w-[55px] h-[35px] flex'>
          <span className='text-primary_color m-auto'>${price}</span>
        </div>
      </div>
      <div className='flex items-center'>
        <span className='mr-2'>
          <Image src='/location.svg' alt='location' width={17} height={17} />
        </span>
        <span className='font-[400] text-sm text-second_text_color'>
          {location}
        </span>
      </div>
    </div>
  )
}