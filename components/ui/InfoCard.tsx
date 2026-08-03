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
    <div className='bg-white p-4 rounded-lg shadow-md flex items-center justify-between'>
      <div>
        <h3 className='text-sm text-gray-500 font-medium'>{item.title}</h3>
        <div className='text-2xl font-bold mt-1'><Count sum={item.totalProperties} /></div>
      </div>
      <div className='w-16 h-16 flex items-center justify-center'>
        {isMounted ? (
          <PieChart width={80} height={80}>
            <Pie
              data={chartData}
              cx={36}
              cy={36}
              innerRadius={20}
              outerRadius={32}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey='value'
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <div className="w-[64px] h-[64px] rounded-full bg-gray-100 animate-pulse border-4 border-gray-50" />
        )}
      </div>
    </div>
  );
};

export default InfoCard;