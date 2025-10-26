-- Add start_time and end_time columns to assemblies table
ALTER TABLE public.assemblies 
ADD COLUMN start_time timestamp with time zone,
ADD COLUMN end_time timestamp with time zone;