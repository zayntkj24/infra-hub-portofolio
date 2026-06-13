import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && isAdmin) navigate({ to: "/admin" });
  }, [user, isAdmin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-lg border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Admin {mode === "signin" ? "sign in" : "sign up"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage documentation, upload screenshots, edit pages.
          </p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <input
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>

          {user && !isAdmin && !loading && (
            <p className="mt-4 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs">
              You're signed in but don't have admin access. Ask the project owner to grant you the <code>admin</code> role.
            </p>
          )}
          <p className="mt-4 text-[11px] text-muted-foreground">
            <Link to="/" className="underline">← Back to docs</Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
