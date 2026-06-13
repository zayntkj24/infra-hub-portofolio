import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
        <Home className="h-3 w-3" /> Home
      </Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {c.to ? (
            <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
          ) : (
            <span className="text-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
