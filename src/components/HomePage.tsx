
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';
import AssembliesTabContent from '@/components/AssembliesTabContent';
import RegistersList from '@/components/RegistersList';
import AssemblyDetailView from '@/components/AssemblyDetailView';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const HomePage = () => {
  const [selectedAssembly, setSelectedAssembly] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { language } = useLanguage();

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

  const handleRefetchAssemblies = () => {
    queryClient.invalidateQueries({ queryKey: ['assemblies'] });
  };

  // Pass the current language to the components that need it for data operations
  React.useEffect(() => {
    // When language changes, we might need to refetch data
    // This is especially important for components that display text content
    if (selectedAssembly) {
      queryClient.invalidateQueries({ queryKey: ['interventions', selectedAssembly] });
    }
  }, [language, queryClient, selectedAssembly]);

  return (
    <div className="container p-4 md:py-6 mx-auto">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-end mb-2">
            <LanguageSelector />
          </div>
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Observació d&apos;Assemblees
          </h1>
          <NewAssemblyDialog onAssemblyCreated={handleRefetchAssemblies} />
        </div>

        {selectedAssembly ? (
          <AssemblyDetailView 
            assemblyId={selectedAssembly} 
            onBack={() => setSelectedAssembly(null)} 
          />
        ) : (
          <Tabs defaultValue="assemblies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
              <TabsTrigger value="assemblies">Assemblees</TabsTrigger>
              <TabsTrigger value="registers">Registres</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assemblies" className="animate-fade-in">
              <AssembliesTabContent 
                onAssemblySelected={setSelectedAssembly}
                onRefetch={handleRefetchAssemblies}
              />
            </TabsContent>

            <TabsContent value="registers" className="animate-fade-in">
              <RegistersList />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default HomePage;
