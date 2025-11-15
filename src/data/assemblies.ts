import { Assembly, Intervention, AssemblyStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Initialize empty stats object
const createEmptyGenderStats = () => ({
  intervencio: 0,
  dinamitza: 0,
  interrupcio: 0,
  llarga: 0,
  ofensiva: 0,
  explica: 0,
});

export const getAssemblyStats = async (assemblyId: string): Promise<AssemblyStats> => {
  const genderStats = {
    man: createEmptyGenderStats(),
    woman: createEmptyGenderStats(),
  };

  const typeStats = {
    intervencio: 0,
    dinamitza: 0,
    interrupcio: 0,
    llarga: 0,
    ofensiva: 0,
    explica: 0,
  };

  // Fetch interventions from the database
  const { data: assemblyInterventions, error } = await supabase
    .from('interventions')
    .select('*')
    .eq('assembly_id', assemblyId);

  if (error) throw error;

  // Aggregate the interventions
  assemblyInterventions?.forEach(intervention => {
    const { gender, type } = intervention;
    if (genderStats[gender] && type in genderStats[gender]) {
      genderStats[gender][type]++;
      typeStats[type]++;
    }
  });

  return {
    totalInterventions: assemblyInterventions?.length || 0,
    byGender: genderStats,
    byType: typeStats,
  };
};

// Function to count the total number of assemblies
export const getTotalAssembliesCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('assemblies')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count || 0;
};
