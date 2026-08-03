import React from 'react';
import Link from 'next/link';

const Breadcrumb = ({ items }: { items: { label: string, href: string, active?: boolean }[] }) => {
    return (
        <nav className='flex mb-4' aria-label='Breadcrumb'>
            <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
                {items.map((item, index) => (
                    <li key={index} aria-current={item.active ? 'page' : undefined} className='inline-flex items-center'>
                        {index > 0 && (
                            <svg className='w-3.5 h-3.5 mx-1 text-gray-400' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 6 10'>
                                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 9 4-4-4-4' />
                            </svg>
                        )}
                        {item.active ? (
                            <span className='ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400'>{item.label}</span>
                        ) : (
                            <Link href={item.href} className={`inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white ${index === 0 ? '' : 'ms-1 md:ms-2'}`}>
                                {index === 0 && (
                                    <svg className='w-4 h-4 me-1.5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'><path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5' /></svg>
                                )}
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumb;