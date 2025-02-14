
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRound, UserCircle2, Users, User } from 'lucide-react';
import { addIntervention } from '@/data/assemblies';

interface QuickInterventionProps {
  assemblyId: string;
  onInterventionAdded: () => void;
}

const QuickIntervention = ({ assemblyId, onInterventionAdded }: QuickInterventionProps) => {
  const handleIntervention = (gender: 'man' | 'woman' | 'trans' | 'non-binary', type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva') => {
    addIntervention({ assemblyId, gender, type });
    onInterventionAdded();
  };

  const renderInterventionButtons = (gender: 'man' | 'woman' | 'trans' | 'non-binary', icon: React.ReactNode) => (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleIntervention(gender, 'intervencio')}
        className="w-full"
      >
        {icon}
        🗣️ Intervenció
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleIntervention(gender, 'dinamitza')}
        className="w-full"
      >
        {icon}
        ✨ Dinamitza
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleIntervention(gender, 'interrupcio')}
        className="w-full"
      >
        {icon}
        ✋ Interrupció
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleIntervention(gender, 'llarga')}
        className="w-full"
      >
        {icon}
        ⏳ Llarga
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleIntervention(gender, 'ofensiva')}
        className="w-full col-span-2"
      >
        {icon}
        ⚠️ Ofensiva
      </Button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">👨 Home</h3>
        {renderInterventionButtons('man', <UserRound className="h-4 w-4 mr-1" />)}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">👩 Dona</h3>
        {renderInterventionButtons('woman', <UserCircle2 className="h-4 w-4 mr-1" />)}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">🌈 Trans</h3>
        {renderInterventionButtons('trans', <Users className="h-4 w-4 mr-1" />)}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">💫 No binari</h3>
        {renderInterventionButtons('non-binary', <User className="h-4 w-4 mr-1" />)}
      </div>
    </div>
  );
};

export default QuickIntervention;
