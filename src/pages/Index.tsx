
import React from 'react';
import { assemblies, getAssemblyStats } from '@/data/assemblies';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';
import AssemblyCard from '@/components/AssemblyCard';
import QuickIntervention from '@/components/QuickIntervention';
import AssemblyStats from '@/components/AssemblyStats';
import RegistersList from '@/components/RegistersList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [selectedAssembly, setSelectedAssembly] = React.useState<string | null>(null);
  const [, forceUpdate] = React.useState({});

  const refresh = () => forceUpdate({});

  const stats = selectedAssembly ? getAssemblyStats(selectedAssembly) : null;

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-6">Taula d&apos;Observació de Dinàmiques en Assemblees</h1>
          <NewAssemblyDialog onAssemblyCreated={refresh} />
        </div>

        {selectedAssembly ? (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedAssembly(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Tornar a la llista
            </button>
            
            <QuickIntervention
              assemblyId={selectedAssembly}
              onInterventionAdded={refresh}
            />
            
            {stats && <AssemblyStats stats={stats} />}
          </div>
        ) : (
          <Tabs defaultValue="assemblies">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="assemblies">Assemblees</TabsTrigger>
              <TabsTrigger value="registers">Registres</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assemblies">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-4">
                  {assemblies.map((assembly) => (
                    <AssemblyCard
                      key={assembly.id}
                      assembly={assembly}
                      onClick={() => setSelectedAssembly(assembly.id)}
                      onEdited={refresh}
                    />
                  ))}
                  {assemblies.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No hi ha assemblees. Crea&apos;n una de nova!
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="registers">
              <ScrollArea className="h-[calc(100vh-250px)]">
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
