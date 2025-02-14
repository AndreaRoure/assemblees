
import React from 'react';
import { Assembly } from '@/types';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { UserCircle2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAssembly } from '@/data/assemblies';

interface AssemblyCardProps {
  assembly: Assembly;
  onClick: () => void;
  onEdited: () => void;
}

const AssemblyCard = ({ assembly, onClick, onEdited }: AssemblyCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Estàs segur que vols eliminar aquesta assemblea?')) {
      deleteAssembly(assembly.id);
      onEdited();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // We'll implement edit functionality in the next iteration
    console.log('Edit assembly:', assembly.id);
  };

  return (
    <Card
      className="p-4 hover:bg-gray-50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="text-sm text-muted-foreground">
            {format(new Date(assembly.date), 'PPP', { locale: ca })}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h3 className="text-lg font-semibold">{assembly.name}</h3>
        {assembly.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {assembly.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
          <UserCircle2 className="h-4 w-4" />
          <span>Registrat per: {assembly.register.name}</span>
        </div>
      </div>
    </Card>
  );
};

export default AssemblyCard;
