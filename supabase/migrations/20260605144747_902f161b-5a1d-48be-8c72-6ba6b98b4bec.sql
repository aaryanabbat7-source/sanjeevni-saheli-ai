ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'IN';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode text;