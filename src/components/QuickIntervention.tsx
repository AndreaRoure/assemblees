
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRound, UserCircle2 } from 'lucide-react';
import { addIntervention } from '@/data/assemblies';

interface QuickInterventionProps {
  assemblyId: string;
  onInterventionAdded: () => void;
}

const QuickIntervention = ({ assemblyId, onInterventionAdded }: QuickInterventionProps) => {
  const handleIntervention = (gender: 'man' | 'woman', type: 'short' | 'long' | 'interruption' | 'question') => {
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
            onClick={() => handleIntervention('man', 'short')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Breu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'long')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Llarg
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'interruption')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Interrupció
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('man', 'question')}
            className="w-full"
          >
            <UserRound className="h-4 w-4 mr-1" />
            Pregunta
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Dona</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'short')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Breu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'long')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Llarg
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'interruption')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Interrupció
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIntervention('woman', 'question')}
            className="w-full"
          >
            <UserCircle2 className="h-4 w-4 mr-1" />
            Pregunta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickIntervention;
