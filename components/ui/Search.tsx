"use client"

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react';

interface SearchItem {
    title: string,
    className: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const Search: React.FC<SearchItem> = ({ title, className, value, onChange }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <div className={cn(
            'relative flex-grow lg:block',
            isSearchOpen ? 'block' : 'hidden',
            className === 'default' ? 'w-full' : className
        )}>
            <div className='absolute inset-y-0 left-0 pl-3 flex pointer-events-none items-center'>
                <Image
                    src='/search.svg'
                    alt='search'
                    width={16}
                    height={16}
                    className='text-gray-400 opacity-50'
                />
            </div>
            <input
                type='text'
                placeholder={`${title}`}
                value={value}
                onChange={onChange}
                className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500/20 focus:ring-2 focus:ring-primary_color/50 text-sm border border-transparent focus:bg-white',
                    className === 'default' && 'max-w-md'
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