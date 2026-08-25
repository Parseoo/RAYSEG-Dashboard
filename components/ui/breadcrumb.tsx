import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [], className = '' }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav className={`flex items-center mb-4 ${className}`} aria-label='Breadcrumb'>
            <ol className='flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs sm:text-sm'>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isActive = item.active ?? isLast;
                    const isFirst = index === 0;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            aria-current={isActive ? 'page' : undefined}
                            className='inline-flex items-center gap-1 sm:gap-1.5'
                        >
                            {index > 0 && (
                                <svg
                                    className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 6 10'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='m1 9 4-4-4-4'
                                    />
                                </svg>
                            )}

                            {isActive || !item.href || item.href === '#' ? (
                                <span className={`inline-flex items-center font-semibold text-gray-800 dark:text-gray-200 ${isFirst ? 'gap-1.5' : ''}`}>
                                    {isFirst && (
                                        <svg
                                            className='w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-primary_color'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='24'
                                            height='24'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                stroke='currentColor'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5'
                                            />
                                        </svg>
                                    )}
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`inline-flex items-center font-medium text-gray-500 hover:text-primary_color transition-colors duration-150 ${isFirst ? 'gap-1.5' : ''}`}
                                >
                                    {isFirst && (
                                        <svg
                                            className='w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='24'
                                            height='24'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                stroke='currentColor'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5'
                                            />
                                        </svg>
                                    )}
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;