import { useState, useEffect, useRef } from "react";
import {
  Github, Mail, MessageCircle, Server, Music, Terminal, Award,
  ChevronDown, X, GraduationCap, Headphones, Mic2, Sliders,
  Wifi, Shield, Database, BookOpen, FileText,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

/* ══════════════════════════════════════════════
   CANVAS — hacker grid + synth waves + matrix rain
══════════════════════════════════════════════ */
function BgCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let t = 0;

    // Matrix rain columns
    const FONT_SIZE = 13;
    const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/\\|[]{}#$%@!";
    let cols: number[] = [];
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = [];
      drops = [];
      const numCols = Math.floor(canvas.width / FONT_SIZE);
      for (let i = 0; i < numCols; i++) {
        cols.push(i);
        drops.push(Math.random() * -100);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.006;
      const { width: W, height: H } = canvas;

      // Fade overlay for trail effect
      ctx.fillStyle = "rgba(8, 12, 18, 0.18)";
      ctx.fillRect(0, 0, W, H);

      // ── Matrix rain ──
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        // Head glow
        const alpha = Math.random() > 0.95 ? 1 : 0.15 + Math.random() * 0.25;
        const isHead = drops[i] > 0 && Math.random() > 0.92;
        ctx.fillStyle = isHead
          ? `rgba(180,255,200,${alpha})`
          : `rgba(0,200,80,${alpha * 0.6})`;
        ctx.fillText(char, x, y);

        if (y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.4 + Math.random() * 0.3;
      }

      // ── Horizontal grid lines (very subtle) ──
      ctx.strokeStyle = "rgba(0,200,80,0.03)";
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // ── Synth wave lines ──
      const waves = [
        { amp: 50, freq: 0.007, phase: 0,           color: [80, 220, 130],  alpha: 0.22 },
        { amp: 35, freq: 0.011, phase: Math.PI*0.7,  color: [60, 160, 255],  alpha: 0.14 },
        { amp: 65, freq: 0.004, phase: Math.PI*1.4,  color: [160, 80, 255],  alpha: 0.09 },
      ];
      waves.forEach(({ amp, freq, phase, color, alpha }) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= W; x += 3) {
          const y = H * 0.5 + Math.sin(x * freq + t + phase) * amp
                    + Math.sin(x * freq * 2.3 + t * 1.7) * amp * 0.3;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // ── Floating green dots ──
      for (let i = 0; i < 25; i++) {
        const px = (Math.sin(t * 0.25 + i * 137.508) * 0.5 + 0.5) * W;
        const py = (Math.cos(t * 0.18 + i * 97.3) * 0.5 + 0.5) * H;
        const a = (Math.sin(t * 1.2 + i) * 0.5 + 0.5) * 0.35;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,220,90,${a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

/* ══════════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════════ */
function Typewriter({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = texts[idx];
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }
  }, [displayed, deleting, idx, texts]);

  return (
    <span style={{ color: "oklch(0.78 0.16 155)" }}>
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  );
}

/* ══════════════════════════════════════════════
   SCROLL-REVEAL WRAPPER
══════════════════════════════════════════════ */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CERT MODAL with iframe
══════════════════════════════════════════════ */
function CertModal({ cert, onClose }: { cert: { title: string; file: string } | null; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [cert?.file]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  if (!cert) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: "oklch(0.11 0.012 250)",
          border: "1px solid oklch(0.78 0.16 155 / 0.35)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* title bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid oklch(0.25 0.012 250)", background: "oklch(0.13 0.012 250)" }}
        >
          <div className="flex gap-1.5">
            {["#ff5f57","#febc2e","#28c840"].map(c => (
              <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="font-mono text-xs flex-1 text-center" style={{ color: "oklch(0.78 0.16 155)" }}>
            {cert.title}
          </span>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-md"
            style={{ color: "oklch(0.6 0.012 250)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* iframe — scrollable wrapper, native PDF aspect ratio */}
        <div className="overflow-y-auto" style={{ maxHeight: "82dvh" }}>
          <div className="relative w-full" style={{ aspectRatio: "210/297" }}>
            {!loaded && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{ background: "oklch(0.11 0.012 250)" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "9999px",
                    border: "3px solid oklch(0.78 0.16 155 / 0.15)",
                    borderTopColor: "oklch(0.78 0.16 155)",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p className="font-mono text-xs" style={{ color: "oklch(0.55 0.012 250)" }}>
                  loading pdf...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            <iframe
              src={cert.file}
              className="absolute inset-0 w-full h-full"
              title={cert.title}
              style={{
                border: "none",
                background: "#fff",
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
              onLoad={() => setLoaded(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const SKILLS = [
  { label: "Linux Server",     icon: Server,    level: 90, cat: "infra" },
  { label: "Sysadmin",         icon: Terminal,  level: 88, cat: "infra" },
  { label: "Network (MikroTik/Cisco)", icon: Wifi, level: 82, cat: "infra" },
  { label: "Docker & VPS",     icon: Database,  level: 78, cat: "infra" },
];

const CERTS = [
  {
    title: "Cyber Security",
    issuer: "Sertifikasi",
    file: "https://cdn.jsdelivr.net/gh/zayntkj24/infra-hub-portofolio@main/public/certs/cyber.pdf",
    year: "2024",
  },
  {
    title: "Cyber Essentials",
    issuer: "Sertifikasi",
    file: "https://cdn.jsdelivr.net/gh/zayntkj24/infra-hub-portofolio@main/public/certs/cybesessential.pdf",
    year: "2024",
  },
];

const CV = [
  {
    file: "https://cdn.jsdelivr.net/gh/zayntkj24/infra-hub-portofolio@main/public/cv/nandacv.pdf",
    title: "Curriculum Vitae",
  },
];

const STACK = [
  "Linux","Ubuntu Server","Debian","CentOS",
  "Nginx","Apache","Docker","SSH",
  "MikroTik","Cisco IOS","AWS","Bash","Git",
];

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export function PortfolioPage() {
  const [activeCert, setActiveCert] = useState<{ title: string; file: string } | null>(null);
  const [activeCv, setActiveCv] = useState<{ title: string; file: string } | null>(null);

  // smooth scroll
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, []);

  return (
    <div
      className="relative text-white overflow-x-hidden"
      style={{ background: "oklch(0.08 0.012 250)", minHeight: "100svh" }}
    >
      <BgCanvas />

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14"
        style={{
          background: "oklch(0.08 0.012 250 / 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.22 0.012 250)",
        }}
      >
        <span className="font-mono text-xs" style={{ color: "oklch(0.78 0.16 155)" }}>
          ~/nanda<span className="animate-pulse">▋</span>
        </span>
        <div className="hidden sm:flex items-center gap-1">
          {["#skills","#education","#cv","#certificates","#stack","#contact"].map(h => (
            <a
              key={h}
              href={h}
              className="px-3 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5"
              style={{ color: "oklch(0.68 0.012 250)" }}
            >
              {h.slice(1)}
            </a>
          ))}
        </div>
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-all hover:bg-white/5 hover:-translate-y-0.5"
          style={{
            borderColor: "oklch(0.78 0.16 155 / 0.35)",
            color: "oklch(0.78 0.16 155)",
          }}
        >
          <BookOpen className="h-3.5 w-3.5" /> Docs
        </Link>
      </nav>

      {/* ══ HERO ══ */}
      <section
        id="hero"
        className="relative z-10 flex items-center justify-center px-5 pt-14"
        style={{ minHeight: "100svh" }}
      >
        <div className="mx-auto w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-20">

          {/* ── Photo / Avatar ── */}
          <div className="shrink-0 flex flex-col items-center gap-4">
            <div
              className="relative"
              style={{
                filter: "drop-shadow(0 0 28px oklch(0.78 0.16 155 / 0.35))",
              }}
            >
              {/* glow ring */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: "conic-gradient(from 0deg, oklch(0.78 0.16 155/0.4), oklch(0.55 0.18 200/0.2), oklch(0.78 0.16 155/0.4))",
                  transform: "scale(1.08)",
                  borderRadius: "9999px",
                }}
              />
              <div
                className="relative overflow-hidden"
                style={{
                  width: 168,
                  height: 168,
                  borderRadius: "9999px",
                  border: "2px solid oklch(0.78 0.16 155 / 0.6)",
                  background: "oklch(0.13 0.015 250)",
                }}
              >
                {/* Try to load photo from /src/public, fallback to Terminal icon */}
                <img
                  src="/nandafoto.png"
                  alt="Nanda Khalif Akbar"
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.removeAttribute("style");
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  <Terminal className="h-16 w-16" style={{ color: "oklch(0.78 0.16 155)" }} />
                </div>
              </div>
            </div>

            {/* status badge */}
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px]"
              style={{
                background: "oklch(0.78 0.16 155 / 0.08)",
                border: "1px solid oklch(0.78 0.16 155 / 0.25)",
                color: "oklch(0.78 0.16 155)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: "oklch(0.78 0.16 155)" }}
              />
              Available for work
            </div>
          </div>

          {/* ── Text ── */}
          <div className="flex-1 text-center lg:text-left">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.78 0.16 155)" }}
            >
              // whoami
            </p>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-none">
              Nanda<br />
              <span style={{ color: "oklch(0.78 0.16 155)" }}>Khalif</span> Akbar
            </h1>

            <div className="mt-4 h-7 text-lg sm:text-xl font-mono">
              <Typewriter texts={["Sysadmin", "Linux Engineer", "Network Engineer", "SysOps",]} />
            </div>

            <p
              className="mt-5 max-w-lg text-sm leading-relaxed mx-auto lg:mx-0"
              style={{ color: "oklch(0.68 0.012 250)" }}
            >
              Connected, Skilled, Resilient – ​​That's TJKT!
              Network Kids, Ready to Connect to the Future!
              Network Management Experts, Ready to Connect the World Without Borders.
              Be like a motherboard, strong in assembling all the components of life.
              Wikrama for Indonesia
            </p>

            {/* role badges */}
            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-2">
              {[
                { label: "Sysadmin",  icon: Shield },
              ].map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono"
                  style={{
                    borderColor: "oklch(0.78 0.16 155 / 0.35)",
                    color: "oklch(0.78 0.16 155)",
                    background: "oklch(0.78 0.16 155 / 0.07)",
                  }}
                >
                  <Icon className="h-3 w-3" /> {label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.78 0.16 155)",
                  color: "oklch(0.10 0.02 155)",
                  boxShadow: "0 0 20px oklch(0.78 0.16 155 / 0.3)",
                }}
              >
                <MessageCircle className="h-4 w-4" /> Contact Me
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/5 hover:-translate-y-0.5"
                style={{
                  borderColor: "oklch(0.78 0.16 155 / 0.4)",
                  color: "oklch(0.78 0.16 155)",
                }}
              >
                <BookOpen className="h-4 w-4" /> Back to Documentation
              </Link>
              <a
                href="#skills"
                className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/5"
                style={{
                  borderColor: "oklch(0.35 0.012 250)",
                  color: "oklch(0.88 0.005 250)",
                }}
              >
                Explore <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1"
          style={{ color: "oklch(0.45 0.012 250)" }}
        >
          <span className="font-mono text-[10px]">scroll</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills" className="relative z-10 px-5 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeader label="keahlian" title="Skills & Expertise" />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {SKILLS.map(({ label, icon: Icon, level, cat }, i) => (
              <Reveal key={label} delay={i * 60}>
                <div
                  className="rounded-xl border p-5 transition-all hover:-translate-y-0.5"
                  style={{
                    background: "oklch(0.12 0.012 250)",
                    borderColor: cat === "infra"
                      ? "oklch(0.78 0.16 155 / 0.2)"
                      : "oklch(0.65 0.18 280 / 0.2)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                      style={{
                        background: cat === "infra"
                          ? "oklch(0.78 0.16 155 / 0.1)"
                          : "oklch(0.65 0.18 280 / 0.1)",
                        border: `1px solid ${cat === "infra" ? "oklch(0.78 0.16 155/0.25)" : "oklch(0.65 0.18 280/0.25)"}`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: cat === "infra" ? "oklch(0.78 0.16 155)" : "oklch(0.75 0.18 280)" }} />
                    </div>
                    <span className="font-medium text-sm flex-1">{label}</span>
                    <span
                      className="font-mono text-xs tabular-nums"
                      style={{ color: cat === "infra" ? "oklch(0.78 0.16 155)" : "oklch(0.75 0.18 280)" }}
                    >
                      {level}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.2 0.012 250)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${level}%`,
                        background: cat === "infra"
                          ? "linear-gradient(90deg, oklch(0.78 0.16 155), oklch(0.60 0.16 175))"
                          : "linear-gradient(90deg, oklch(0.65 0.18 280), oklch(0.55 0.20 310))",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EDUCATION ══ */}
      <section id="education" className="relative z-10 px-5 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeader label="pendidikan" title="Education" />
          </Reveal>
          <Reveal delay={120}>
            <div
              className="mt-10 rounded-xl border p-6 flex items-start gap-5 transition-all hover:-translate-y-0.5"
              style={{
                background: "oklch(0.12 0.012 250)",
                borderColor: "oklch(0.78 0.16 155 / 0.2)",
                boxShadow: "0 0 40px oklch(0.78 0.16 155 / 0.05)",
              }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "oklch(0.78 0.16 155 / 0.1)",
                  border: "1px solid oklch(0.78 0.16 155 / 0.25)",
                }}
              >
                <GraduationCap className="h-7 w-7" style={{ color: "oklch(0.78 0.16 155)" }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-bold text-lg">SMK WIKRAMA BOGOR</p>
                  <span
                    className="rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
                    style={{
                      borderColor: "oklch(0.78 0.16 155 / 0.3)",
                      color: "oklch(0.78 0.16 155)",
                    }}
                  >
                    Student ✓
                  </span>
                </div>
                <p className="text-sm mt-1.5" style={{ color: "oklch(0.65 0.012 250)" }}>
                  Teknik Jaringan Komputer dan Telekomunikasi
                </p>
                <p className="text-xs mt-3 font-mono" style={{ color: "oklch(0.55 0.012 250)" }}>
                  $ cat /etc/education | grep "SMK WIKRAMA BOGOR"
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

{/* ══ CV ══ */}
<section id="cv" className="relative z-10 px-5 py-24">
  <div className="mx-auto max-w-4xl">

    <Reveal>
      <SectionHeader label="curriculum vitae" title="My CV" />
    </Reveal>

    <div className="mt-10">
      {CV.map((cv) => (
        <Reveal key={cv.file}>
          <div
            className="rounded-xl border p-6 flex items-start justify-between gap-5 transition-all hover:-translate-y-0.5"
            style={{
              background: "oklch(0.12 0.012 250)",
              borderColor: "oklch(0.78 0.16 155 / 0.2)",
              boxShadow: "0 0 40px oklch(0.78 0.16 155 / 0.05)",
            }}
          >

            {/* ICON */}
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "oklch(0.78 0.16 155 / 0.1)",
                border: "1px solid oklch(0.78 0.16 155 / 0.25)",
              }}
            >
              <FileText className="h-7 w-7" style={{ color: "oklch(0.78 0.16 155)" }} />
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-bold text-lg">{cv.title}</p>

                <span
                  className="rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
                  style={{
                    borderColor: "oklch(0.78 0.16 155 / 0.3)",
                    color: "oklch(0.78 0.16 155)",
                  }}
                >
                  Available ✓
                </span>
              </div>

              <p
                className="text-sm mt-1.5"
                style={{ color: "oklch(0.65 0.012 250)" }}
              >
                Sysadmin • Network Engineering • Infrastructure
              </p>

              <p
                className="text-xs mt-3 font-mono"
                style={{ color: "oklch(0.55 0.012 250)" }}
              >
                $ curl cv.nandacv.pdf | grep "PROFILE"
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveCv(cv)}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: "oklch(0.78 0.16 155)",
                  color: "oklch(0.10 0.02 155)",
                }}
              >
                View CV
              </button>

              <a
                href={cv.file}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border text-sm font-semibold text-center"
                style={{
                  borderColor: "oklch(0.78 0.16 155 / 0.35)",
                  color: "oklch(0.78 0.16 155)",
                }}
              >
                Download
              </a>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>

      {/* ══ CERTIFICATES ══ */}
      <section id="certificates" className="relative z-10 px-5 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeader label="sertifikat" title="Certificates" />
          </Reveal>

          {CERTS.length === 0 ? (
            <Reveal delay={100}>
              <div
                className="mt-10 rounded-xl border border-dashed p-12 text-center"
                style={{ borderColor: "oklch(0.30 0.012 250)", color: "oklch(0.5 0.012 250)" }}
              >
                <Award className="mx-auto h-12 w-12 mb-4 opacity-30" />
                <p className="text-sm mb-1">Sertifikat belum ditambahkan.</p>
                <p className="font-mono text-xs opacity-70">
                  Taruh PDF di <code className="bg-white/5 rounded px-1">/public/certs/</code> &amp; isi array{" "}
                  <code className="bg-white/5 rounded px-1">CERTS</code>
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {CERTS.map((cert, i) => (
                <Reveal key={cert.file} delay={i * 80}>
                  <button
                    onClick={() => setActiveCert({ title: cert.title, file: cert.file })}
                    className="w-full text-left rounded-xl border p-5 transition-all hover:-translate-y-1 group"
                    style={{
                      background: "oklch(0.12 0.012 250)",
                      borderColor: "oklch(0.27 0.012 250)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-lg"
                        style={{
                          background: "oklch(0.78 0.16 155 / 0.1)",
                          border: "1px solid oklch(0.78 0.16 155 / 0.2)",
                        }}
                      >
                        <Award className="h-5 w-5" style={{ color: "oklch(0.78 0.16 155)" }} />
                      </div>
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          borderColor: "oklch(0.78 0.16 155 / 0.3)",
                          color: "oklch(0.78 0.16 155)",
                        }}
                      >
                        lihat →
                      </span>
                    </div>
                    <p className="font-semibold text-sm">{cert.title}</p>
                    <p className="mt-1 text-xs" style={{ color: "oklch(0.65 0.012 250)" }}>
                      {cert.issuer} · {cert.year}
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ STACK ══ */}
      <section id="stack" className="relative z-10 px-5 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeader label="teknologi" title="Tech Stack" />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap gap-2">
              {STACK.map((tag, i) => (
                <span
                  key={tag}
                  className="rounded-lg border px-3 py-1.5 font-mono text-xs transition-all hover:-translate-y-0.5 hover:border-[oklch(0.78_0.16_155/0.5)] cursor-default"
                  style={{
                    background: "oklch(0.14 0.012 250)",
                    borderColor: "oklch(0.28 0.012 250)",
                    color: i < 13 ? "oklch(0.80 0.16 155)" : "oklch(0.75 0.18 280)",
                    animationDelay: `${i * 30}ms`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="relative z-10 px-5 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeader label="kontak" title="Contact Me" />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: <MessageCircle className="h-5 w-5" />,
                label: "WhatsApp",
                value: "+62-853-5208-5104",
                href: "https://wa.me/+6285352085104",
                delay: 0,
              },
              {
                icon: <Mail className="h-5 w-5" />,
                label: "Email",
                value: "ndazzz2408@gmail.com",
                href: "mailto:ndazzz2408@gmail.com",
                delay: 80,
              },
              {
                icon: <Github className="h-5 w-5" />,
                label: "GitHub",
                value: "github.com/zayntkj24",
                href: "https://github.com/zayntkj24",
                delay: 160,
              },
            ].map(({ icon, label, value, href, delay }) => (
              <Reveal key={label} delay={delay}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-4 rounded-xl border p-5 transition-all hover:-translate-y-1"
                  style={{
                    background: "oklch(0.12 0.012 250)",
                    borderColor: "oklch(0.27 0.012 250)",
                    boxShadow: "0 0 0 0 oklch(0.78 0.16 155/0)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.78 0.16 155 / 0.45)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px oklch(0.78 0.16 155/0.1)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.27 0.012 250)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: "oklch(0.78 0.16 155 / 0.1)",
                      border: "1px solid oklch(0.78 0.16 155 / 0.2)",
                      color: "oklch(0.78 0.16 155)",
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "oklch(0.55 0.012 250)" }}>
                      {label}
                    </p>
                    <p className="text-sm font-medium break-all">{value}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        className="relative z-10 px-5 py-8 text-center"
        style={{ borderTop: "1px solid oklch(0.18 0.012 250)" }}
      >
        <p className="font-mono text-xs" style={{ color: "oklch(0.45 0.012 250)" }}>
          © {new Date().getFullYear()} <span style={{ color: "oklch(0.78 0.16 155)" }}>Nanda Khalif Akbar</span> — crafted with{" "}
          <span style={{ color: "oklch(0.78 0.16 155)" }}>♥</span> &amp; lots of{" "}
          <span style={{ color: "oklch(0.78 0.16 155)" }}>caffeine</span>
        </p>
        <p className="font-mono text-[10px] mt-1" style={{ color: "oklch(0.35 0.012 250)" }}>
          sysadmin · composer · producer
        </p>
      </footer>

      <CertModal
  cert={activeCert}
  onClose={() => setActiveCert(null)}
/>

<CertModal
  cert={activeCv}
  onClose={() => setActiveCv(null)}
/>
    </div>
  );
}

/* ─── Section Header helper ─────────────────────── */
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-2" style={{ color: "oklch(0.78 0.16 155)" }}>
        // {label}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      <div className="mt-3 h-px w-20" style={{ background: "linear-gradient(90deg, oklch(0.78 0.16 155 / 0.6), transparent)" }} />
    </div>
  );
  }
