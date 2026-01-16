
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
  totalSociasCount?: number;
  onAssemblySelected: (assemblyId: string) => void;
  onAssemblyEdited: () => void;
  onAssemblyCreated: () => void;
}

const MainTabs = ({ 
  assemblies, 
  totalAssembliesCount,
  totalSociasCount, 
  onAssemblySelected, 
  onAssemblyEdited,
  onAssemblyCreated 
}: MainTabsProps) => {
  return (
    <Tabs defaultValue="assemblies" className="w-full">
      <div className="sticky top-0 z-20 bg-[hsl(var(--lavender-bg))] pb-2 md:pb-4 px-2 md:px-0">
        <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="assemblies">
          Assemblees
          {totalAssembliesCount !== undefined && (
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
              {totalAssembliesCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="socias">
          Sòcies
          {totalSociasCount !== undefined && (
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
              {totalSociasCount}
            </Badge>
          )}
        </TabsTrigger>
          <TabsTrigger value="registers">Registres</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="assemblies" className="animate-fade-in">
        <AssemblyList 
          assemblies={assemblies}
          onAssemblySelected={onAssemblySelected}
          onAssemblyEdited={onAssemblyEdited}
          onAssemblyCreated={onAssemblyCreated}
        />
      </TabsContent>

      <TabsContent value="socias" className="animate-fade-in">
        <SociasList />
      </TabsContent>

      <TabsContent value="registers" className="animate-fade-in">
        <RegistersList />
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
