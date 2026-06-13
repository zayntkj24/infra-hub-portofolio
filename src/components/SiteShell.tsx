import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, X, Github, Terminal, User } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";
import { SearchDialog } from "./SearchDialog";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export function SiteShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
              <Terminal className="h-3.5 w-3.5 text-primary" />
            </span>
            <span className="font-semibold tracking-tight">Infra Hub</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-1">
              v1.0
            </span>
          </Link>
          <div className="flex-1" />
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent w-full max-w-[280px]"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search docs…</span>
            <kbd className="hidden md:inline rounded border border-border bg-background px-1.5 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </button>
          <Link
            to="/portfolio"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:bg-accent"
          >
            <User className="h-3.5 w-3.5 text-primary" />
            Portfolio
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent text-muted-foreground"
            aria-label="Source"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden lg:flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all",
            sidebarCollapsed ? "w-0 overflow-hidden" : "w-64",
          )}
        >
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <DocsSidebar />
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-sidebar-border bg-sidebar overflow-y-auto">
              <div className="flex h-14 items-center justify-between px-3 border-b border-sidebar-border">
                <span className="text-sm font-semibold">Browse</span>
                <button onClick={() => setMobileOpen(false)} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-sidebar-accent">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <DocsSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="hidden lg:flex border-b border-border px-4 py-1.5">
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {sidebarCollapsed ? "» Show sidebar" : "« Hide sidebar"}
            </button>
          </div>
          {children}
        </main>
      </div>

      <footer className="border-t border-border bg-card/50">
        <div className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Built by <span className="text-foreground font-medium">Nanda Khalif Akbar</span></span>
          <span className="font-mono">infra-hub · {new Date().getFullYear()}</span>
        </div>
      </footer>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
