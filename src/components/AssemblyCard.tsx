
import React from 'react';
import { Assembly } from '@/types';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { UserCircle2 } from 'lucide-react';

interface AssemblyCardProps {
  assembly: Assembly;
  onClick: () => void;
}

const AssemblyCard = ({ assembly, onClick }: AssemblyCardProps) => {
  return (
    <Card
      className="p-4 hover:bg-gray-50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          {format(new Date(assembly.date), 'PPP', { locale: ca })}
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
