import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CodeBlock } from "./CodeBlock";
import { AlertTriangle, Info } from "lucide-react";

interface Props {
  source: string;
}

export function MarkdownDoc({ source }: Props) {
  return (
    <div className="doc-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          h1: ({ node, ...props }) => <h1 id={slugifyText(props.children)} {...props} />,
          h2: ({ node, ...props }) => <h2 id={slugifyText(props.children)} {...props} />,
          h3: ({ node, ...props }) => <h3 id={slugifyText(props.children)} {...props} />,
          img: ({ node, alt, src, ...props }) => (
            <figure className="my-4">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={src} alt={alt || ""} loading="lazy" {...props} />
              {alt && (
                <figcaption className="mt-1 text-xs text-muted-foreground text-center italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          blockquote: ({ node, children, ...props }) => {
            const text = extractText(children);
            const isWarn = /^\s*\**warning/i.test(text);
            const isNote = /^\s*\**note/i.test(text);
            if (isWarn) {
              return (
                <div className="my-4 flex gap-3 rounded-md border border-warning/40 bg-warning/10 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div className="text-sm">{children}</div>
                </div>
              );
            }
            if (isNote) {
              return (
                <div className="my-4 flex gap-3 rounded-md border border-info/40 bg-info/10 p-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                  <div className="text-sm">{children}</div>
                </div>
              );
            }
            return <blockquote {...props}>{children}</blockquote>;
          },
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className;
            if (isInline) {
              return <code className={className} {...props}>{children}</code>;
            }
            const lang = /language-(\w+)/.exec(className || "")?.[1];
            const raw = String(children).replace(/\n$/, "");
            return (
              <CodeBlock code={raw} language={lang}>
                <span className={className}>{children}</span>
              </CodeBlock>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in (children as any)) {
    return extractText((children as any).props.children);
  }
  return "";
}

function slugifyText(children: React.ReactNode): string {
  return extractText(children)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractHeadings(md: string): { id: string; text: string; level: number }[] {
  const lines = md.split("\n");
  const out: { id: string; text: string; level: number }[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[#*`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      out.push({ id, text, level });
    }
  }
  return out;
}
