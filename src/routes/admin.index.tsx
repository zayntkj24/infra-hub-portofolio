import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/hooks/use-auth";
import { CATEGORIES, slugify } from "@/lib/docs-catalog";
import { toast } from "sonner";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface DocRow {
  id: string;
  category: string;
  subcategory: string;
  slug: string;
  title: string;
  updated_at: string;
}

function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocRow[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/admin/login" });
  }, [user, isAdmin, loading, navigate]);

  const refresh = async () => {
    const { data } = await supabase
      .from("docs")
      .select("id, category, subcategory, slug, title, updated_at")
      .order("updated_at", { ascending: false });
    setDocs(data ?? []);
  };
  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  const remove = async (id: string) => {
    if (!confirm("Delete this doc?")) return;
    const { error } = await supabase.from("docs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refresh(); }
  };

  if (loading || !isAdmin) {
    return <SiteShell><div className="p-8 text-sm text-muted-foreground">Loading…</div></SiteShell>;
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">// admin</p>
            <h1 className="mt-1 text-2xl font-semibold">Documentation</h1>
            <p className="text-sm text-muted-foreground">Create, edit and publish docs across all categories.</p>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-3">Quick create — pick a category and subcategory:</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <details key={cat.slug} className="rounded-md border border-border bg-background p-3">
                <summary className="cursor-pointer text-sm font-medium">{cat.name}</summary>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <li key={sub}>
                      <Link
                        to="/admin/edit/$category/$slug"
                        params={{ category: cat.slug, slug: slugify(sub) }}
                        className="inline-flex items-center gap-1 rounded border border-border bg-accent/40 px-1.5 py-0.5 text-[11px] font-mono hover:bg-accent"
                      >
                        <Plus className="h-2.5 w-2.5" /> {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Published / Edited</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Updated</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                  No custom docs yet. All built-in seed docs are live on the site.
                </td></tr>
              )}
              {docs.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{d.title}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d.category} / {d.subcategory}</td>
                  <td className="px-3 py-2 text-muted-foreground text-xs">{new Date(d.updated_at).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to="/admin/edit/$category/$slug"
                      params={{ category: d.category, slug: d.slug }}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-accent"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                    <button
                      onClick={() => remove(d.id)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SiteShell>
  );
}
