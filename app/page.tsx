"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import SitemapForm from "@/components/sitemap-form";
import SitemapResults from "@/components/sitemap-results";
import AppHeader from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [extractedUrls, setExtractedUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <SitemapForm 
              setExtractedUrls={setExtractedUrls}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              progress={progress}
              setProgress={setProgress}
            />
            
            <SitemapResults 
              extractedUrls={extractedUrls}
              isProcessing={isProcessing}
            />
          </div>
        </main>
        <footer className="py-6 border-t">
          <div className="container max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} XML Sitemap URL Downloader
          </div>
        </footer>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}