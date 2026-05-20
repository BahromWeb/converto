import type { Tool } from "@converto/types";

export interface ToolPageShellProps {
  tool: Tool;
  index: string;
  variant?: string;
  children?: React.ReactNode;
}

export function ToolPageShell({ tool, index, variant, children }: ToolPageShellProps) {
  return (
    <article>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <span>Tool {index}</span>
        {variant && (
          <>
            <span className="text-border">/</span>
            <span>{variant}</span>
          </>
        )}
      </div>
      <div className="mt-4 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
        <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-6xl">
          {tool.name}
        </h1>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </div>
      <div className="mt-12">{children}</div>
    </article>
  );
}
