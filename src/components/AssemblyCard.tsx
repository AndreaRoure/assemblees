
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
        className="p-3 md:p-4 hover:bg-gray-50 transition-all cursor-pointer"
        onClick={onClick}
      >
        <div className="space-y-2">
          <div className="text-xs md:text-sm text-muted-foreground">
            {format(new Date(assembly.date), 'PPP', { locale: ca })}
          </div>
          <h3 className="text-base md:text-lg font-semibold">{assembly.name}</h3>
          {assembly.description && (
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
              {assembly.description}
            </p>
          )}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 pt-2 border-t">
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <UserCircle2 className="h-4 w-4" />
              <span>Registrat per: {assembly.register.name}</span>
            </div>
            <div className="flex gap-1 md:gap-2 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEdit}
                className="h-7 w-7 md:h-8 md:w-8 p-0"
              >
                <Pencil className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="h-7 w-7 md:h-8 md:w-8 p-0"
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
