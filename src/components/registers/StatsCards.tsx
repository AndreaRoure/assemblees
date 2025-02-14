
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(totals).map(([type, count]) => (
          <Card key={type} className="p-4">
            <div className="text-base md:text-lg font-semibold">{count}</div>
            <div className="text-xs md:text-sm text-muted-foreground break-words">
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
