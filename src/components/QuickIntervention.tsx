
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRound, UserCircle2 } from 'lucide-react';
import { addIntervention } from '@/data/assemblies';

interface QuickInterventionProps {
  assemblyId: string;
  onInterventionAdded: () => void;
}

const QuickIntervention = ({ assemblyId, onInterventionAdded }: QuickInterventionProps) => {
  const handleIntervention = (gender: 'man' | 'woman', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva') => {
    addIntervention({ assemblyId, gender, type });
    onInterventionAdded();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Home</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'intervencio')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Intervenció
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'dinamitza')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Dinamitza
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'interrupcio')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Interrupció
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'llarga')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Llarga
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'ofensiva')}
            className="w-full col-span-2"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Ofensiva
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Dona</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'intervencio')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Intervenció
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'dinamitza')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Dinamitza
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'interrupcio')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Interrupció
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'llarga')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Llarga
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'ofensiva')}
            className="w-full col-span-2"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Ofensiva
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickIntervention;
