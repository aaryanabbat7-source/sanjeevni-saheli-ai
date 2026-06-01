-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('user', 'employee');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own role" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Employees
CREATE TABLE public.employees (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employees read all employees" ON public.employees
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'employee'));
CREATE POLICY "employee self upsert" ON public.employees
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "employee self update" ON public.employees
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Profiles (mobile-based; up to 3 per mobile)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mobile text NOT NULL,
  name text NOT NULL,
  dob date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('female','male','other')),
  lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX profiles_mobile_idx ON public.profiles(mobile);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'employee'));
CREATE POLICY "users insert own profiles" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users delete own profiles" ON public.profiles
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Age >= 9 enforcement + max 3 per mobile + max 3 per user
CREATE OR REPLACE FUNCTION public.profiles_validate()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  yrs int;
  cnt int;
BEGIN
  yrs := EXTRACT(YEAR FROM age(NEW.dob));
  IF yrs < 9 THEN
    RAISE EXCEPTION 'Minimum age allowed is 9 years.';
  END IF;
  IF TG_OP = 'INSERT' THEN
    SELECT COUNT(*) INTO cnt FROM public.profiles WHERE user_id = NEW.user_id;
    IF cnt >= 3 THEN
      RAISE EXCEPTION 'Only 3 profiles allowed per mobile number.';
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER profiles_validate_trg
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.profiles_validate();

-- Chat threads
CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chat_threads_profile_idx ON public.chat_threads(profile_id);
CREATE INDEX chat_threads_user_idx ON public.chat_threads(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "threads owner or employee read" ON public.chat_threads
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'employee'));
CREATE POLICY "threads owner insert" ON public.chat_threads
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "threads owner update" ON public.chat_threads
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "threads owner delete" ON public.chat_threads
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Chat messages
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  client_id text,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  text text NOT NULL,
  from_employee_id uuid REFERENCES auth.users(id),
  from_employee_name text,
  translated boolean NOT NULL DEFAULT false,
  original_text text,
  translated_lang text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_thread_idx ON public.chat_messages(thread_id, created_at);
CREATE UNIQUE INDEX chat_messages_thread_client_idx ON public.chat_messages(thread_id, client_id) WHERE client_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages visible via thread" ON public.chat_messages
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id
            AND (t.user_id = auth.uid() OR public.has_role(auth.uid(), 'employee')))
  );
CREATE POLICY "messages owner insert" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND t.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'employee')
  );
CREATE POLICY "messages owner update" ON public.chat_messages
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND t.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'employee')
  );
CREATE POLICY "messages owner delete" ON public.chat_messages
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND t.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'employee')
  );

-- Realtime
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_threads REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;