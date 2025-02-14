
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { addIntervention, removeIntervention } from '@/data/assemblies';

interface QuickInterventionProps {
  assemblyId: string;
  onInterventionAdded: () => void;
}

const QuickIntervention = ({ assemblyId, onInterventionAdded }: QuickInterventionProps) => {
  const handleAdd = (gender: 'man' | 'woman' | 'trans' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    addIntervention({ assemblyId, gender, type });
    onInterventionAdded();
  };

  const handleRemove = (gender: 'man' | 'woman' | 'trans' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    removeIntervention(assemblyId, type, gender);
    onInterventionAdded();
  };

  const renderInterventionButtons = (gender: 'man' | 'woman' | 'trans' | 'non-binary') => (
    <div className="grid gap-2">
      {['Intervenció', 'Dinamitza', 'Interrupció', 'Llarga', 'Explica', 'Ofensiva'].map((label, index) => {
        const type = ['intervencio', 'dinamitza', 'interrupcio', 'llarga', 'explica', 'ofensiva'][index] as 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica';
        return (
          <div key={type} className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAdd(gender, type)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              {label}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemove(gender, type)}
              className="flex-1"
            >
              <Minus className="h-4 w-4 mr-1" />
              {label}
            </Button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Home</h3>
        {renderInterventionButtons('man')}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Dona</h3>
        {renderInterventionButtons('woman')}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Trans</h3>
        {renderInterventionButtons('trans')}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">No binari</h3>
        {renderInterventionButtons('non-binary')}
      </div>
    </div>
  );
};

export default QuickIntervention;
