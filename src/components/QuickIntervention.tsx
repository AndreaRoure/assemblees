
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { addIntervention, removeIntervention } from '@/lib/supabase';
import { interventions } from '@/data/assemblies';

interface QuickInterventionProps {
  assemblyId: string;
  onInterventionAdded: () => void;
}

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
}

const Counter = ({ value, onIncrement, onDecrement, label }: CounterProps) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-sm text-muted-foreground flex-1">{label}</span>
    <div className="flex items-center h-8 rounded-md border border-input bg-transparent">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecrement}
        className="h-full px-2 rounded-none border-r hover:bg-muted"
        disabled={value === 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="px-3 text-sm tabular-nums">{value}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrement}
        className="h-full px-2 rounded-none border-l hover:bg-muted"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

const QuickIntervention = ({ assemblyId, onInterventionAdded }: QuickInterventionProps) => {
  const [counts, setCounts] = useState<Record<string, Record<string, number>>>({
    man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    trans: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    'non-binary': { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 }
  });

  // Load existing interventions when component mounts or assemblyId changes
  useEffect(() => {
    const assemblyInterventions = interventions.filter(i => i.assembly_id === assemblyId);
    const newCounts = {
      man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
      woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
      trans: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
      'non-binary': { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 }
    };

    // Count existing interventions
    assemblyInterventions.forEach(intervention => {
      const { gender, type } = intervention;
      if (newCounts[gender] && type in newCounts[gender]) {
        newCounts[gender][type]++;
      }
    });

    setCounts(newCounts);
  }, [assemblyId]);

  const handleIncrement = async (gender: 'man' | 'woman' | 'trans' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    await addIntervention({
      assembly_id: assemblyId,
      gender,
      type
    });
    setCounts(prev => ({
      ...prev,
      [gender]: {
        ...prev[gender],
        [type]: prev[gender][type] + 1
      }
    }));
    onInterventionAdded();
  };

  const handleDecrement = async (gender: 'man' | 'woman' | 'trans' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    if (counts[gender][type] > 0) {
      await removeIntervention(assemblyId, type, gender);
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
    <div className="space-y-2">
      {[
        'Dinamitza',
        'Explica',
        'Interrupció',
        'Intervenció curta',
        'Intervenció llarga',
        'Ofensiva'
      ].map((label, index) => {
        const typeMap = [
          'dinamitza',
          'explica',
          'interrupcio',
          'intervencio',
          'llarga',
          'ofensiva'
        ] as const;
        return (
          <Counter
            key={typeMap[index]}
            label={label}
            value={counts[gender][typeMap[index]]}
            onIncrement={() => handleIncrement(gender, typeMap[index])}
            onDecrement={() => handleDecrement(gender, typeMap[index])}
          />
        );
      })}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Dona</h3>
        {renderInterventionCounters('woman')}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Home</h3>
        {renderInterventionCounters('man')}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">No binari</h3>
        {renderInterventionCounters('non-binary')}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Trans</h3>
        {renderInterventionCounters('trans')}
      </div>
    </div>
  );
};

export default QuickIntervention;
