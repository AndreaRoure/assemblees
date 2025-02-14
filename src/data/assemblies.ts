
import { Assembly, Intervention, AssemblyStats } from '@/types';
import { supabase } from '@/lib/supabase';

// Initialize empty stats object
const createEmptyGenderStats = () => ({
  intervencio: 0,
  dinamitza: 0,
  interrupcio: 0,
  llarga: 0,
  ofensiva: 0,
  explica: 0,
});

export const getAssemblyStats = (assemblyId: string): AssemblyStats => {
  const genderStats = {
    man: createEmptyGenderStats(),
    woman: createEmptyGenderStats(),
    trans: createEmptyGenderStats(),
    'non-binary': createEmptyGenderStats(),
  };

  const typeStats = {
    intervencio: 0,
    dinamitza: 0,
    interrupcio: 0,
    llarga: 0,
    ofensiva: 0,
    explica: 0,
  };

  // Fresh aggregation of interventions
  const assemblyInterventions = interventions.filter(i => i.assembly_id === assemblyId);
  assemblyInterventions.forEach(intervention => {
    const { gender, type } = intervention;
    if (genderStats[gender] && type in genderStats[gender]) {
      genderStats[gender][type]++;
      typeStats[type]++;
    }
  });

  return {
    totalInterventions: assemblyInterventions.length,
    byGender: genderStats,
    byType: typeStats,
  };
};
