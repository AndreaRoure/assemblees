
import { createClient } from '@supabase/supabase-js';
import { Assembly, Intervention, AssemblyAttendance } from '@/types';

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

export const fetchAssemblyAttendance = async (assemblyId: string) => {
  const { data, error } = await supabase
    .from('assembly_attendance')
    .select('*')
    .eq('assembly_id', assemblyId)
    .maybeSingle();
  
  if (error) throw error;
  
  // If no record exists yet, return a default one
  if (!data) {
    return {
      assembly_id: assemblyId,
      female_count: 0,
      male_count: 0,
      non_binary_count: 0
    } as AssemblyAttendance;
  }
  
  return data as AssemblyAttendance;
};

export const updateAssemblyAttendance = async (assemblyId: string, attendance: Partial<AssemblyAttendance>) => {
  // Check if a record already exists
  const { data: existingRecord } = await supabase
    .from('assembly_attendance')
    .select('id')
    .eq('assembly_id', assemblyId)
    .maybeSingle();
  
  let result;
  
  if (existingRecord) {
    // Update existing record
    const { data, error } = await supabase
      .from('assembly_attendance')
      .update({
        ...attendance
      })
      .eq('assembly_id', assemblyId)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('assembly_attendance')
      .insert([{
        assembly_id: assemblyId,
        female_count: attendance.female_count || 0,
        male_count: attendance.male_count || 0,
        non_binary_count: attendance.non_binary_count || 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  }
  
  return result as AssemblyAttendance;
};
