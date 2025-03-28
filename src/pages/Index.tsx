
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  fetchAssemblies, 
  fetchAssemblyInterventions, 
  fetchAssemblyAttendance,
  updateAssemblyAttendance 
} from '@/lib/supabase';
import { getAssemblyStats, getTotalAssembliesCount } from '@/data/assemblies';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import MainTabs from '@/components/MainTabs';
import AssemblyDetails from '@/components/AssemblyDetails';

const Index = () => {
  const [selectedAssembly, setSelectedAssembly] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Setup realtime subscriptions
  React.useEffect(() => {
    const assemblyChannel = supabase
      .channel('assemblies-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assemblies' }, () => {
        queryClient.invalidateQueries({ queryKey: ['assemblies'] });
      })
      .subscribe();

    const interventionsChannel = supabase
      .channel('interventions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interventions' }, () => {
        if (selectedAssembly) {
          queryClient.invalidateQueries({ queryKey: ['interventions', selectedAssembly] });
          queryClient.invalidateQueries({ queryKey: ['assemblyStats', selectedAssembly] });
        }
      })
      .subscribe();

    const attendanceChannel = supabase
      .channel('attendance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assembly_attendance' }, () => {
        if (selectedAssembly) {
          queryClient.invalidateQueries({ queryKey: ['attendance', selectedAssembly] });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(assemblyChannel);
      supabase.removeChannel(interventionsChannel);
      supabase.removeChannel(attendanceChannel);
    };
  }, [queryClient, selectedAssembly]);

  // Fetch data
  const { data: assemblies = [], refetch: refetchAssemblies } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies
  });

  const { data: totalAssembliesCount } = useQuery({
    queryKey: ['totalAssembliesCount'],
    queryFn: getTotalAssembliesCount
  });

  const { data: interventions = [] } = useQuery({
    queryKey: ['interventions', selectedAssembly],
    queryFn: () => selectedAssembly ? fetchAssemblyInterventions(selectedAssembly) : Promise.resolve([]),
    enabled: !!selectedAssembly
  });

  const { data: stats } = useQuery({
    queryKey: ['assemblyStats', selectedAssembly],
    queryFn: () => selectedAssembly ? getAssemblyStats(selectedAssembly) : Promise.resolve(null),
    enabled: !!selectedAssembly
  });

  const { data: attendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance', selectedAssembly],
    queryFn: () => selectedAssembly ? fetchAssemblyAttendance(selectedAssembly) : Promise.resolve(null),
    enabled: !!selectedAssembly
  });

  const handleInterventionChange = () => {
    if (selectedAssembly) {
      queryClient.invalidateQueries({ queryKey: ['interventions', selectedAssembly] });
      queryClient.invalidateQueries({ queryKey: ['assemblyStats', selectedAssembly] });
    }
  };

  const handleUpdateAttendance = async (
    type: 'female_count' | 'male_count' | 'non_binary_count',
    increment: boolean
  ) => {
    if (!selectedAssembly || !attendance) return;

    try {
      const newCount = increment 
        ? (attendance[type] || 0) + 1 
        : Math.max(0, (attendance[type] || 0) - 1);
      
      const updatedAttendance = {
        ...attendance,
        [type]: newCount
      };

      // Update local state immediately for responsive UI
      queryClient.setQueryData(['attendance', selectedAssembly], updatedAttendance);
      
      // Send update to database
      await updateAssemblyAttendance(selectedAssembly, {
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

  return (
    <div className="container p-4 md:py-6 mx-auto">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col items-center">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Observació d&apos;Assemblees
          </h1>
          <NewAssemblyDialog onAssemblyCreated={refetchAssemblies} />
        </div>

        {selectedAssembly ? (
          <AssemblyDetails 
            assemblyId={selectedAssembly}
            stats={stats}
            attendance={attendance}
            onInterventionChange={handleInterventionChange}
            onAttendanceUpdate={handleUpdateAttendance}
            onBackClick={() => setSelectedAssembly(null)}
          />
        ) : (
          <MainTabs 
            assemblies={assemblies}
            totalAssembliesCount={totalAssembliesCount}
            onAssemblySelected={setSelectedAssembly}
            onAssemblyEdited={refetchAssemblies}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
