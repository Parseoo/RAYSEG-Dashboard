"use client"

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PropertyCard } from '../ui/PropertyCard';
import { GetAllProperty } from '@/lib/api/property/property-query';

export const PropertyList = () => {
  const { data, isLoading } = GetAllProperty()

  return (
    <section className='w-full h-[350px] mt-6 rounded-lg bg-white p-5 shadow-md'>
      <div className='flex mb-4'>
        <h2 className='justify-start font-[600] text-xl'>Lista de Propiedades</h2>
      </div>
      <Carousel className='w-full' opts={{
        align: 'start',
      }}>
        <CarouselContent className='-ml-1'>
          {isLoading
            ? 'Loading...'
            : data?.length
              ? data.map((item: any, index: any) => (
                <CarouselItem key={index} className='pl-2 lg:basis-[26%]'>
                  <PropertyCard data={item} />
                </CarouselItem>
              ))
              : 'Data Error'
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
