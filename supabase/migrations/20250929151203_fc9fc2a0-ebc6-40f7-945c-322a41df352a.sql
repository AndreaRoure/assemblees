-- Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.assemblies;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.assemblies;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.assemblies;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.assemblies;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.interventions;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.interventions;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.interventions;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.interventions;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.assembly_attendance;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.assembly_attendance;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.assembly_attendance;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.assembly_attendance;

-- Create secure RLS policies that require authentication
-- Assemblies table - restrict access to authenticated users only
CREATE POLICY "Authenticated users can read assemblies" 
ON public.assemblies 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert assemblies" 
ON public.assemblies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update assemblies" 
ON public.assemblies 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete assemblies" 
ON public.assemblies 
FOR DELETE 
TO authenticated 
USING (true);

-- Interventions table - restrict access to authenticated users only
CREATE POLICY "Authenticated users can read interventions" 
ON public.interventions 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert interventions" 
ON public.interventions 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update interventions" 
ON public.interventions 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete interventions" 
ON public.interventions 
FOR DELETE 
TO authenticated 
USING (true);

-- Assembly attendance table - restrict access to authenticated users only
CREATE POLICY "Authenticated users can read assembly attendance" 
ON public.assembly_attendance 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert assembly attendance" 
ON public.assembly_attendance 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update assembly attendance" 
ON public.assembly_attendance 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete assembly attendance" 
ON public.assembly_attendance 
FOR DELETE 
TO authenticated 
USING (true);