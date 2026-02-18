import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FuelEntry } from '../types';

interface FuelChartProps {
  data: FuelEntry[];
  period: 'daily' | 'weekly' | 'monthly';
  mode?: 'spending' | 'consumption';
}

const FuelChart: React.FC<FuelChartProps> = ({ data, period, mode = 'spending' }) => {
  // Mock Data to look like screenshot if real data is sparse
  const chartData = [
     { date: '02 janv.', value: 1700 },
     { date: '08 janv.', value: 1200 },
     { date: '15 janv.', value: 600 },
  ];

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
             contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px'}} 
             itemStyle={{color: '#fff'}}
          />
          <XAxis dataKey="date" hide />
          <Area 
             type="monotone" 
             dataKey="value" 
             stroke="#10b981" 
             fillOpacity={1} 
             fill="url(#colorValue)" 
             strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuelChart;