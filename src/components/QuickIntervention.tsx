
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { addIntervention, removeIntervention } from '@/data/assemblies';

interface QuickInterventionProps {
  assemblyId: string;
  onInterventionAdded: () => void;
}

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const Counter = ({ value, onIncrement, onDecrement }: CounterProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={onDecrement}
      className="h-8 w-8 p-0"
      disabled={value === 0}
    >
      <Minus className="h-4 w-4" />
    </Button>
    <span className="min-w-[2rem] text-center">{value}</span>
    <Button
      variant="outline"
      size="sm"
      onClick={onIncrement}
      className="h-8 w-8 p-0"
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
);

const QuickIntervention = ({ assemblyId, onInterventionAdded }: QuickInterventionProps) => {
  const [counts, setCounts] = useState<Record<string, Record<string, number>>>({
    man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    trans: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    'non-binary': { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 }
  });

  const handleIncrement = (gender: 'man' | 'woman' | 'trans' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    addIntervention({ assemblyId, gender, type });
    setCounts(prev => ({
      ...prev,
      [gender]: {
        ...prev[gender],
        [type]: prev[gender][type] + 1
      }
    }));
    onInterventionAdded();
  };

  const handleDecrement = (gender: 'man' | 'woman' | 'trans' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    if (counts[gender][type] > 0) {
      removeIntervention(assemblyId, type, gender);
      setCounts(prev => ({
        ...prev,
        [gender]: {
          ...prev[gender],
          [type]: prev[gender][type] - 1
        }
      }));
      onInterventionAdded();
    }
  };

  const renderInterventionCounters = (gender: 'man' | 'woman' | 'trans' | 'non-binary') => (
    <div className="grid gap-3">
      {['Intervenció', 'Dinamitza', 'Interrupció', 'Llarga', 'Explica', 'Ofensiva'].map((label, index) => {
        const type = ['intervencio', 'dinamitza', 'interrupcio', 'llarga', 'explica', 'ofensiva'][index] as 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica';
        return (
          <div key={type} className="flex items-center justify-between">
            <span className="text-sm">{label}</span>
            <Counter
              value={counts[gender][type]}
              onIncrement={() => handleIncrement(gender, type)}
              onDecrement={() => handleDecrement(gender, type)}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Home</h3>
        {renderInterventionCounters('man')}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Dona</h3>
        {renderInterventionCounters('woman')}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Trans</h3>
        {renderInterventionCounters('trans')}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">No binari</h3>
        {renderInterventionCounters('non-binary')}
      </div>
    </div>
  );
};

export default QuickIntervention;
