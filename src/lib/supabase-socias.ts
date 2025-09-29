import { supabase } from '@/integrations/supabase/client';
import { Socia, SociaAssembly, SociaWithStats } from '@/types/socias';

export const fetchSocias = async (): Promise<Socia[]> => {
  const { data, error } = await supabase
    .from('socias')
    .select('*')
    .order('cognoms', { ascending: true });
  
  if (error) throw error;
  return data as Socia[];
};

export const fetchSociasWithStats = async (): Promise<SociaWithStats[]> => {
  try {
    // Get all socias
    const { data: socias, error: sociasError } = await supabase
      .from('socias')
      .select('*')
      .order('cognoms', { ascending: true });

    if (sociasError) throw sociasError;

    // Get all assemblies
    const { data: assemblies, error: assembliesError } = await supabase
      .from('assemblies')
      .select('*');

    if (assembliesError) throw assembliesError;

    // Get all socia assemblies
    const { data: sociaAssemblies, error: sociaAssembliesError } = await supabase
      .from('socia_assemblies')
      .select('*');

    if (sociaAssembliesError) throw sociaAssembliesError;

    // Calculate stats for each socia
    const sociasWithStats: SociaWithStats[] = socias.map(socia => {
      const attendance = sociaAssemblies.filter(sa => sa.socia_id === socia.id);
      const attendedCount = attendance.filter(sa => sa.assisteix).length;
      const missedCount = attendance.filter(sa => !sa.assisteix).length;
      
      const moderations = assemblies.filter(a => a.moderador_id === socia.id).length;
      const secretaryRecords = assemblies.filter(a => a.secretari_id === socia.id).length;

      return {
        ...socia,
        genere: socia.genere as 'home' | 'dona' | 'no-binari',
        tipo: socia.tipo as 'habitatge' | 'colaborador',
        comissions: socia.comissions || [],
        assemblies_attended: attendedCount,
        assemblies_missed: missedCount,
        total_assemblies: attendance.length,
        moderations,
        secretary_records: secretaryRecords
      };
    });

    return sociasWithStats;
  } catch (error) {
    console.error('Error fetching socias with stats:', error);
    throw error;
  }
};

export const addSocia = async (socia: Omit<Socia, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('socias')
    .insert([socia])
    .select()
    .single();
  
  if (error) throw error;
  return data as Socia;
};

export const updateSocia = async (id: string, updates: Partial<Omit<Socia, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('socias')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Socia;
};

export const deleteSocia = async (id: string) => {
  const { error } = await supabase
    .from('socias')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const updateSociaAttendance = async (sociaId: string, assemblyId: string, assisteix: boolean) => {
  // Check if record exists
  const { data: existing } = await supabase
    .from('socia_assemblies')
    .select('id')
    .eq('socia_id', sociaId)
    .eq('assembly_id', assemblyId)
    .maybeSingle();

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('socia_assemblies')
      .update({ assisteix })
      .eq('id', existing.id);
    
    if (error) throw error;
  } else {
    // Insert new record
    const { error } = await supabase
      .from('socia_assemblies')
      .insert([{ 
        socia_id: sociaId, 
        assembly_id: assemblyId, 
        assisteix 
      }]);
    
    if (error) throw error;
  }
};

export const updateAssemblyModerator = async (assemblyId: string, moderadorId: string | null) => {
  const { error } = await supabase
    .from('assemblies')
    .update({ moderador_id: moderadorId })
    .eq('id', assemblyId);
  
  if (error) throw error;
};

export const updateAssemblySecretary = async (assemblyId: string, secretariId: string | null) => {
  const { error } = await supabase
    .from('assemblies')
    .update({ secretari_id: secretariId })
    .eq('id', assemblyId);
  
  if (error) throw error;
};