import { categories } from "@/app/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { notFound } from "next/navigation";

export default function ToolPage({
  params,
}: {
  params: { category: string; tool: string };
}) {
  const category = categories.find((c) => c.id === params.category);
  const tool = category?.tools.find((t) => t.id === params.tool);

  if (!category || !tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return (
    <ToolLayout
      title={tool.title}
      description={tool.description}
      information={tool.information}
      useCases={tool.useCases}
    >
      <ToolComponent />
    </ToolLayout>
  );
}
