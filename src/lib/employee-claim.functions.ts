import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATE_PASSWORD = "HALA-MADRID";

export const claimEmployeeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      name: z.string().trim().min(1).max(120),
      gatePassword: z.string().min(1).max(200),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const normalized = data.gatePassword.trim().toUpperCase().replace(/[\s_]/g, "-");
    if (normalized !== GATE_PASSWORD) {
      return { ok: false as const, error: "Invalid team passcode." };
    }
    const userId = context.userId;
    const email = context.claims?.email ?? "";

    // Insert role (idempotent via unique constraint)
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "employee" }, { onConflict: "user_id,role" });
    if (roleErr) return { ok: false as const, error: roleErr.message };

    const { error: empErr } = await supabaseAdmin
      .from("employees")
      .upsert({ id: userId, name: data.name, email });
    if (empErr) return { ok: false as const, error: empErr.message };

    return { ok: true as const };
  });
