"use client"

import { useEffect, useState } from 'react';
import InfoCard from '../ui/InfoCard';
import { GetPropertyClients } from '@/lib/api/client-api';

interface PropertyStats {
  total_active: number;
  total_sold: number;
  total_rented: number;
  total: number;
}

function Info() {
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await GetPropertyClients();
        setStats(response.data);
      } catch (error: any) {
        if (error?.response?.status !== 403) {
          console.error('Error fetching property stats:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const active = [
    { name: 'Active', title: 'Propiedades Activas', totalProperties: stats?.total_active || 0, occupiedProperties: 0, color: "#475BE8" },
  ];

  const sold = [
    { name: 'Sold', title: 'Propiedades Vendidas', totalProperties: stats?.total_sold || 0, occupiedProperties: 0, color: "#FD8539" },
  ];

  const rented = [
    { name: 'Rented', title: 'Propiedades Rentadas', totalProperties: stats?.total_rented || 0, occupiedProperties: 0, color: "#2ED480" },
  ];

  const total = [
    { name: 'Total', title: 'Total de Propiedades', totalProperties: stats?.total || 0, occupiedProperties: 0, color: "#FE6D8E" },
  ];

  if (loading) {
    return (
      <section className='w-full grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='h-32 bg-gray-100 animate-pulse rounded-lg' />
        ))}
      </section>
    );
  }

  return (
    <section className='w-full grid grid-cols-2 lg:grid-cols-4 gap-4'>
      <InfoCard data={active} />
      <InfoCard data={sold} />
      <InfoCard data={rented} />
      <InfoCard data={total} />
    </section>
  )
}

export default Info