
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AssemblyStats as AssemblyStatsType } from '@/types';

interface AssemblyStatsProps {
  stats: AssemblyStatsType;
}

const AssemblyStats = ({ stats }: AssemblyStatsProps) => {
  const genderData = [
    { name: 'Home', value: stats.byGender.man },
    { name: 'Dona', value: stats.byGender.woman },
    { name: 'Trans', value: stats.byGender.trans },
    { name: 'No binari', value: stats.byGender['non-binary'] },
  ];

  const typeData = [
    { name: 'Intervenció', value: stats.byType.intervencio },
    { name: 'Dinamitza', value: stats.byType.dinamitza },
    { name: 'Interrupció', value: stats.byType.interrupcio },
    { name: 'Llarga', value: stats.byType.llarga },
    { name: 'Ofensiva', value: stats.byType.ofensiva },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Per Gènere</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genderData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Per Tipus</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AssemblyStats;
