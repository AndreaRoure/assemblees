
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
  const getTotalInterventions = (gender: 'man' | 'woman' | 'non-binary') => {
    const genderStats = stats.byGender[gender];
    return Object.values(genderStats).reduce((sum, count) => sum + count, 0);
  };

  // Ensure we have valid attendance counts
  const safeAttendance = {
    female_count: Math.max(0, attendance?.female_count || 0),
    male_count: Math.max(0, attendance?.male_count || 0),
    non_binary_count: Math.max(0, attendance?.non_binary_count || 0),
  };

  const totalAttendees = safeAttendance.female_count + safeAttendance.male_count + safeAttendance.non_binary_count;
  const menInterventions = getTotalInterventions('man');
  const womenInterventions = getTotalInterventions('woman');
  const nonBinaryInterventions = getTotalInterventions('non-binary');
  const totalInterventions = menInterventions + womenInterventions + nonBinaryInterventions;

  const calculatePercentage = (interventions: number) => {
    if (totalInterventions === 0) return 0;
    return (interventions / totalInterventions) * 100;
  };

  const calculateInterventionsPerAttendee = (interventions: number, attendees: number) => {
    if (attendees === 0) return 0;
    return interventions / attendees;
  };

  return null;
};

export default InterventionStats;
