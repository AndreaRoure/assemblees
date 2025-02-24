
import React from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  type: string;
  count: number;
  percentage: number;
}

const StatsCard = ({ type, count, percentage }: StatsCardProps) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200 animate-fade-in">
    <div className="flex flex-col gap-1">
      <div className="text-sm text-gray-600">{type}</div>
      <div className="text-2xl font-bold text-gray-900">{count}</div>
      <div className="text-sm text-gray-500">
        {percentage.toFixed(1)}% del total d&apos;assistents
      </div>
    </div>
  </Card>
);

interface InterventionStatsProps {
  stats: {
    byGender: {
      man: { intervencio: number; dinamitza: number; interrupcio: number; llarga: number; ofensiva: number; explica: number; };
      woman: { intervencio: number; dinamitza: number; interrupcio: number; llarga: number; ofensiva: number; explica: number; };
      'non-binary': { intervencio: number; dinamitza: number; interrupcio: number; llarga: number; ofensiva: number; explica: number; };
    };
  };
  attendance: {
    female_count: number;
    male_count: number;
    non_binary_count: number;
  };
}

const InterventionStats = ({ stats, attendance }: InterventionStatsProps) => {
  const getTotalInterventions = (gender: 'man' | 'woman' | 'non-binary') => {
    const genderStats = stats.byGender[gender];
    return Object.values(genderStats).reduce((sum, count) => sum + count, 0);
  };

  const menInterventions = getTotalInterventions('man');
  const womenInterventions = getTotalInterventions('woman');
  const nonBinaryInterventions = getTotalInterventions('non-binary');

  const calculatePercentage = (interventions: number, attendees: number) => {
    if (attendees === 0) return 0;
    return (interventions / attendees) * 100;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Resum d&apos;intervencions per gènere
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          type="Intervencions de dones"
          count={womenInterventions}
          percentage={calculatePercentage(womenInterventions, attendance.female_count)}
        />
        <StatsCard
          type="Intervencions d'homes"
          count={menInterventions}
          percentage={calculatePercentage(menInterventions, attendance.male_count)}
        />
        <StatsCard
          type="Intervencions no binàries"
          count={nonBinaryInterventions}
          percentage={calculatePercentage(nonBinaryInterventions, attendance.non_binary_count)}
        />
      </div>
    </div>
  );
};

export default InterventionStats;
