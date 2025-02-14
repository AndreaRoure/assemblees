
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AssemblyStats as AssemblyStatsType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssemblyStatsProps {
  stats: AssemblyStatsType;
}

const AssemblyStats = ({ stats }: AssemblyStatsProps) => {
  const isMobile = useIsMobile();

  const data = [
    {
      name: 'Home',
      'Intervenció curta': stats.byGender.man.intervencio || 0,
      'Dinamitza': stats.byGender.man.dinamitza || 0,
      'Interrupció': stats.byGender.man.interrupcio || 0,
      'Intervenció llarga': stats.byGender.man.llarga || 0,
      'Ofensiva': stats.byGender.man.ofensiva || 0,
      'Explica': stats.byGender.man.explica || 0,
    },
    {
      name: 'Dona',
      'Intervenció curta': stats.byGender.woman.intervencio || 0,
      'Dinamitza': stats.byGender.woman.dinamitza || 0,
      'Interrupció': stats.byGender.woman.interrupcio || 0,
      'Intervenció llarga': stats.byGender.woman.llarga || 0,
      'Ofensiva': stats.byGender.woman.ofensiva || 0,
      'Explica': stats.byGender.woman.explica || 0,
    },
    {
      name: 'Trans',
      'Intervenció curta': stats.byGender.trans.intervencio || 0,
      'Dinamitza': stats.byGender.trans.dinamitza || 0,
      'Interrupció': stats.byGender.trans.interrupcio || 0,
      'Intervenció llarga': stats.byGender.trans.llarga || 0,
      'Ofensiva': stats.byGender.trans.ofensiva || 0,
      'Explica': stats.byGender.trans.explica || 0,
    },
    {
      name: 'No Binari',
      'Intervenció curta': stats.byGender['non-binary'].intervencio || 0,
      'Dinamitza': stats.byGender['non-binary'].dinamitza || 0,
      'Interrupció': stats.byGender['non-binary'].interrupcio || 0,
      'Intervenció llarga': stats.byGender['non-binary'].llarga || 0,
      'Ofensiva': stats.byGender['non-binary'].ofensiva || 0,
      'Explica': stats.byGender['non-binary'].explica || 0,
    },
  ];

  return (
    <Card className="p-4">
      <h3 className="text-base md:text-lg font-semibold mb-4">Estadístiques per Gènere i Tipus</h3>
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
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis />
            <Tooltip />
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
