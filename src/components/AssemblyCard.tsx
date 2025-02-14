
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
        className="relative p-3 md:p-4 bg-gradient-to-br from-white to-gray-50/50 hover:from-purple-50/80 hover:to-purple-100/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in group border border-gray-100 hover:border-purple-200"
        onClick={onClick}
      >
        <div className="space-y-2">
          <div className="text-xs md:text-sm text-muted-foreground">
            {format(new Date(assembly.date), 'PPP', { locale: ca })}
          </div>
          <h3 className="text-base md:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {assembly.name}
          </h3>
          {assembly.description && (
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
              {assembly.description}
            </p>
          )}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <UserCircle2 className="h-4 w-4" />
              <span>Registrat per: {assembly.register.name}</span>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEdit} 
                className="h-6 w-6 md:h-8 md:w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-purple-200/70 hover:text-purple-700 transition-all duration-200"
              >
                <Pencil className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete} 
                className="h-6 w-6 md:h-8 md:w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-200/70 hover:text-red-700 transition-all duration-200"
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
