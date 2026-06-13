import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, BookOpen } from "lucide-react";
import { CATEGORIES, slugify } from "@/lib/docs-catalog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  onNavigate?: () => void;
}

export function DocsSidebar({ onNavigate }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeCategory = CATEGORIES.find((c) => pathname.startsWith(`/docs/${c.slug}`));

  const [openSlug, setOpenSlug] = useState<string | null>(activeCategory?.slug ?? null);
  const toggle = (slug: string) => setOpenSlug((prev) => (prev === slug ? null : slug));

  return (
    <nav className="flex h-full flex-col gap-1 p-3 text-sm">
      <Link
        to="/"
        onClick={onNavigate}
        className="mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <BookOpen className="h-4 w-4 text-primary" />
        <span className="font-medium">All categories</span>
      </Link>
      {CATEGORIES.map((cat) => {
        const isOpen = openSlug === cat.slug;
        return (
          <div key={cat.slug} className="flex flex-col">
            <button
              onClick={() => toggle(cat.slug)}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sidebar-foreground hover:bg-sidebar-accent",
                activeCategory?.slug === cat.slug && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <span className="font-medium tracking-tight">{cat.name}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Smooth accordion */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? `${cat.subcategories.length * 32}px` : "0px" }}
            >
              <ul className="ml-2 mt-0.5 border-l border-sidebar-border pl-2 pb-1">
                {cat.subcategories.map((sub) => {
                  const to = `/docs/${cat.slug}/${slugify(sub)}`;
                  const active = pathname === to;
                  return (
                    <li key={sub}>
                      <Link
                        to={to}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                          active && "bg-primary/10 text-primary font-medium",
                        )}
                      >
                        {sub}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}