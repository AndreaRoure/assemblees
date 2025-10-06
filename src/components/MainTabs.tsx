
import React from 'react';
import { Assembly } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import AssemblyList from '@/components/AssemblyList';
import RegistersList from '@/components/RegistersList';
import { SociasList } from '@/components/SociasList';

interface MainTabsProps {
  assemblies: Assembly[];
  totalAssembliesCount?: number;
  onAssemblySelected: (assemblyId: string) => void;
  onAssemblyEdited: () => void;
  onAssemblyCreated: () => void;
}

const MainTabs = ({ 
  assemblies, 
  totalAssembliesCount, 
  onAssemblySelected, 
  onAssemblyEdited,
  onAssemblyCreated 
}: MainTabsProps) => {
  return (
    <Tabs defaultValue="assemblies" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
        <TabsTrigger value="assemblies">
          Assemblees
          {totalAssembliesCount !== undefined && (
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
              {totalAssembliesCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="socias">Sòcies</TabsTrigger>
        <TabsTrigger value="registers">Registres</TabsTrigger>
      </TabsList>
      
      <TabsContent value="assemblies" className="animate-fade-in">
        <AssemblyList 
          assemblies={assemblies}
          onAssemblySelected={onAssemblySelected}
          onAssemblyEdited={onAssemblyEdited}
          onAssemblyCreated={onAssemblyCreated}
        />
      </TabsContent>

      <TabsContent value="socias" className="animate-fade-in">
        <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
          <SociasList />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="registers" className="animate-fade-in">
        <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
          <RegistersList />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
