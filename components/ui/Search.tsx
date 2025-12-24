"use client"

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react';

interface SearchItem {
    title: string,
    className: string
}
const Search: React.FC<SearchItem> = ({title, className}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);  
      return (
        <div className={`w-full relative flex-grow ${isSearchOpen ? 'block' : 'hidden'} lg:block`}>
          <div className='absolute inset-y-0 left-0 pl-3 flex pointer-events-none item-center'>
            <Image 
              src='/search.svg'
              alt='search'
              width={16}
              height={16}
              className='text-gray-400'
            />
          </div>
          <input
            type='text'
            placeholder={`${title}`}
            className={cn(
                className !== 'default' && className,
                className === 'default' && 'pl-10 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500'
              )}
          />
          {/* Кнопка закрытия поиска на мобильных устройствах */}
          {isSearchOpen && (
            <button 
              className='absolute inset-y-0 right-0 pr-3 flex items-center lg:hidden'
              onClick={() => setIsSearchOpen(false)}
            >
              <span className='text-gray-400'>×</span>
            </button>
          )}
        </div>
      )
    }

export default Search