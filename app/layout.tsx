import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Wrench } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Web Tools Application",
  description: "A collection of useful web tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <header className="border-b">
              <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold flex items-center gap-1"
                >
                  <Wrench />
                  Tools Crowd
                </Link>
                <nav className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-sm font-medium hover:underline"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium hover:underline"
                  >
                    About
                  </Link>
                  <ModeToggle />
                </nav>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t">
              <div className="container mx-auto px-4 py-2 text-center text-sm">
                © 2024 Tools Crowd. All rights reserved.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
