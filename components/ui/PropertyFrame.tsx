"use client"

import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

interface PropertyItem {
    name: string, 
    price: number,
    image: string, 
    location: string
}

interface PropertyFrameProps {
    data: PropertyItem[]
}

const CustomArrow: React.FC<any> = (props) => {
    const { className, style, onClick, direction } = props;
    return (
        <div
            className={`${className} before:content-['']`}
            style={{ 
                ...style, 
                background: 'white', 
                borderRadius: '50%', 
                width: '30px', 
                height: '30px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                zIndex: 1
            }}
            onClick={onClick}
        >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-4 h-4'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={direction === 'next' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
            </svg>
        </div>
    );
}

export const PropertyFrame: React.FC<PropertyFrameProps> = ({data}) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <CustomArrow direction='next' />,
        prevArrow: <CustomArrow direction='prev' />,
        swipeToSlide: true,
        swipe: true,
        draggable: true,
        touchMove: true,
        variableWidth: true,
    };

    return (
        <div className='relative w-full'>
            <Slider {...settings} className='property-slider'>
                {data.map((item: PropertyItem) => (
                    <div key={item.name} className='px-1'>
                        <div className='w-[330px] mr-8'>
                            <Image src={`/${item.image}`} alt='frame image' width={330} height={190} className='w-full h-auto object-cover rounded-lg'/>
                            <div className='flex items-center mt-2'>
                                <span className='text-lg font-[600] mb-1'>{item.name}</span>
                                <div className='rounded-lg bg-secondary_color font-[600] ml-auto w-[55px] h-[35px] flex'>
                                    <span className='text-primary_color m-auto'>${item.price}</span>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <span className='mr-2'>
                                    <Image src={'/location.svg'} alt='location' width={17} height={17}/>
                                </span>
                                <span className='font-[400] text-sm text-second_text_color'>
                                    {item.location}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default PropertyFrame;