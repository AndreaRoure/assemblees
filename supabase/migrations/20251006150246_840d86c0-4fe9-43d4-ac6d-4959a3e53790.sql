-- Create asistencias table to track individual attendance
CREATE TABLE IF NOT EXISTS public.asistencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  socia_id UUID NOT NULL REFERENCES public.socias(id) ON DELETE CASCADE,
  assembly_id UUID NOT NULL REFERENCES public.assemblies(id) ON DELETE CASCADE,
  asistio BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(socia_id, assembly_id)
);

-- Enable Row Level Security
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for asistencias
CREATE POLICY "Require authentication for asistencias read" 
ON public.asistencias 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for asistencias insert" 
ON public.asistencias 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for asistencias update" 
ON public.asistencias 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for asistencias delete" 
ON public.asistencias 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_asistencias_updated_at
BEFORE UPDATE ON public.asistencias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_asistencias_assembly_id ON public.asistencias(assembly_id);
CREATE INDEX idx_asistencias_socia_id ON public.asistencias(socia_id);