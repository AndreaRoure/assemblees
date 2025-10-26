import { supabase } from '@/integrations/supabase/client';

export interface Asistencia {
  id: string;
  socia_id: string;
  assembly_id: string;
  asistio: boolean;
  created_at: string;
  updated_at: string;
}

export interface AsistenciaWithSocia extends Asistencia {
  socia: {
    id: string;
    nom: string;
    cognoms: string;
    genere: 'home' | 'dona' | 'no-binari';
  };
}

export const fetchAssemblyAsistencias = async (assemblyId: string): Promise<AsistenciaWithSocia[]> => {
  const { data, error } = await supabase
    .from('asistencias')
    .select(`
      *,
      socia:socias(id, nom, cognoms, genere)
    `)
    .eq('assembly_id', assemblyId);

  if (error) throw error;
  return data as AsistenciaWithSocia[];
};

export const upsertAsistencia = async (
  sociaId: string,
  assemblyId: string,
  asistio: boolean
): Promise<void> => {
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

export const deleteAsistencia = async (
  sociaId: string,
  assemblyId: string
): Promise<void> => {
  const { error } = await supabase
    .from('asistencias')
    .delete()
    .eq('socia_id', sociaId)
    .eq('assembly_id', assemblyId);

  if (error) throw error;
};

export const fetchAssemblyAttendeesCount = async (assemblyId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('asistencias')
    .select('*', { count: 'exact', head: true })
    .eq('assembly_id', assemblyId)
    .eq('asistio', true);

  if (error) throw error;
  return count || 0;
};
