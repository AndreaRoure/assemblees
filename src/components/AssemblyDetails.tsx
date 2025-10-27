import React from 'react';
import { AssemblyStats } from '@/types';
import QuickIntervention from '@/components/QuickIntervention';
import InterventionStats from '@/components/InterventionStats';
import AttendanceManager from '@/components/AttendanceManager';

interface AssemblyDetailsProps {
  assemblyId: string;
  stats: AssemblyStats | null | undefined;
  onInterventionChange: () => void;
  onBackClick: () => void;
}

const AssemblyDetails = ({
  assemblyId,
  stats,
  onInterventionChange,
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

      {stats && (
        <InterventionStats stats={stats} assemblyId={assemblyId} />
      )}
    </div>
  );
};

export default AssemblyDetails;
