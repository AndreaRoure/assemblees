-- Fix security warning: Set search_path for function
CREATE OR REPLACE FUNCTION validate_comissions()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid_values TEXT[] := ARRAY['economiques', 'intercooperacio', 'secretaria', 'convivencia', 'subvencions', 'arquitectura', 'comunicacio'];
  comm TEXT;
BEGIN
  IF NEW.comissions IS NOT NULL THEN
    FOREACH comm IN ARRAY NEW.comissions
    LOOP
      IF NOT (comm = ANY(valid_values)) THEN
        RAISE EXCEPTION 'Invalid commission value: %. Valid values are: economiques, intercooperacio, secretaria, convivencia, subvencions, arquitectura, comunicacio', comm;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;