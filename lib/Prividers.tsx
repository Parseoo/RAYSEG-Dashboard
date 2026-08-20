'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIProvider } from '@vis.gl/react-google-maps';

export default function Providers({ children }: { readonly children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}> 
      {children}
      </APIProvider>
    </QueryClientProvider>
  )
}