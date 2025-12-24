"use client"

import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';

export const Gallery = ({ isOpen, onClose, images }: any) => {
  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const onOverlayClose = (e: any) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed cursor-default inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4' onClick={e => onOverlayClose(e)}>
      <div className='bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-xl font-bold'>Изображения</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
            </svg>
          </button>
        </div>
        <div className='p-4 grid grid-cols-2 md:grid-cols-3 gap-4'>
          {images.map((image: any, index: any) => (
            <Image
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              width={200}
              height={200}
              className='w-full h-48 object-cover rounded-lg'
            />
          ))}
        </div>
      </div>
    </div>
  );
};


export default Gallery