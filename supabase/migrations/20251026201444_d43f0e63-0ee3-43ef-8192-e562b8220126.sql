-- Remove old constraint and use trigger validation instead

-- Step 1: Drop the old constraint
ALTER TABLE socias DROP CONSTRAINT IF EXISTS valid_comissions;

-- Step 2: Update all existing commission values to Catalan
UPDATE socias
SET comissions = ARRAY(
  SELECT CASE 
    WHEN unnest = 'economicas' THEN 'economiques'
    WHEN unnest = 'intercooperacion' THEN 'intercooperacio'
    WHEN unnest = 'secretaria' THEN 'secretaria'
    WHEN unnest = 'convivencia' THEN 'convivencia'
    WHEN unnest = 'subvenciones' THEN 'subvencions'
    WHEN unnest = 'arquitectura' THEN 'arquitectura'
    WHEN unnest = 'comunicacion' THEN 'comunicacio'
    ELSE unnest
  END
  FROM unnest(comissions)
)
WHERE comissions IS NOT NULL AND array_length(comissions, 1) > 0;

-- Step 3: Create validation function
CREATE OR REPLACE FUNCTION validate_comissions()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger
DROP TRIGGER IF EXISTS validate_comissions_trigger ON socias;
CREATE TRIGGER validate_comissions_trigger
  BEFORE INSERT OR UPDATE ON socias
  FOR EACH ROW
  EXECUTE FUNCTION validate_comissions();