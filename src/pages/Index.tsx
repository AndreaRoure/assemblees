
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
    <div className="min-h-screen w-full bg-background">
      <div className="container px-4 py-4 mx-auto md:py-6 md:px-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Logo />
            <h1 className="text-xl font-bold text-center md:text-2xl">
              Observació d&apos;Assemblees
            </h1>
            <div className="grid w-full grid-cols-1 gap-3 md:flex md:flex-row md:gap-4 md:w-auto">
              <NewAssemblyDialog onAssemblyCreated={refetchAssemblies} />
              <AttendanceDialog />
            </div>
          </div>

          {selectedAssembly ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedAssembly(null)}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
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
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="assemblies" className="text-sm">
                  Assemblees
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-sm">
                  Registres i Assistències
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="assemblies">
                <ScrollArea className="h-[calc(100vh-240px)] md:h-[calc(100vh-250px)]">
                  <div className="space-y-3 pr-2 md:space-y-4">
                    {assemblies.map((assembly) => (
                      <AssemblyCard
                        key={assembly.id}
                        assembly={assembly}
                        onClick={() => setSelectedAssembly(assembly.id)}
                        onEdited={refetchAssemblies}
                      />
                    ))}
                    {assemblies.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">
                        No hi ha assemblees. Crea&apos;n una de nova!
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="stats">
                <ScrollArea className="h-[calc(100vh-240px)] md:h-[calc(100vh-250px)]">
                  <div className="pb-6 space-y-6">
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
    </div>
  );
};

export default Index;
