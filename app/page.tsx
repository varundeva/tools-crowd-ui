import { categories } from "./config/tools";
import { ToolCard } from "@/components/ToolCard";

export default function Home() {
  return (
    <div className="space-y-12 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-8">Tools Crowd</h1>
      {categories.map((category, categoryIndex) => (
        <div key={category.id} className="space-y-6">
          <h2 className="text-3xl font-semibold">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.tools.map((tool, toolIndex) => (
              <div
                key={tool.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${categoryIndex * 0.1 + toolIndex * 0.1}s`,
                }}
              >
                <ToolCard
                  title={tool.title}
                  description={tool.description}
                  href={`/${category.id}/${tool.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
