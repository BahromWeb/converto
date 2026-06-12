import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Topbar } from "@/components/layout/topbar";
import { ToolManagementCard } from "@/components/tools/tool-management-card";
import { mockToolUsage, tools } from "@converto/data";
import type { ToolCategory } from "@converto/types";

export const metadata: Metadata = { title: "Tools" };

const categoryOrder: ToolCategory[] = ["organize", "convert", "edit", "secure", "ai"];

const categoryMeta: Record<ToolCategory, { label: string; count?: number }> = {
  organize: { label: "Organize" },
  convert: { label: "Convert" },
  edit: { label: "Edit" },
  secure: { label: "Secure" },
  ai: { label: "AI" },
  career: { label: "Career" },
};

export default function ToolsPage() {
  return (
    <>
      <Topbar
        title="Tools"
        description={`${tools.length} tools — enable, disable, or feature.`}
        crumbs={["Operations", "Tools"]}
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New tool
          </Button>
        }
      />

      <div className="space-y-10 p-8">
        {categoryOrder.map((category) => {
          const inCategory = tools.filter((t) => t.category === category);
          if (inCategory.length === 0) return null;
          const meta = categoryMeta[category];

          return (
            <section key={category}>
              {/* Category header */}
              <div className="mb-5 flex items-center gap-3 border-b border-border pb-3">
                <h2 className="text-lg font-bold text-foreground">{meta.label}</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {inCategory.length} tool{inCategory.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inCategory.map((tool) => (
                  <ToolManagementCard
                    key={tool.slug}
                    tool={tool}
                    usage={mockToolUsage[tool.slug] ?? 0}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
