
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import AssemblyCard from '@/components/AssemblyCard';
import { fetchAssemblies } from '@/lib/supabase';

interface AssembliesTabContentProps {
  onAssemblySelected: (assemblyId: string) => void;
  onRefetch: () => void;
}

const AssembliesTabContent = ({ onAssemblySelected, onRefetch }: AssembliesTabContentProps) => {
  const { data: assemblies = [] } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies
  });

  return (
    <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
      <div className="space-y-3 md:space-y-4 pr-2">
        {assemblies.map((assembly) => (
          <AssemblyCard
            key={assembly.id}
            assembly={assembly}
            onClick={() => onAssemblySelected(assembly.id)}
            onEdited={onRefetch}
          />
        ))}
        {assemblies.length === 0 && (
          <div className="text-center text-muted-foreground py-6 md:py-8">
            No hi ha assemblees. Crea&apos;n una de nova!
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default AssembliesTabContent;
