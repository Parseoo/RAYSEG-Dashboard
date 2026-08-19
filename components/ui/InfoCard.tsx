"use client"

import Count from '@/components/ui/Count';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts'; 

interface PropertiesData {
  name: string;
  title: string;
  totalProperties: number;
  occupiedProperties: number;
  color: string;
}

interface InfoCardProps {
  data: PropertiesData[];
}

const InfoCard: React.FC<InfoCardProps> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const item = data[0]; // Since each InfoCard receives an array with a single item

  const chartData = [
    { name: 'Occupied', value: item.occupiedProperties },
    { name: 'Available', value: item.totalProperties - item.occupiedProperties },
  ];

  const COLORS = [item.color, '#E5E7EB']; // Use the provided color for occupied, light gray for available

  return (
    <div className='bg-white p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-between gap-2'>
      <div className='min-w-0'>
        <h3 className='text-xs sm:text-sm text-gray-500 font-medium leading-tight'>{item.title}</h3>
        <div className='text-xl sm:text-2xl font-bold mt-1'><Count sum={item.totalProperties} /></div>
      </div>
      <div className='w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shrink-0'>
        {isMounted ? (
          <PieChart width={56} height={56}>
            <Pie
              data={chartData}
              cx={24}
              cy={24}
              innerRadius={14}
              outerRadius={24}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey='value'
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse border-4 border-gray-50" />
        )}
      </div>
    </div>
  );
};

export default InfoCard;