-- Add new comissions column to socias table as an array of text
ALTER TABLE public.socias 
ADD COLUMN comissions text[] DEFAULT '{}';

-- Add a check constraint to ensure only valid commission values
ALTER TABLE public.socias 
ADD CONSTRAINT valid_comissions 
CHECK (
  comissions <@ ARRAY[
    'economicas', 
    'intercooperacion', 
    'secretaria', 
    'convivencia', 
    'subvenciones', 
    'arquitectura', 
    'comunicacion'
  ]
);