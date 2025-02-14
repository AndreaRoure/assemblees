
import React from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardsProps {
  totals: {
    [key: string]: number;
  };
}

const StatsCards = ({ totals }: StatsCardsProps) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-6">
        {Object.entries(totals).map(([type, count]) => (
          <Card key={type} className="p-3 md:p-4">
            <div className="text-base font-semibold md:text-lg">{count}</div>
            <div className="text-xs text-muted-foreground md:text-sm break-words">
              {type === 'intervencio' && 'Intervencions'}
              {type === 'dinamitza' && 'Dinamitza'}
              {type === 'interrupcio' && 'Interrupcions'}
              {type === 'llarga' && 'Inter. llargues'}
              {type === 'ofensiva' && 'Inter. ofensives'}
              {type === 'explica' && 'Explica'}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
