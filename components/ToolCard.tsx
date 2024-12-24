import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
}

export function ToolCard({ title, description, href }: ToolCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md dark:hover:shadow-white/10 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
