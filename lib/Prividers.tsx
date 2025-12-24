'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIProvider } from '@vis.gl/react-google-maps';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey='AIzaSyD5qvorB-eE-cqvl4XOTgDy8BxWqVPeNeA'> 
      {children}
      </APIProvider>
    </QueryClientProvider>
  )
}