
-- Update min age to 12
CREATE OR REPLACE FUNCTION public.profiles_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  yrs int;
  cnt int;
BEGIN
  yrs := EXTRACT(YEAR FROM age(NEW.dob));
  IF yrs < 12 THEN
    RAISE EXCEPTION 'Minimum age allowed is 12 years.';
  END IF;
  IF TG_OP = 'INSERT' THEN
    SELECT COUNT(*) INTO cnt FROM public.profiles WHERE user_id = NEW.user_id;
    IF cnt >= 3 THEN
      RAISE EXCEPTION 'Only 3 profiles allowed per mobile number.';
    END IF;
  END IF;
  RETURN NEW;
END $function$;

-- Add description column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS description text;
