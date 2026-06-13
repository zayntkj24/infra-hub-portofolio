import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { CATEGORIES, slugify } from "@/lib/docs-catalog";
import { ArrowRight, Cloud, Server, Wifi, Network } from "lucide-react";

const ICONS = { aws: Cloud, linux: Server, mikrotik: Wifi, cisco: Network } as const;

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">// infra-hub</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
            Infrastructure docs for sysadmins & cloud engineers.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Practical, command-first reference covering AWS cloud, Linux servers, Mikrotik RouterOS, and Cisco IOS.
            No fluff — just the steps, the commands, and the gotchas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/docs/$category/$slug"
              params={{ category: "aws", slug: slugify("VPC") }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Documentation <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.slug];
            return (
              <Link
                key={cat.slug}
                to="/docs/$category"
                params={{ category: cat.slug }}
                className="group rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold tracking-tight">{cat.name}</h2>
                      <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
                        {cat.subcategories.length} topics
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{cat.tagline}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {cat.subcategories.slice(0, 6).map((s) => (
                        <li key={s} className="text-[11px] font-mono rounded bg-accent/60 border border-border px-1.5 py-0.5 text-muted-foreground">
                          {s}
                        </li>
                      ))}
                      {cat.subcategories.length > 6 && (
                        <li className="text-[11px] font-mono text-muted-foreground">+{cat.subcategories.length - 6} more</li>
                      )}
                    </ul>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
