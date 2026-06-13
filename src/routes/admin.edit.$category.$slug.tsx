import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/hooks/use-auth";
import { getCategory, findSubcategoryByDocSlug } from "@/lib/docs-catalog";
import { getSeedDoc } from "@/lib/seed-docs";
import { MarkdownDoc } from "@/components/MarkdownDoc";
import { toast } from "sonner";
import { Eye, ImagePlus, Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/edit/$category/$slug")({
  component: EditPage,
});

function EditPage() {
  const { category, slug } = Route.useParams();
  const cat = getCategory(category);
  const sub = cat ? findSubcategoryByDocSlug(cat, slug) : undefined;

  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/admin/login" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("docs")
        .select("id, title, description, body_md")
        .eq("category", category).eq("slug", slug).maybeSingle();
      if (data) {
        setDocId(data.id);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setBody(data.body_md);
      } else {
        const seed = getSeedDoc(category, slug);
        if (seed) {
          setTitle(seed.title);
          setDescription(seed.description);
          setBody(seed.body_md);
        }
      }
    })();
  }, [category, slug]);

  const save = async () => {
    if (!cat || !sub) return;
    setSaving(true);
    try {
      const payload = {
        category, slug, subcategory: sub,
        title, description, body_md: body,
        author_id: user?.id,
      };
      let error;
      if (docId) {
        ({ error } = await supabase.from("docs").update(payload).eq("id", docId));
      } else {
        const ins = await supabase.from("docs").insert(payload).select("id").single();
        error = ins.error;
        if (ins.data) setDocId(ins.data.id);
      }
      if (error) throw error;
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${category}/${slug}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("doc-images").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("doc-images").getPublicUrl(path);
      const markdown = `\n\n![${file.name}](${data.publicUrl})\n`;
      setBody((prev) => prev + markdown);
      toast.success("Image uploaded — markdown inserted");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !isAdmin) {
    return <SiteShell><div className="p-8 text-sm text-muted-foreground">Loading…</div></SiteShell>;
  }
  if (!cat || !sub) {
    return <SiteShell><div className="p-8 text-sm">Invalid category/subcategory.</div></SiteShell>;
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              {cat.name} · {sub}
            </p>
            <h1 className="mt-0.5 text-xl font-semibold">Edit documentation</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent">
              ← Dashboard
            </Link>
            <button
              onClick={() => setPreview((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
            >
              <Eye className="h-3.5 w-3.5" /> {preview ? "Edit" : "Preview"}
            </button>
            <label className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent cursor-pointer">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              Upload image
              <input type="file" accept="image/*" hidden onChange={(e) => {
                const f = e.target.files?.[0]; if (f) uploadImage(f);
              }} />
            </label>
            <button
              onClick={save} disabled={saving}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-lg font-semibold outline-none focus:border-primary"
          />
          <input
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (shown in lists & meta)"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {preview ? (
          <div className="mt-4 rounded-lg border border-border bg-card p-6 max-h-[70vh] overflow-y-auto">
            <MarkdownDoc source={body} />
          </div>
        ) : (
          <textarea
            value={body} onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
            className="mt-4 h-[65vh] w-full rounded-md border border-input bg-background p-4 font-mono text-sm leading-relaxed outline-none focus:border-primary"
            placeholder="# Markdown body…"
          />
        )}

        <p className="mt-3 text-[11px] text-muted-foreground font-mono">
          Tip: <code>{`> **Note:** …`}</code> renders an info callout · <code>{`> **Warning:** …`}</code> renders a warning · fenced code blocks become terminal-style with copy buttons.
        </p>
      </div>
    </SiteShell>
  );
}
