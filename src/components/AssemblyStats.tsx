
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AssemblyStats as AssemblyStatsType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssemblyStatsProps {
  stats: AssemblyStatsType;
}

const AssemblyStats = ({ stats }: AssemblyStatsProps) => {
  const isMobile = useIsMobile();

  const data = useMemo(() => [
    {
      name: 'Home',
      'Intervenció curta': stats.byGender.man.intervencio,
      'Dinamitza': stats.byGender.man.dinamitza,
      'Interrupció': stats.byGender.man.interrupcio,
      'Intervenció llarga': stats.byGender.man.llarga,
      'Ofensiva': stats.byGender.man.ofensiva,
      'Explica': stats.byGender.man.explica,
    },
    {
      name: 'Dona',
      'Intervenció curta': stats.byGender.woman.intervencio,
      'Dinamitza': stats.byGender.woman.dinamitza,
      'Interrupció': stats.byGender.woman.interrupcio,
      'Intervenció llarga': stats.byGender.woman.llarga,
      'Ofensiva': stats.byGender.woman.ofensiva,
      'Explica': stats.byGender.woman.explica,
    },
    {
      name: 'No Binari',
      'Intervenció curta': stats.byGender['non-binary'].intervencio,
      'Dinamitza': stats.byGender['non-binary'].dinamitza,
      'Interrupció': stats.byGender['non-binary'].interrupcio,
      'Intervenció llarga': stats.byGender['non-binary'].llarga,
      'Ofensiva': stats.byGender['non-binary'].ofensiva,
      'Explica': stats.byGender['non-binary'].explica,
    },
  ], [stats]);

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-200 animate-fade-in">
      <h3 className="text-base md:text-lg font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        Estadístiques per Gènere i Tipus
      </h3>
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 100 : 80 }}
          >
            <XAxis 
              dataKey="name" 
              angle={isMobile ? -45 : 0} 
              textAnchor={isMobile ? "end" : "middle"} 
              height={60} 
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: isMobile ? '10px' : '12px'
              }}
            />
            <Bar dataKey="Dinamitza" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Explica" stackId="a" fill="#4ecdc4" />
            <Bar dataKey="Interrupció" stackId="a" fill="#ffc658" />
            <Bar dataKey="Intervenció curta" stackId="a" fill="#8884d8" />
            <Bar dataKey="Intervenció llarga" stackId="a" fill="#ff8042" />
            <Bar dataKey="Ofensiva" stackId="a" fill="#ff6b6b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AssemblyStats;
