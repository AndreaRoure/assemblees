-- Drop current authentication-based policies that still use 'true' conditions
DROP POLICY IF EXISTS "Authenticated users can read assemblies" ON public.assemblies;
DROP POLICY IF EXISTS "Authenticated users can insert assemblies" ON public.assemblies;
DROP POLICY IF EXISTS "Authenticated users can update assemblies" ON public.assemblies;
DROP POLICY IF EXISTS "Authenticated users can delete assemblies" ON public.assemblies;

DROP POLICY IF EXISTS "Authenticated users can read interventions" ON public.interventions;
DROP POLICY IF EXISTS "Authenticated users can insert interventions" ON public.interventions;
DROP POLICY IF EXISTS "Authenticated users can update interventions" ON public.interventions;
DROP POLICY IF EXISTS "Authenticated users can delete interventions" ON public.interventions;

DROP POLICY IF EXISTS "Authenticated users can read assembly attendance" ON public.assembly_attendance;
DROP POLICY IF EXISTS "Authenticated users can insert assembly attendance" ON public.assembly_attendance;
DROP POLICY IF EXISTS "Authenticated users can update assembly attendance" ON public.assembly_attendance;
DROP POLICY IF EXISTS "Authenticated users can delete assembly attendance" ON public.assembly_attendance;

-- Create properly secured RLS policies with explicit authentication checks
-- Assemblies table - require authenticated user ID
CREATE POLICY "Require authentication for assemblies read" 
ON public.assemblies 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for assemblies insert" 
ON public.assemblies 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for assemblies update" 
ON public.assemblies 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for assemblies delete" 
ON public.assemblies 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Interventions table - require authenticated user ID
CREATE POLICY "Require authentication for interventions read" 
ON public.interventions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for interventions insert" 
ON public.interventions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for interventions update" 
ON public.interventions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for interventions delete" 
ON public.interventions 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Assembly attendance table - require authenticated user ID
CREATE POLICY "Require authentication for assembly attendance read" 
ON public.assembly_attendance 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for assembly attendance insert" 
ON public.assembly_attendance 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for assembly attendance update" 
ON public.assembly_attendance 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for assembly attendance delete" 
ON public.assembly_attendance 
FOR DELETE 
USING (auth.uid() IS NOT NULL);