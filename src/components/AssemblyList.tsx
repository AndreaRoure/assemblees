
import React from 'react';
import { Assembly } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AssemblyCard from '@/components/AssemblyCard';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';

interface AssemblyListProps {
  assemblies: Assembly[];
  onAssemblySelected: (assemblyId: string) => void;
  onAssemblyEdited: () => void;
  onAssemblyCreated: () => void;
}

const AssemblyList = ({ assemblies, onAssemblySelected, onAssemblyEdited, onAssemblyCreated }: AssemblyListProps) => {
  const [showNewDialog, setShowNewDialog] = React.useState(false);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between md:justify-end items-center">
        <h2 className="text-2xl font-bold md:hidden">Assemblees</h2>
        <Button onClick={() => setShowNewDialog(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nova Assemblea</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)] md:h-[calc(100vh-330px)]">
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

      <NewAssemblyDialog 
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onAssemblyCreated={() => {
          onAssemblyCreated();
          setShowNewDialog(false);
        }}
      />
    </div>
  );
};

export default AssemblyList;
