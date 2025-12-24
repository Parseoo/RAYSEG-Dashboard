'use client'
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface BarChartProps {
  data: number[];
  labels: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, labels }) => {
  const chartContainer = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartContainer.current) {
      const ctx = chartContainer.current.querySelector('canvas')?.getContext('2d');
      
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '$21,714,000',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
              },
              {
                label: '$15,980,000',
                data: data.map(val => val * 0.7),
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return (value as number) / 1000 + 'k';
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top' as const,
              },
            }
          }
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, labels]);

  return (
    <div ref={chartContainer} className='chart-container'>
      <canvas width={'100%'} height={'100%'}/>
    </div>
  );
};

export default BarChart;