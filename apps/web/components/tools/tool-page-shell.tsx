import type { Tool } from "@converto/types";
import { getToolContent } from "@converto/data";
import { ToolJsonLd } from "@/components/seo/json-ld";
import { defaultLocale } from "@/lib/i18n/locales";

export interface ToolPageShellProps {
  tool: Tool;
  index: string;
  variant?: string;
  /** URL locale; drives the localized H1/description. Defaults to English. */
  locale?: string;
  children?: React.ReactNode;
}

export function ToolPageShell({
  tool,
  index,
  variant,
  locale = defaultLocale,
  children,
}: ToolPageShellProps) {
  const content = getToolContent(tool.slug, locale);
  const heading = content?.h1 ?? tool.name;
  const subhead = content?.description ?? tool.description;

  return (
    <article>
      {/* schema.org SoftwareApplication + BreadcrumbList for every tool. */}
      <ToolJsonLd slug={tool.slug} name={heading} description={subhead} />
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <span>Tool {index}</span>
        {variant && (
          <>
            <span className="text-border">/</span>
            <span>{variant}</span>
          </>
        )}
      </div>
      <div className="mt-3 grid items-end gap-3 lg:gap-8 lg:grid-cols-[1.4fr_1fr]">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          {heading}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">{subhead}</p>
      </div>
      <div className="mt-6 lg:mt-12">{children}</div>
    </article>
  );
}
