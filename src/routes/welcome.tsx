import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useHasMounted, useUser } from "@/lib/user-store";

export const Route = createFileRoute("/welcome")({
  component: WelcomeRedirect,
});

// Welcome step removed — registration now completes on the gender step.
// This route is kept only to redirect any stale navigation.
function WelcomeRedirect() {
  const mounted = useHasMounted();
  const user = useUser();
  const nav = useNavigate();
  useEffect(() => {
    if (!mounted) return;
    nav({ to: user ? "/dashboard" : "/onboarding/language", replace: true });
  }, [mounted, user, nav]);
  return null;
}
