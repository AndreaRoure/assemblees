
import React from 'react';
import { interventions } from '@/data/assemblies';
import { Card } from '@/components/ui/card';

const RegistersList = () => {
  const getInterventionsByType = (gender: string) => {
    const genderInterventions = interventions.filter(i => i.gender === gender);
    return {
      intervencio: genderInterventions.filter(i => i.type === 'intervencio').length,
      dinamitza: genderInterventions.filter(i => i.type === 'dinamitza').length,
      interrupcio: genderInterventions.filter(i => i.type === 'interrupcio').length,
      llarga: genderInterventions.filter(i => i.type === 'llarga').length,
      ofensiva: genderInterventions.filter(i => i.type === 'ofensiva').length,
      explica: genderInterventions.filter(i => i.type === 'explica').length,
    };
  };

  const getTotalByGender = (gender: string) => {
    return interventions.filter(i => i.gender === gender).length;
  };

  const getPercentageByGender = (gender: string) => {
    const total = interventions.length;
    if (total === 0) return 0;
    return Math.round((getTotalByGender(gender) / total) * 100);
  };

  const groupInterventionsByAssembly = (gender: string) => {
    const genderInterventions = interventions.filter(i => i.gender === gender);
    const assemblyCounts = new Map<string, number>();

    genderInterventions.forEach(intervention => {
      const count = assemblyCounts.get(intervention.assembly_id) || 0;
      assemblyCounts.set(intervention.assembly_id, count + 1);
    });

    return assemblyCounts;
  };

  const genderStats = {
    man: getInterventionsByType('man'),
    woman: getInterventionsByType('woman'),
    trans: getInterventionsByType('trans'),
    'non-binary': getInterventionsByType('non-binary'),
  };

  return (
    <div className="space-y-4">
      {Object.entries(genderStats).map(([gender, stats]) => (
        <Card key={gender} className="p-4">
          <h3 className="font-semibold mb-2">
            {gender === 'man' && 'Homes'}
            {gender === 'woman' && 'Dones'}
            {gender === 'trans' && 'Persones Trans'}
            {gender === 'non-binary' && 'Persones No Binàries'}
          </h3>
          <div className="text-sm text-muted-foreground mb-4">
            Total: {getTotalByGender(gender)} ({getPercentageByGender(gender)}%)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs font-medium mb-1">Tipus</div>
              <div className="space-y-1 text-sm">
                <div>Intervencions: {stats.intervencio}</div>
                <div>Dinamitza: {stats.dinamitza}</div>
                <div>Interrupcions: {stats.interrupcio}</div>
                <div>Intervencions llargues: {stats.llarga}</div>
                <div>Intervencions ofensives: {stats.ofensiva}</div>
                <div>Explica: {stats.explica}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Per assemblea</div>
              <div className="space-y-1 text-sm">
                {Array.from(groupInterventionsByAssembly(gender)).map(([assembly_id, count]) => (
                  <div key={assembly_id}>ID: {assembly_id.slice(0, 8)}... ({count})</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RegistersList;
