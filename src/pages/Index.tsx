
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';
import AssemblyCard from '@/components/AssemblyCard';
import QuickIntervention from '@/components/QuickIntervention';
import ResponsiveAssemblyStats from '@/components/ResponsiveAssemblyStats';
import RegistersList from '@/components/RegistersList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';
import { 
  fetchAssemblies, 
  fetchAssemblyInterventions, 
  fetchAssemblyAttendance,
  updateAssemblyAttendance 
} from '@/lib/supabase';
import { getAssemblyStats } from '@/data/assemblies';
import { supabase } from '@/lib/supabase';
import AttendanceCounter from '@/components/AttendanceCounter';
import InterventionStats from '@/components/InterventionStats';

const Index = () => {
  const [selectedAssembly, setSelectedAssembly] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

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

    return () => {
      supabase.removeChannel(assemblyChannel);
      supabase.removeChannel(interventionsChannel);
    };
  }, [queryClient, selectedAssembly]);

  const { data: assemblies = [], refetch: refetchAssemblies } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies
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
    enabled: !!selectedAssembly,
    initialData: selectedAssembly ? {
      assembly_id: selectedAssembly,
      female_count: 0,
      male_count: 0,
      non_binary_count: 0
    } : null
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

    const newCount = increment 
      ? (attendance[type] || 0) + 1 
      : Math.max(0, (attendance[type] || 0) - 1);

    await updateAssemblyAttendance(selectedAssembly, {
      [type]: newCount
    });
    refetchAttendance();
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
          <div className="space-y-4 md:space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedAssembly(null)}
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

            <QuickIntervention
              assemblyId={selectedAssembly}
              onInterventionAdded={handleInterventionChange}
            />
            
            {stats && <ResponsiveAssemblyStats stats={stats} />}

            {stats && attendance && (
              <InterventionStats stats={stats} attendance={attendance} />
            )}
          </div>
        ) : (
          <Tabs defaultValue="assemblies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
              <TabsTrigger value="assemblies">Assemblees</TabsTrigger>
              <TabsTrigger value="registers">Registres</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assemblies" className="animate-fade-in">
              <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
                <div className="space-y-3 md:space-y-4 pr-2">
                  {assemblies.map((assembly) => (
                    <AssemblyCard
                      key={assembly.id}
                      assembly={assembly}
                      onClick={() => setSelectedAssembly(assembly.id)}
                      onEdited={refetchAssemblies}
                    />
                  ))}
                  {assemblies.length === 0 && (
                    <div className="text-center text-muted-foreground py-6 md:py-8">
                      No hi ha assemblees. Crea&apos;n una de nova!
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="registers" className="animate-fade-in">
              <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
                <RegistersList />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
