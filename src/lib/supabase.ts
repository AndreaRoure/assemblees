import { Assembly, Intervention } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export { supabase };

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

export const fetchAssemblyInterventions = async (assemblyId: string) => {
  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .eq('assembly_id', assemblyId)
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
  // First delete related interventions
  const { error: interventionsError } = await supabase
    .from('interventions')
    .delete()
    .eq('assembly_id', id);

  if (interventionsError) throw interventionsError;

  // Then delete the assembly
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
  const { data } = await supabase
    .from('interventions')
    .select('*')
    .eq('assembly_id', assemblyId)
    .eq('type', type)
    .eq('gender', gender)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    const { error } = await supabase
      .from('interventions')
      .delete()
      .eq('id', data[0].id);

    if (error) throw error;
  }
};

export const updateAssemblyModerator = async (
  assemblyId: string,
  moderadorId: string | null
): Promise<void> => {
  const { error } = await supabase
    .from('assemblies')
    .update({ moderador_id: moderadorId })
    .eq('id', assemblyId);

  if (error) throw error;
};

export const updateAssemblySecretary = async (
  assemblyId: string,
  secretariId: string | null
): Promise<void> => {
  const { error } = await supabase
    .from('assemblies')
    .update({ secretari_id: secretariId })
    .eq('id', assemblyId);

  if (error) throw error;
};
