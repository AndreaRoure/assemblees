
import React from 'react';
import { AssemblyStats, AssemblyAttendance } from '@/types';
import QuickIntervention from '@/components/QuickIntervention';
import InterventionStats from '@/components/InterventionStats';
import AttendanceManager from '@/components/AttendanceManager';

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
      
      <AttendanceManager assemblyId={assemblyId} />

      <QuickIntervention
        assemblyId={assemblyId}
        onInterventionAdded={onInterventionChange}
      />

      {stats && attendance && (
        <InterventionStats stats={stats} attendance={attendance} />
      )}
    </div>
  );
};

export default AssemblyDetails;
