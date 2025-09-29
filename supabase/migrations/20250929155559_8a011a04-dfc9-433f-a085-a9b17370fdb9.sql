-- Add new tipo column to socias table
ALTER TABLE public.socias 
ADD COLUMN tipo text NOT NULL DEFAULT 'habitatge' 
CHECK (tipo IN ('habitatge', 'colaborador'));

-- Update existing records to have a default tipo
UPDATE public.socias SET tipo = 'habitatge' WHERE tipo IS NULL;