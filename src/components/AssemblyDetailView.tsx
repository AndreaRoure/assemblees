
import React, { useState, useEffect } from 'react';
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
import { ArrowLeft } from 'lucide-react';

interface AssemblyDetailViewProps {
  assemblyId: string;
  onBack: () => void;
}

const AssemblyDetailView = ({ assemblyId, onBack }: AssemblyDetailViewProps) => {
  const [transcription, setTranscription] = React.useState<string>('');
  const [activeSections, setActiveSections] = useState({
    attendance: true,
    audio: false,
    quickIntervention: false,
    stats: false
  });
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

  useEffect(() => {
    // Progressive loading of sections
    const timers = [
      setTimeout(() => setActiveSections(prev => ({ ...prev, audio: true })), 300),
      setTimeout(() => setActiveSections(prev => ({ ...prev, quickIntervention: true })), 600),
      setTimeout(() => setActiveSections(prev => ({ ...prev, stats: true })), 900)
    ];
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const handleInterventionChange = () => {
    queryClient.invalidateQueries({ queryKey: ['interventions', assemblyId] });
    queryClient.invalidateQueries({ queryKey: ['assemblyStats', assemblyId] });
    
    // Add animation effect on change
    const statsElement = document.querySelector('.stats-container');
    if (statsElement) {
      statsElement.classList.add('pulse-animation');
      setTimeout(() => statsElement.classList.remove('pulse-animation'), 1000);
    }
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

      // Apply visual feedback
      const counterElement = document.querySelector(`.${type}-counter`);
      if (counterElement) {
        counterElement.classList.add(increment ? 'increment-animation' : 'decrement-animation');
        setTimeout(() => {
          counterElement.classList.remove(increment ? 'increment-animation' : 'decrement-animation');
        }, 500);
      }

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
    
    // Apply reveal animation
    setTimeout(() => {
      const transcriptionElement = document.querySelector('.transcription-container');
      if (transcriptionElement) {
        transcriptionElement.classList.add('reveal-animation');
      }
    }, 100);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center group"
      >
        <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Tornar a la llista
      </button>
      
      <div 
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-500 ${activeSections.attendance ? 'opacity-100' : 'opacity-0'}`}
      >
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

      <div className={`transition-opacity duration-500 ${activeSections.audio ? 'opacity-100' : 'opacity-0'}`}>
        <AudioRecorder 
          assemblyId={assemblyId}
          onTranscriptionComplete={handleTranscriptionComplete}
        />
      </div>

      {transcription && (
        <div className="transcription-container opacity-0 transform translate-y-4">
          <Transcriptions 
            transcription={transcription} 
            assemblyId={assemblyId}
            onTextEdit={setTranscription}
          />
        </div>
      )}

      <div className={`transition-opacity duration-500 ${activeSections.quickIntervention ? 'opacity-100' : 'opacity-0'}`}>
        <QuickIntervention
          assemblyId={assemblyId}
          onInterventionAdded={handleInterventionChange}
        />
      </div>
      
      <div className={`stats-container transition-opacity duration-500 ${activeSections.stats ? 'opacity-100' : 'opacity-0'}`}>
        {stats && <ResponsiveAssemblyStats stats={stats} />}
      </div>

      <div className={`transition-opacity duration-500 ${activeSections.stats ? 'opacity-100' : 'opacity-0'}`}>
        {stats && attendance && (
          <InterventionStats stats={stats} attendance={attendance} />
        )}
      </div>
    </div>
  );
};

export default AssemblyDetailView;
