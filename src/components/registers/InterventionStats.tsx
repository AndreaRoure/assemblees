
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
      {Object.entries(stats).map(([type, count], index) => (
        <Card 
          key={type} 
          className="p-4 hover:shadow-lg transition-all duration-200 animate-fade-in"
          style={{ 
            animationDelay: `${index * 100}ms`,
            background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)'
          }}
        >
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {count}
          </div>
          <div className="text-sm font-medium text-gray-600 mt-1">
            {getTypeLabel(type)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InterventionStats;
