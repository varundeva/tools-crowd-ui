import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ToolLayoutProps {
  title: string;
  description: string;
  information: string;
  useCases: string[];
  children: React.ReactNode;
}

export function ToolLayout({
  title,
  description,
  information,
  useCases,
  children,
}: ToolLayoutProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-xl text-muted-foreground">{description}</p>
      </div>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>About this Tool</CardTitle>
          <CardDescription>{information}</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Common Use Cases:</h3>
          <ul className="list-disc list-inside space-y-1">
            {useCases.map((useCase, index) => (
              <li key={index}>{useCase}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Try it Out</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
