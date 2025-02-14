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

// Keep existing functions but update them to use Supabase
export const addAssembly = async (assembly: Omit<Assembly, 'id'>) => {
  const { data, error } = await supabase
    .from('assemblies')
    .insert([assembly])
    .select()
    .single();
  
  if (error) throw error;
  if (data) assemblies.unshift(data);
  return data;
};

export const deleteAssembly = async (id: string) => {
  await supabase.from('interventions').delete().eq('assemblyId', id);
  await supabase.from('assemblies').delete().eq('id', id);
  
  const index = assemblies.findIndex(a => a.id === id);
  if (index !== -1) {
    assemblies.splice(index, 1);
    interventions = interventions.filter(i => i.assemblyId !== id);
  }
};

export const updateAssembly = async (id: string, updates: Partial<Omit<Assembly, 'id'>>) => {
  const { data, error } = await supabase
    .from('assemblies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  if (data) {
    const index = assemblies.findIndex(a => a.id === id);
    if (index !== -1) {
      assemblies[index] = data;
    }
  }
};

export const addIntervention = async (intervention: Omit<Intervention, 'id' | 'timestamp'>) => {
  const { data, error } = await supabase
    .from('interventions')
    .insert([{ ...intervention, timestamp: Date.now() }])
    .select()
    .single();
  
  if (error) throw error;
  if (data) interventions.push(data);
  return data;
};

export const removeIntervention = async (assemblyId: string, type: string, gender: string) => {
  const intervention = [...interventions]
    .reverse()
    .find(i => i.assemblyId === assemblyId && i.type === type && i.gender === gender);
  
  if (intervention) {
    await supabase.from('interventions').delete().eq('id', intervention.id);
    const index = interventions.indexOf(intervention);
    interventions.splice(index, 1);
  }
};

export const getAssemblyStats = (assemblyId: string): AssemblyStats => {
  const assemblyInterventions = interventions.filter(i => i.assemblyId === assemblyId);
  
  const createGenderStats = (gender: string) => {
    const genderInterventions = assemblyInterventions.filter(i => i.gender === gender);
    return {
      intervencio: genderInterventions.filter(i => i.type === 'intervencio').length,
      dinamitza: genderInterventions.filter(i => i.type === 'dinamitza').length,
      interrupcio: genderInterventions.filter(i => i.type === 'interrupcio').length,
      llarga: genderInterventions.filter(i => i.type === 'llarga').length,
      ofensiva: genderInterventions.filter(i => i.type === 'ofensiva').length,
      explica: genderInterventions.filter(i => i.type === 'explica').length,
    };
  };

  return {
    totalInterventions: assemblyInterventions.length,
    byGender: {
      man: createGenderStats('man'),
      woman: createGenderStats('woman'),
      trans: createGenderStats('trans'),
      'non-binary': createGenderStats('non-binary'),
    },
    byType: {
      intervencio: assemblyInterventions.filter(i => i.type === 'intervencio').length,
      dinamitza: assemblyInterventions.filter(i => i.type === 'dinamitza').length,
      interrupcio: assemblyInterventions.filter(i => i.type === 'interrupcio').length,
      llarga: assemblyInterventions.filter(i => i.type === 'llarga').length,
      ofensiva: assemblyInterventions.filter(i => i.type === 'ofensiva').length,
      explica: assemblyInterventions.filter(i => i.type === 'explica').length,
    },
  };
};

// Initialize data when the module loads
initializeData();
