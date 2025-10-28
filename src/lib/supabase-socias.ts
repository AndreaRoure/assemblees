import { supabase } from '@/integrations/supabase/client';
import { Socia, SociaAssembly, SociaWithStats } from '@/types/socias';

export const fetchSocias = async (): Promise<Socia[]> => {
  const { data, error } = await supabase
    .from('socias')
    .select('*')
    .order('nom', { ascending: true });
  
  if (error) throw error;
  return data as Socia[];
};

export const getTotalSociasCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('socias')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count || 0;
};

export const fetchSociasWithStats = async (year?: string): Promise<SociaWithStats[]> => {
  try {
    // Get all socias
    const { data: socias, error: sociasError } = await supabase
      .from('socias')
      .select('*')
      .order('nom', { ascending: true });

    if (sociasError) throw sociasError;

    // Get all assemblies
    let assembliesQuery = supabase
      .from('assemblies')
      .select('*');

    const { data: allAssemblies, error: assembliesError } = await assembliesQuery;
    if (assembliesError) throw assembliesError;

    // Filter assemblies by year if specified
    const assemblies = year && year !== 'all' 
      ? allAssemblies.filter(a => new Date(a.date).getFullYear().toString() === year)
      : allAssemblies;

    // Get assembly IDs for filtered assemblies
    const assemblyIds = assemblies.map(a => a.id);

    // Get asistencias only for filtered assemblies
    const { data: asistencias, error: asistenciasError } = await supabase
      .from('asistencias')
      .select('*')
      .in('assembly_id', assemblyIds.length > 0 ? assemblyIds : ['']);

    if (asistenciasError) throw asistenciasError;

    // Calculate stats for each socia
    const sociasWithStats: SociaWithStats[] = socias.map(socia => {
      const attendance = asistencias.filter(a => a.socia_id === socia.id);
      const attendedCount = attendance.filter(a => a.asistio).length;
      // Faltas = Total de asambleas (filtradas) - Asambleas asistidas
      const missedCount = assemblies.length - attendedCount;
      
      const moderations = assemblies.filter(a => a.moderador_id === socia.id).length;
      const secretaryRecords = assemblies.filter(a => a.secretari_id === socia.id).length;

      return {
        ...socia,
        genere: socia.genere as 'home' | 'dona' | 'no-binari',
        tipo: socia.tipo as 'habitatge' | 'colaborador',
        comissions: socia.comissions || [],
        assemblies_attended: attendedCount,
        assemblies_missed: missedCount,
        total_assemblies: assemblies.length, // Total de asambleas filtradas
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

export const updateSociaAttendance = async (sociaId: string, assemblyId: string, asistio: boolean) => {
  // Use upsert for simpler logic with asistencias table
  const { error } = await supabase
    .from('asistencias')
    .upsert(
      {
        socia_id: sociaId,
        assembly_id: assemblyId,
        asistio,
      },
      {
        onConflict: 'socia_id,assembly_id',
      }
    );
  
  if (error) throw error;
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