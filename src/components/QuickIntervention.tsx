import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { addIntervention, removeIntervention, fetchAssemblyInterventions } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
}

const Counter = ({ value, onIncrement, onDecrement, label }: CounterProps) => (
  <div className="flex items-center justify-between w-full py-2">
    <span className="text-sm text-foreground flex-1">{label}</span>
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrement}
        disabled={value === 0}
        className="h-14 w-14 rounded-full"
      >
        <Minus className="h-5 w-5" />
      </Button>
      <span className="text-2xl font-semibold w-12 text-center tabular-nums">{value}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={onIncrement}
        className="h-14 w-14 rounded-full"
      >
        <Plus className="h-5 w-5" />
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
    woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
    'non-binary': { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 }
  });

  useEffect(() => {
    const newCounts = {
      man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
      woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 },
      'non-binary': { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, explica: 0, ofensiva: 0 }
    };

    interventions.forEach(intervention => {
      const { gender, type } = intervention;
      if (newCounts[gender] && type in newCounts[gender]) {
        newCounts[gender][type]++;
      }
    });

    setCounts(newCounts);
  }, [interventions]);

  const handleIncrement = async (gender: 'man' | 'woman' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    await addIntervention({
      assembly_id: assemblyId,
      gender,
      type
    });
    onInterventionAdded();
  };

  const handleDecrement = async (gender: 'man' | 'woman' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica') => {
    if (counts[gender][type] > 0) {
      await removeIntervention(assemblyId, type, gender);
      onInterventionAdded();
    }
  };

  const renderInterventionCounters = (gender: 'man' | 'woman' | 'non-binary') => (
    <div className="space-y-1 divide-y">
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

  // Calculate total interventions per gender
  const getTotalByGender = (gender: 'man' | 'woman' | 'non-binary') => {
    return Object.values(counts[gender]).reduce((sum, count) => sum + count, 0);
  };

  return (
    <Card className="animate-fade-in">
      <Accordion type="single" collapsible className="w-full">
        {/* Dona */}
        <AccordionItem value="woman" className="border-none">
          <AccordionTrigger className="hover:no-underline px-6 py-4">
            <div className="flex items-center justify-between w-full pr-4">
              <span className="font-medium text-lg">Dona</span>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {getTotalByGender('woman')}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-4">
              {renderInterventionCounters('woman')}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Home */}
        <AccordionItem value="man" className="border-none">
          <AccordionTrigger className="hover:no-underline px-6 py-4">
            <div className="flex items-center justify-between w-full pr-4">
              <span className="font-medium text-lg">Home</span>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {getTotalByGender('man')}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-4">
              {renderInterventionCounters('man')}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* No binari */}
        <AccordionItem value="non-binary" className="border-none">
          <AccordionTrigger className="hover:no-underline px-6 py-4">
            <div className="flex items-center justify-between w-full pr-4">
              <span className="font-medium text-lg">No binari</span>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {getTotalByGender('non-binary')}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-4">
              {renderInterventionCounters('non-binary')}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default QuickIntervention;
