
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatsCardProps {
  type: string;
  count: number;
  totalAttendees: number;
  percentage: number;
  interventionsPerAttendee: number;
}

const StatsCard = ({ type, count, totalAttendees, percentage, interventionsPerAttendee }: StatsCardProps) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200 animate-fade-in">
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-600">{type}</div>
      <div className="text-2xl font-bold text-gray-900">{count}</div>
      <div className="text-sm text-gray-500">
        {percentage.toFixed(1)}% del total d'intervencions
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{totalAttendees} assistents</span>
          <span>{interventionsPerAttendee.toFixed(1)} intervencions/persona</span>
        </div>
        <Progress value={interventionsPerAttendee * 10} max={10} className="h-1.5" />
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
    totalInterventions: number;
  };
  attendance: {
    female_count: number;
    male_count: number;
    non_binary_count: number;
  };
}

const InterventionStats = ({ stats, attendance }: InterventionStatsProps) => {
  // Function to count all interventions for a gender
  const getTotalInterventions = (gender: 'man' | 'woman' | 'non-binary') => {
    const genderStats = stats.byGender[gender];
    return Object.values(genderStats).reduce((sum, count) => sum + count, 0);
  };

  // Calculate totals
  const totalAttendees = attendance.female_count + attendance.male_count + attendance.non_binary_count;
  const womenInterventions = getTotalInterventions('woman');
  const menInterventions = getTotalInterventions('man');
  const nonBinaryInterventions = getTotalInterventions('non-binary');
  const totalInterventions = womenInterventions + menInterventions + nonBinaryInterventions;

  // Helper functions for calculating percentages and per-attendee rates
  const calculatePercentage = (interventions: number) => {
    if (totalInterventions === 0) return 0;
    return (interventions / totalInterventions) * 100;
  };

  const calculateInterventionsPerAttendee = (interventions: number, attendees: number) => {
    if (attendees === 0) return 0;
    return interventions / attendees;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Resum d'intervencions per gènere
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          type="Intervencions de dones"
          count={womenInterventions}
          totalAttendees={attendance.female_count}
          percentage={calculatePercentage(womenInterventions)}
          interventionsPerAttendee={calculateInterventionsPerAttendee(womenInterventions, attendance.female_count)}
        />
        <StatsCard
          type="Intervencions d'homes"
          count={menInterventions}
          totalAttendees={attendance.male_count}
          percentage={calculatePercentage(menInterventions)}
          interventionsPerAttendee={calculateInterventionsPerAttendee(menInterventions, attendance.male_count)}
        />
        <StatsCard
          type="Intervencions no binàries"
          count={nonBinaryInterventions}
          totalAttendees={attendance.non_binary_count}
          percentage={calculatePercentage(nonBinaryInterventions)}
          interventionsPerAttendee={calculateInterventionsPerAttendee(nonBinaryInterventions, attendance.non_binary_count)}
        />
      </div>
      
      {totalInterventions > 0 && totalAttendees > 0 && (
        <Card className="p-4 mt-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-gray-600">Resum global</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalInterventions}</div>
                <div className="text-sm text-gray-500">Total d'intervencions</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{totalAttendees}</div>
                <div className="text-sm text-gray-500">Total d'assistents</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Mitjana d'intervencions per assistent</span>
                <span>{(totalInterventions / totalAttendees).toFixed(1)}</span>
              </div>
              <Progress 
                value={totalInterventions / totalAttendees * 10} 
                max={10} 
                className="h-2" 
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InterventionStats;
