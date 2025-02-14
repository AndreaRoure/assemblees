
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  type: string;
  count: number;
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'intervencio': return 'Intervencions';
    case 'dinamitza': return 'Dinamitza';
    case 'interrupcio': return 'Interrupcions';
    case 'llarga': return 'Intervencions llargues';
    case 'ofensiva': return 'Ofensiva';
    case 'explica': return 'Explica';
    default: return type;
  }
};

const InterventionStats = ({ stats }: { stats: Record<string, number> }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(stats).map(([type, count]) => (
        <Card key={type} className="p-4">
          <div className="text-lg font-semibold">{count}</div>
          <div className="text-sm text-muted-foreground">
            {getTypeLabel(type)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InterventionStats;
