import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/SiteShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownDoc, extractHeadings } from "@/components/MarkdownDoc";
import { TableOfContents } from "@/components/TableOfContents";
import { getCategory, findSubcategoryByDocSlug, slugify } from "@/lib/docs-catalog";
import { getSeedDoc } from "@/lib/seed-docs";
import { supabase } from "@/integrations/supabase/client";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/docs/$category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    const sub = findSubcategoryByDocSlug(cat, params.slug);
    if (!sub) throw notFound();
    return { categorySlug: cat.slug, subName: sub };
  },
  component: DocPage,
  notFoundComponent: () => (
    <SiteShell><div className="p-8 text-sm">Doc not found.</div></SiteShell>
  ),
});

function DocPage() {
  const { categorySlug, subName: sub } = Route.useLoaderData();
  const cat = getCategory(categorySlug)!;
  const { category, slug } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["doc", category, slug],
    queryFn: async () => {
      const { data: row } = await supabase
        .from("docs")
        .select("title, description, body_md, updated_at")
        .eq("category", category)
        .eq("slug", slug)
        .maybeSingle();
      if (row) return { ...row, source: "db" as const };
      const seed = getSeedDoc(category, slug);
      if (!seed) return null;
      return {
        title: seed.title,
        description: seed.description,
        body_md: seed.body_md,
        updated_at: null as string | null,
        source: "seed" as const,
      };
    },
  });

  const body = data?.body_md ?? "";
  const headings = extractHeadings(body);

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <article className="min-w-0 flex-1">
          <Breadcrumbs
            items={[
              { label: "Docs", to: "/" },
              { label: cat.name, to: `/docs/${cat.slug}` },
              { label: sub },
            ]}
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                {cat.name} · {sub}
              </p>
            </div>
            {data?.updated_at && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Updated {new Date(data.updated_at).toLocaleDateString()}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="mt-8 space-y-3">
              <div className="h-8 w-2/3 bg-accent animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-accent animate-pulse rounded" />
              <div className="h-32 w-full bg-accent animate-pulse rounded mt-6" />
            </div>
          ) : (
            <div className="mt-4">
              <MarkdownDoc source={body} />
            </div>
          )}
        </article>

        <TableOfContents headings={headings} />
      </div>
    </SiteShell>
  );
}
