"use client"

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  arr: number[];
  color: string;
}

const DoughnutChart:React.FC<DoughnutChartProps> = ({ arr, color }) => {
  const data = {
    datasets: [{
      data: arr,
      backgroundColor: [
        color,
        '#E4E8EF',
      ],
      hoverOffset: 4
    }]
  };


  return (
    <div style={{ width: '75px', height: '75px' }}>
      <Doughnut data={data}/>
    </div>
  );
};

export default DoughnutChart;