
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  fetchAssemblies, 
  fetchAssemblyInterventions
} from '@/lib/supabase';
import { getAssemblyStats, getTotalAssembliesCount } from '@/data/assemblies';
import { getTotalSociasCount } from '@/lib/supabase-socias';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MainTabs from '@/components/MainTabs';
import AssemblyDetails from '@/components/AssemblyDetails';

const Index = () => {
  const [selectedAssembly, setSelectedAssembly] = React.useState<string | null>(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Setup realtime subscriptions - MUST be called before any conditional returns
  React.useEffect(() => {
    if (!user) return; // Guard clause to avoid subscription when not authenticated

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

    const asistenciasChannel = supabase
      .channel('asistencias-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'asistencias' }, () => {
        queryClient.invalidateQueries({ queryKey: ['asistencias', selectedAssembly] });
        queryClient.invalidateQueries({ queryKey: ['sociasWithStats'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(assemblyChannel);
      supabase.removeChannel(interventionsChannel);
      supabase.removeChannel(asistenciasChannel);
    };
  }, [queryClient, selectedAssembly, user]);

  // Fetch data - ALL hooks must be called before conditional returns
  const { data: assemblies = [], refetch: refetchAssemblies } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies,
    enabled: !!user
  });

  const { data: totalAssembliesCount } = useQuery({
    queryKey: ['totalAssembliesCount'],
    queryFn: getTotalAssembliesCount,
    enabled: !!user
  });

  const { data: totalSociasCount } = useQuery({
    queryKey: ['totalSociasCount'],
    queryFn: getTotalSociasCount,
    enabled: !!user
  });

  const { data: interventions = [] } = useQuery({
    queryKey: ['interventions', selectedAssembly],
    queryFn: () => selectedAssembly ? fetchAssemblyInterventions(selectedAssembly) : Promise.resolve([]),
    enabled: !!selectedAssembly && !!user
  });

  const { data: stats } = useQuery({
    queryKey: ['assemblyStats', selectedAssembly],
    queryFn: () => selectedAssembly ? getAssemblyStats(selectedAssembly) : Promise.resolve(null),
    enabled: !!selectedAssembly && !!user
  });


  // Redirect to auth if not authenticated - AFTER all hooks are called
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // NOW we can safely do conditional returns since ALL hooks have been called
  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregant...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const handleInterventionChange = () => {
    if (selectedAssembly) {
      queryClient.invalidateQueries({ queryKey: ['interventions', selectedAssembly] });
      queryClient.invalidateQueries({ queryKey: ['assemblyStats', selectedAssembly] });
    }
  };


  return (
    <div className="min-h-screen bg-[hsl(var(--lavender-bg))]">
      <div className="container px-0 md:px-4 py-2 md:py-6 mx-auto">
      <div className="space-y-3 md:space-y-6">
        <div className="flex flex-col items-center relative px-4">
          <div className="absolute top-0 right-2 md:right-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Sortir</span>
            </Button>
          </div>
          <Logo />
          <h1 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Observatori d&apos;Assemblees
          </h1>
        </div>

        {selectedAssembly ? (
          <AssemblyDetails 
            assemblyId={selectedAssembly}
            stats={stats}
            onInterventionChange={handleInterventionChange}
            onBackClick={() => setSelectedAssembly(null)}
          />
        ) : (
          <MainTabs 
            assemblies={assemblies}
            totalAssembliesCount={totalAssembliesCount}
            totalSociasCount={totalSociasCount}
            onAssemblySelected={setSelectedAssembly}
            onAssemblyEdited={refetchAssemblies}
            onAssemblyCreated={refetchAssemblies}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default Index;
