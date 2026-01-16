
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

interface YearlyData {
  year: string;
  man: number;
  woman: number;
  total: number;
}

interface YearlyEvolutionChartProps {
  data: YearlyData[];
}

const YearlyEvolutionChart = ({ data }: YearlyEvolutionChartProps) => {
  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-white to-gray-50 transform hover:scale-[1.01] transition-transform duration-200">
      <h3 className="text-lg font-semibold mb-6">Evolució d'Intervencions per Any</h3>
      <div className="h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              tick={{ fontSize: 12, fill: '#4B5563' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#4B5563' }}
            />
            <RechartsTooltip 
              formatter={(value: number) => [value.toString(), ""]}
              labelFormatter={(label) => `Any: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              wrapperStyle={{ paddingTop: "20px" }}
            />
            <Line 
              type="monotone" 
              dataKey="man" 
              name="Homes" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="woman" 
              name="Dones" 
              stroke="#22C55E" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone" 
              dataKey="total" 
              name="Total" 
              stroke="#10B981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default YearlyEvolutionChart;
