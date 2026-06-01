
-- 1. Secure Realtime: enable RLS on realtime.messages and only allow subscriptions
-- to topics that map to a chat thread the user owns (or to employees).
-- Topic convention used by the app: 'thread:<thread_uuid>'.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated can subscribe to own thread topics" ON realtime.messages;
CREATE POLICY "authenticated can subscribe to own thread topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  (
    realtime.topic() LIKE 'thread:%'
    AND EXISTS (
      SELECT 1
      FROM public.chat_threads t
      WHERE t.id::text = substring(realtime.topic() from 8)
        AND (t.user_id = auth.uid() OR public.has_role(auth.uid(), 'employee'::public.app_role))
    )
  )
  OR public.has_role(auth.uid(), 'employee'::public.app_role)
);

-- 2. Lock down employees INSERT: employee rows are created server-side via
-- the service role (claimEmployeeRole). Block all direct client inserts.
DROP POLICY IF EXISTS "employee self upsert" ON public.employees;
CREATE POLICY "employees insert requires employee role"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() AND public.has_role(auth.uid(), 'employee'::public.app_role));
