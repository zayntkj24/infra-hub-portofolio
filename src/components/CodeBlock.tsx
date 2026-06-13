import { useState, useRef } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface Props {
  code: string;
  language?: string;
  inline?: boolean;
  children?: React.ReactNode;
}

export function CodeBlock({ code, language, children }: Props) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? code;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="terminal-block group relative">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dots">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
          </div>
          <Terminal className="ml-2 h-3 w-3" />
          <span>{language || "shell"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre ref={preRef} className="terminal-body">
        <code className={language ? `hljs language-${language}` : "hljs"}>
          {children ?? code}
        </code>
      </pre>
    </div>
  );
}
