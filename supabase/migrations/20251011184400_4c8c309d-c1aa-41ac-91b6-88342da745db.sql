-- Add unique constraint to asistencias table to prevent duplicates
-- This ensures one attendance record per socia per assembly
ALTER TABLE public.asistencias 
ADD CONSTRAINT asistencias_socia_assembly_unique 
UNIQUE (socia_id, assembly_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_asistencias_socia_id ON public.asistencias(socia_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_assembly_id ON public.asistencias(assembly_id);