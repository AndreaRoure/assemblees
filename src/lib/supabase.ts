
import { createClient } from '@supabase/supabase-js';
import { Assembly, Intervention } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchAssemblies = async () => {
  const { data, error } = await supabase
    .from('assemblies')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data as Assembly[];
};

export const fetchInterventions = async () => {
  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .order('timestamp', { ascending: true });
  
  if (error) throw error;
  return data as Intervention[];
};

export const addAssembly = async (assembly: Omit<Assembly, 'id'>) => {
  const { data, error } = await supabase
    .from('assemblies')
    .insert([assembly])
    .select()
    .single();
  
  if (error) throw error;
  return data as Assembly;
};

export const deleteAssembly = async (id: string) => {
  const { error: interventionsError } = await supabase
    .from('interventions')
    .delete()
    .eq('assemblyId', id);

  if (interventionsError) throw interventionsError;

  const { error } = await supabase
    .from('assemblies')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const addIntervention = async (intervention: Omit<Intervention, 'id' | 'timestamp'>) => {
  const { data, error } = await supabase
    .from('interventions')
    .insert([{ ...intervention, timestamp: Date.now() }])
    .select()
    .single();
  
  if (error) throw error;
  return data as Intervention;
};

export const removeIntervention = async (assemblyId: string, type: string, gender: string) => {
  const { data: interventions } = await supabase
    .from('interventions')
    .select('*')
    .eq('assemblyId', assemblyId)
    .eq('type', type)
    .eq('gender', gender)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (interventions && interventions.length > 0) {
    const { error } = await supabase
      .from('interventions')
      .delete()
      .eq('id', interventions[0].id);

    if (error) throw error;
  }
};
