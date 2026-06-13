import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { CATEGORIES, slugify } from "@/lib/docs-catalog";
import { useNavigate } from "@tanstack/react-router";

interface Entry {
  label: string;
  category: string;
  subcategory: string;
  href: string;
}

const ALL_ENTRIES: Entry[] = CATEGORIES.flatMap((c) =>
  c.subcategories.map((s) => ({
    label: `${c.name} · ${s}`,
    category: c.name,
    subcategory: s,
    href: `/docs/${c.slug}/${slugify(s)}`,
  })),
);

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: Props) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => { if (!open) setQ(""); }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return ALL_ENTRIES.slice(0, 12);
    const needle = q.toLowerCase();
    return ALL_ENTRIES.filter((e) => e.label.toLowerCase().includes(needle)).slice(0, 30);
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search docs… (e.g. VPC, Nginx, OSPF)"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline rounded border border-border bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">No matches.</li>
          )}
          {results.map((r) => (
            <li key={r.href}>
              <button
                onClick={() => { onOpenChange(false); navigate({ to: r.href }); }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent"
              >
                <span>{r.label}</span>
                <span className="text-xs text-muted-foreground">{r.href}</span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
