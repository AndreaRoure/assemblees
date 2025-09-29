-- Create socias (members) table
CREATE TABLE public.socias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  cognoms TEXT NOT NULL,
  genere TEXT NOT NULL CHECK (genere IN ('home', 'dona', 'trans', 'no-binari')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on socias table
ALTER TABLE public.socias ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for socias
CREATE POLICY "Require authentication for socias read" 
ON public.socias 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for socias insert" 
ON public.socias 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for socias update" 
ON public.socias 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for socias delete" 
ON public.socias 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add moderador_id and secretari_id to assemblies table
ALTER TABLE public.assemblies 
ADD COLUMN moderador_id UUID REFERENCES public.socias(id),
ADD COLUMN secretari_id UUID REFERENCES public.socias(id);

-- Create socia_assemblies join table for attendance tracking
CREATE TABLE public.socia_assemblies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  socia_id UUID NOT NULL REFERENCES public.socias(id) ON DELETE CASCADE,
  assembly_id UUID NOT NULL REFERENCES public.assemblies(id) ON DELETE CASCADE,
  assisteix BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(socia_id, assembly_id)
);

-- Enable RLS on socia_assemblies table
ALTER TABLE public.socia_assemblies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for socia_assemblies
CREATE POLICY "Require authentication for socia assemblies read" 
ON public.socia_assemblies 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for socia assemblies insert" 
ON public.socia_assemblies 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for socia assemblies update" 
ON public.socia_assemblies 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for socia assemblies delete" 
ON public.socia_assemblies 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_socias_updated_at
  BEFORE UPDATE ON public.socias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();