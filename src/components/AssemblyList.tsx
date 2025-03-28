
import React from 'react';
import { Assembly } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import AssemblyCard from '@/components/AssemblyCard';

interface AssemblyListProps {
  assemblies: Assembly[];
  onAssemblySelected: (assemblyId: string) => void;
  onAssemblyEdited: () => void;
}

const AssemblyList = ({ assemblies, onAssemblySelected, onAssemblyEdited }: AssemblyListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
      <div className="space-y-3 md:space-y-4 pr-2">
        {assemblies.map((assembly) => (
          <AssemblyCard
            key={assembly.id}
            assembly={assembly}
            onClick={() => onAssemblySelected(assembly.id)}
            onEdited={onAssemblyEdited}
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

export default AssemblyList;
