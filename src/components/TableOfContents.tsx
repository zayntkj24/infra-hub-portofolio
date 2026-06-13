import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20">
        <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          On this page
        </p>
        <ul className="space-y-1 border-l border-border">
          {headings.map((h) => (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? 16 : 8 }}>
              <a
                href={`#${h.id}`}
                className={cn(
                  "-ml-px block border-l border-transparent pl-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
                  active === h.id && "border-primary text-primary font-medium",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
