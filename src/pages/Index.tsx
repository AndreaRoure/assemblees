
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';
import AttendanceDialog from '@/components/AttendanceDialog';
import AssemblyCard from '@/components/AssemblyCard';
import QuickIntervention from '@/components/QuickIntervention';
import AssemblyStats from '@/components/AssemblyStats';
import RegistersList from '@/components/RegistersList';
import AttendanceList from '@/components/AttendanceList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';
import { fetchAssemblies, fetchAssemblyInterventions } from '@/lib/supabase';
import { getAssemblyStats } from '@/data/assemblies';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [selectedAssembly, setSelectedAssembly] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Subscribe to real-time changes
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

  const handleInterventionChange = () => {
    if (selectedAssembly) {
      queryClient.invalidateQueries({ queryKey: ['interventions', selectedAssembly] });
      queryClient.invalidateQueries({ queryKey: ['assemblyStats', selectedAssembly] });
    }
  };

  return (
    <div className="container p-4 md:py-6 mx-auto">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col items-center">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            Observació d&apos;Assembleas
          </h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
            <NewAssemblyDialog onAssemblyCreated={refetchAssemblies} />
            <AttendanceDialog />
          </div>
        </div>

        {selectedAssembly ? (
          <div className="space-y-4 md:space-y-6">
            <button
              onClick={() => setSelectedAssembly(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Tornar a la llista
            </button>
            
            <QuickIntervention
              assemblyId={selectedAssembly}
              onInterventionAdded={handleInterventionChange}
            />
            
            {stats && <AssemblyStats stats={stats} />}
          </div>
        ) : (
          <Tabs defaultValue="assemblies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
              <TabsTrigger value="assemblies" className="text-sm md:text-base">Assemblees</TabsTrigger>
              <TabsTrigger value="stats" className="text-sm md:text-base">Registres i Assistències</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assemblies">
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

            <TabsContent value="stats" className="w-full">
              <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
                <div className="space-y-6">
                  <RegistersList />
                  <div className="h-px bg-border" />
                  <AttendanceList />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
