"use client";

import { Download, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="border-b">
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Download className="h-6 w-6" />
          <h1 className="text-xl font-bold">XML Sitemap Downloader</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}