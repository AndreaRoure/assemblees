
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface InterventionsChartProps {
  data: Array<{
    gender: string;
    intervencio: number;
    dinamitza: number;
    interrupcio: number;
    llarga: number;
    ofensiva: number;
    explica: number;
  }>;
}

const InterventionsChart = ({ data }: InterventionsChartProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="p-4 w-full overflow-hidden">
      <div className="font-semibold mb-4 text-sm md:text-base">
        Intervencions per Gènere
      </div>
      <div className="w-full h-[300px] md:h-[350px] -mx-4 md:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ 
              top: 20, 
              right: isMobile ? 16 : 30, 
              left: isMobile ? 0 : 40, 
              bottom: isMobile ? 80 : 40 
            }}
          >
            <XAxis 
              dataKey="gender"
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={80}
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={isMobile ? 20 : 10}
              tickFormatter={(value) => {
                // Break long text into multiple lines on mobile
                if (isMobile && value.includes(' ')) {
                  return value.split(' ').map((word, i) => 
                    i === 0 ? word : `\n${word}`
                  ).join('');
                }
                return value;
              }}
            />
            <YAxis 
              width={isMobile ? 35 : 40}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                fontSize: isMobile ? '12px' : '14px',
                padding: '8px 12px'
              }}
              wrapperStyle={{
                zIndex: 1000
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={isMobile ? 60 : 36}
              wrapperStyle={{ 
                fontSize: isMobile ? '11px' : '12px',
                paddingTop: '16px'
              }}
            />
            <Bar dataKey="intervencio" stackId="a" fill="#8884d8" name="Intervenció" />
            <Bar dataKey="dinamitza" stackId="a" fill="#82ca9d" name="Dinamitza" />
            <Bar dataKey="interrupcio" stackId="a" fill="#ffc658" name="Interrupció" />
            <Bar dataKey="llarga" stackId="a" fill="#ff8042" name="Inter. llarga" />
            <Bar dataKey="ofensiva" stackId="a" fill="#ff6b6b" name="Inter. ofensiva" />
            <Bar dataKey="explica" stackId="a" fill="#4ecdc4" name="Explica" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default InterventionsChart;
