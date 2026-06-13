import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCategory, slugify } from "@/lib/docs-catalog";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/docs/$category/")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { categorySlug: cat.slug };
  },
  component: CategoryIndex,
  notFoundComponent: () => (
    <SiteShell><div className="p-8">Unknown category.</div></SiteShell>
  ),
});

function CategoryIndex() {
  const { categorySlug } = Route.useLoaderData();
  const cat = getCategory(categorySlug)!;
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Breadcrumbs items={[{ label: "Docs", to: "/" }, { label: cat.name }]} />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{cat.name}</h1>
        <p className="mt-1 text-muted-foreground">{cat.tagline}</p>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {cat.subcategories.map((sub) => (
            <li key={sub}>
              <Link
                to="/docs/$category/$slug"
                params={{ category: cat.slug, slug: slugify(sub) }}
                className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm hover:border-primary/50 hover:bg-accent"
              >
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="flex-1 min-w-0">{sub}</span>
                <span className="text-[10px] font-mono text-muted-foreground">/{slugify(sub)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}
