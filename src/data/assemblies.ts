
import { Assembly, Intervention, AssemblyStats } from '@/types';
import { supabase } from '@/lib/supabase';

export let assemblies: Assembly[] = [];
export let interventions: Intervention[] = [];

// Subscribe to real-time changes
supabase
  .channel('assemblies')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'assemblies' }, async () => {
    const { data } = await supabase.from('assemblies').select('*').order('date', { ascending: false });
    if (data) assemblies = data;
  })
  .subscribe();

supabase
  .channel('interventions')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'interventions' }, async () => {
    const { data } = await supabase.from('interventions').select('*').order('timestamp', { ascending: true });
    if (data) interventions = data;
  })
  .subscribe();

// Initial data load
export const initializeData = async () => {
  const [assemblyData, interventionData] = await Promise.all([
    supabase.from('assemblies').select('*').order('date', { ascending: false }),
    supabase.from('interventions').select('*').order('timestamp', { ascending: true })
  ]);

  if (assemblyData.data) assemblies = assemblyData.data;
  if (interventionData.data) interventions = interventionData.data;
};

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
  // Filter interventions for the specific assembly
  const assemblyInterventions = interventions.filter(i => i.assembly_id === assemblyId);
  
  // Initialize stats objects
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

  // Aggregate interventions
  assemblyInterventions.forEach(intervention => {
    const { gender, type } = intervention;
    
    // Increment gender-specific count
    if (genderStats[gender] && typeof genderStats[gender][type] === 'number') {
      genderStats[gender][type]++;
    }
    
    // Increment total type count
    if (typeof typeStats[type] === 'number') {
      typeStats[type]++;
    }
  });

  return {
    totalInterventions: assemblyInterventions.length,
    byGender: genderStats,
    byType: typeStats,
  };
};

// Initialize data when the module loads
initializeData();
