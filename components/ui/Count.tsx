'use client'

import React from 'react';
import CountUp from 'react-countup';

interface CountProps {
  sum: number
}

const Count: React.FC<CountProps> = ({sum}) => {
  const st =(sum / 1.78)
  return (
    <div>
      <CountUp
        start={st}
        end={sum}
        duration={2}
        separator=","
        decimal="."
      />
    </div>
  );
};

export default Count;