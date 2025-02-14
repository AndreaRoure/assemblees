
import React, { useState } from 'react';
import { Assembly } from '@/types';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { UserCircle2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAssembly } from '@/lib/supabase';
import EditAssemblyDialog from './EditAssemblyDialog';

interface AssemblyCardProps {
  assembly: Assembly;
  onClick: () => void;
  onEdited: () => void;
}

const AssemblyCard = ({ assembly, onClick, onEdited }: AssemblyCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Estàs segur que vols eliminar aquesta assemblea?')) {
      await deleteAssembly(assembly.id);
      onEdited();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditDialog(true);
  };

  return (
    <>
      <Card
        className="p-3 hover:bg-gray-50 transition-all cursor-pointer md:p-4"
        onClick={onClick}
      >
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground md:text-sm">
            {format(new Date(assembly.date), 'PPP', { locale: ca })}
          </div>
          <h3 className="text-base font-semibold md:text-lg">{assembly.name}</h3>
          {assembly.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 md:text-sm">
              {assembly.description}
            </p>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t md:flex-row md:items-center md:justify-between md:gap-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
              <UserCircle2 className="h-4 w-4" />
              <span>Registrat per: {assembly.register.name}</span>
            </div>
            <div className="flex gap-1 justify-end md:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEdit}
                className="h-7 w-7 p-0 md:h-8 md:w-8"
              >
                <Pencil className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="h-7 w-7 p-0 md:h-8 md:w-8"
              >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <EditAssemblyDialog
        assembly={assembly}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onAssemblyEdited={onEdited}
      />
    </>
  );
};

export default AssemblyCard;
