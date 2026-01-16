import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { addIntervention, removeIntervention, fetchAssemblyInterventions } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

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
        className="h-full px-2 rounded-none border-r hover:bg-red-50 transition-colors"
        disabled={value === 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="px-3 text-sm tabular-nums font-medium">{value}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrement}
        className="h-full px-2 rounded-none border-l hover:bg-green-50 transition-colors"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

const QuickIntervention = ({ assemblyId, onInterventionAdded }: { assemblyId: string, onInterventionAdded: () => void }) => {
  const { data: interventions = [] } = useQuery({
    queryKey: ['interventions', assemblyId],
    queryFn: () => fetchAssemblyInterventions(assemblyId),
  });

  const [counts, setCounts] = useState<Record<string, Record<string, number>>>({
    man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 }
  });

  useEffect(() => {
    const newCounts = {
      man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
      woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 }
    };

    interventions.forEach(intervention => {
      const { gender, type } = intervention;
      if (newCounts[gender] && type in newCounts[gender]) {
        newCounts[gender][type]++;
      }
    });

    setCounts(newCounts);
  }, [interventions]);

  const handleIncrement = async (gender: 'man' | 'woman', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    await addIntervention({
      assembly_id: assemblyId,
      gender,
      type
    });
    onInterventionAdded();
  };

  const handleDecrement = async (gender: 'man' | 'woman', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    if (counts[gender][type] > 0) {
      await removeIntervention(assemblyId, type, gender);
      onInterventionAdded();
    }
  };

  const renderInterventionCounters = (gender: 'man' | 'woman') => (
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
      <Card className="p-4 space-y-3 animate-fade-in bg-gradient-to-br from-white to-gray-50">
        <h3 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-400">Dona</h3>
        {renderInterventionCounters('woman')}
      </Card>
      
      <Card className="p-4 space-y-3 animate-fade-in bg-gradient-to-br from-white to-gray-50">
        <h3 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600">Home</h3>
        {renderInterventionCounters('man')}
      </Card>
    </div>
  );
};

export default QuickIntervention;
