
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAssemblyInterventions, fetchAssemblyAttendance, updateAssemblyAttendance } from '@/lib/supabase';
import { getAssemblyStats } from '@/data/assemblies';
import QuickIntervention from '@/components/QuickIntervention';
import AttendanceCounter from '@/components/AttendanceCounter';
import ResponsiveAssemblyStats from '@/components/ResponsiveAssemblyStats';
import InterventionStats from '@/components/InterventionStats';
import AudioRecorder from '@/components/AudioRecorder';
import Transcriptions from '@/components/Transcriptions';
import { toast } from 'sonner';

interface AssemblyDetailViewProps {
  assemblyId: string;
  onBack: () => void;
}

const AssemblyDetailView = ({ assemblyId, onBack }: AssemblyDetailViewProps) => {
  const [transcription, setTranscription] = React.useState<string>('');
  const queryClient = useQueryClient();

  const { data: interventions = [] } = useQuery({
    queryKey: ['interventions', assemblyId],
    queryFn: () => fetchAssemblyInterventions(assemblyId),
    enabled: !!assemblyId
  });

  const { data: stats } = useQuery({
    queryKey: ['assemblyStats', assemblyId],
    queryFn: () => getAssemblyStats(assemblyId),
    enabled: !!assemblyId
  });

  const { data: attendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance', assemblyId],
    queryFn: () => fetchAssemblyAttendance(assemblyId),
    enabled: !!assemblyId
  });

  const handleInterventionChange = () => {
    queryClient.invalidateQueries({ queryKey: ['interventions', assemblyId] });
    queryClient.invalidateQueries({ queryKey: ['assemblyStats', assemblyId] });
  };

  const handleUpdateAttendance = async (
    type: 'female_count' | 'male_count' | 'non_binary_count',
    increment: boolean
  ) => {
    if (!assemblyId || !attendance) return;

    try {
      const newCount = increment 
        ? (attendance[type] || 0) + 1 
        : Math.max(0, (attendance[type] || 0) - 1);
      
      const updatedAttendance = {
        ...attendance,
        [type]: newCount
      };

      // Update local state immediately for responsive UI
      queryClient.setQueryData(['attendance', assemblyId], updatedAttendance);
      
      // Send update to database
      await updateAssemblyAttendance(assemblyId, {
        [type]: newCount
      });
      
      // Refetch to ensure data consistency
      refetchAttendance();
      
      console.log(`Updated ${type} to ${newCount}`);
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('No s\'ha pogut actualitzar l\'assistència. Intenta-ho de nou.');
      
      // Revert optimistic update on error
      refetchAttendance();
    }
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Tornar a la llista
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AttendanceCounter
          label="Dones assistents"
          count={attendance?.female_count || 0}
          onIncrement={() => handleUpdateAttendance('female_count', true)}
          onDecrement={() => handleUpdateAttendance('female_count', false)}
        />
        <AttendanceCounter
          label="Homes assistents"
          count={attendance?.male_count || 0}
          onIncrement={() => handleUpdateAttendance('male_count', true)}
          onDecrement={() => handleUpdateAttendance('male_count', false)}
        />
        <AttendanceCounter
          label="No binàries assistents"
          count={attendance?.non_binary_count || 0}
          onIncrement={() => handleUpdateAttendance('non_binary_count', true)}
          onDecrement={() => handleUpdateAttendance('non_binary_count', false)}
        />
      </div>

      <AudioRecorder 
        assemblyId={assemblyId}
        onTranscriptionComplete={handleTranscriptionComplete}
      />

      {transcription && <Transcriptions 
        transcription={transcription} 
        assemblyId={assemblyId}
        onTextEdit={setTranscription}
      />}

      <QuickIntervention
        assemblyId={assemblyId}
        onInterventionAdded={handleInterventionChange}
      />
      
      {stats && <ResponsiveAssemblyStats stats={stats} />}

      {stats && attendance && (
        <InterventionStats stats={stats} attendance={attendance} />
      )}
    </div>
  );
};

export default AssemblyDetailView;
