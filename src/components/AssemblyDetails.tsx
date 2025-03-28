
import React from 'react';
import { AssemblyStats, AssemblyAttendance } from '@/types';
import QuickIntervention from '@/components/QuickIntervention';
import ResponsiveAssemblyStats from '@/components/ResponsiveAssemblyStats';
import InterventionStats from '@/components/InterventionStats';
import AttendanceCounter from '@/components/AttendanceCounter';

interface AssemblyDetailsProps {
  assemblyId: string;
  stats: AssemblyStats | null | undefined;
  attendance: AssemblyAttendance | null | undefined;
  onInterventionChange: () => void;
  onAttendanceUpdate: (
    type: 'female_count' | 'male_count' | 'non_binary_count',
    increment: boolean
  ) => void;
  onBackClick: () => void;
}

const AssemblyDetails = ({
  assemblyId,
  stats,
  attendance,
  onInterventionChange,
  onAttendanceUpdate,
  onBackClick,
}: AssemblyDetailsProps) => {
  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <button
        onClick={onBackClick}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Tornar a la llista
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AttendanceCounter
          label="Dones assistents"
          count={attendance?.female_count || 0}
          onIncrement={() => onAttendanceUpdate('female_count', true)}
          onDecrement={() => onAttendanceUpdate('female_count', false)}
        />
        <AttendanceCounter
          label="Homes assistents"
          count={attendance?.male_count || 0}
          onIncrement={() => onAttendanceUpdate('male_count', true)}
          onDecrement={() => onAttendanceUpdate('male_count', false)}
        />
        <AttendanceCounter
          label="No binàries assistents"
          count={attendance?.non_binary_count || 0}
          onIncrement={() => onAttendanceUpdate('non_binary_count', true)}
          onDecrement={() => onAttendanceUpdate('non_binary_count', false)}
        />
      </div>

      <QuickIntervention
        assemblyId={assemblyId}
        onInterventionAdded={onInterventionChange}
      />
      
      {stats && <ResponsiveAssemblyStats stats={stats} />}

      {stats && attendance && (
        <InterventionStats stats={stats} attendance={attendance} />
      )}
    </div>
  );
};

export default AssemblyDetails;
