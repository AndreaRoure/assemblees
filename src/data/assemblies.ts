
import { Assembly, Intervention, AssemblyStats } from '@/types';
import { supabase } from '@/lib/supabase';

export let assemblies: Assembly[] = [];
export let interventions: Intervention[] = [];

// Subscribe to real-time changes with better error handling and data refresh
supabase
  .channel('assemblies')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'assemblies' }, async () => {
    await refreshData();
  })
  .subscribe();

supabase
  .channel('interventions')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'interventions' }, async () => {
    await refreshData();
  })
  .subscribe();

// Centralized data refresh function
const refreshData = async () => {
  const [assemblyData, interventionData] = await Promise.all([
    supabase.from('assemblies').select('*').order('date', { ascending: false }),
    supabase.from('interventions').select('*').order('timestamp', { ascending: true })
  ]);

  if (assemblyData.data) assemblies = assemblyData.data;
  if (interventionData.data) interventions = interventionData.data;
};

// Initialize data when the module loads
export const initializeData = refreshData;

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
  // Reset and recompute stats from scratch each time
  const assemblyInterventions = interventions.filter(i => i.assembly_id === assemblyId);
  
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

// Initialize data
initializeData();
