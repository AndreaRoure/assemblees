
import { createClient } from '@supabase/supabase-js';
import { Assembly, Intervention } from '@/types';

const supabaseUrl = 'https://ivtmizupnvaluhccszqp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dG1penVwbnZhbHVoY2NzenFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NDM4MDQsImV4cCI6MjA1NTExOTgwNH0.KRFIGcyXZOtUiedJdKdA5ddCS0rtZ6WQLyTxl9AZWnI';

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
