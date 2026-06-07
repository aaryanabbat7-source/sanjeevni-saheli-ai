import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { LogoStacked } from "@/components/Logo";
import { SplashIntro } from "@/components/SplashIntro";
import { useUser } from "@/lib/user-store";
import { bcp47, isRTL } from "@/lib/i18n";


function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-hero px-4">
      <div className="max-w-md text-center">
        <LogoStacked size={140} />
        <h1 className="mt-8 text-6xl font-bold text-gradient">404</h1>
        <h2 className="mt-2 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-hero px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            Try again
          </button>
          <a href="/" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#6E7D5A" },
      { title: "Project Sanjeevni — Your Trusted Health Companion" },
      { name: "description", content: "Multilingual AI-powered healthcare companion for families across India, Africa and South Asia. Trusted, compassionate, evidence-based." },
      { property: "og:title", content: "Project Sanjeevni — Your Trusted Health Companion" },
      { property: "og:description", content: "Multilingual AI-powered healthcare companion for families across India, Africa and South Asia. Trusted, compassionate, evidence-based." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Project Sanjeevni — Your Trusted Health Companion" },
      { name: "twitter:description", content: "Multilingual AI-powered healthcare companion for families across India, Africa and South Asia. Trusted, compassionate, evidence-based." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ZnJgRnPFbwYjiGIzcz1Elop3MOS2/social-images/social-1780820166767-WhatsApp_Image_2026-06-05_at_19.33.24.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ZnJgRnPFbwYjiGIzcz1Elop3MOS2/social-images/social-1780820166767-WhatsApp_Image_2026-06-05_at_19.33.24.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Lato:wght@400;700;900&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function HtmlLangSync() {
  const user = useUser();
  useEffect(() => {
    if (typeof document === "undefined") return;
    const lang = user?.lang ?? "en";
    document.documentElement.lang = bcp47(lang);
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
  }, [user?.lang]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  if (typeof window !== "undefined") {
    // lazy init on first render in browser
    import("@/lib/user-store").then((m) => m.initUserStore());
    import("@/lib/employee-store").then((m) => m.initEmployeeStore());
    import("@/lib/chat-store").then(({ fetchAllThreads, clearChats }) => {
      import("@/integrations/supabase/client").then(({ supabase }) => {
        supabase.auth.getSession().then(({ data }) => { if (data.session) void fetchAllThreads(); });
        supabase.auth.onAuthStateChange((_e, s) => { if (s) void fetchAllThreads(); else clearChats(); });
      });
    });
  }
  return (
    <QueryClientProvider client={queryClient}>
      <HtmlLangSync />
      <SplashIntro />
      <Outlet />
    </QueryClientProvider>
  );
}


