"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { downloadUrls } from "@/lib/download";

interface SitemapResultsProps {
  extractedUrls: string[];
  isProcessing: boolean;
}

export default function SitemapResults({ 
  extractedUrls,
  isProcessing
}: SitemapResultsProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(extractedUrls.join("\n"))
      .then(() => {
        setCopied(true);
        toast.success("URLs copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy URLs");
      });
  };
  
  const handleDownload = () => {
    if (extractedUrls.length === 0) return;
    
    downloadUrls(extractedUrls);
    toast.success("URLs downloaded as text file");
  };
  
  if (isProcessing || extractedUrls.length === 0) return null;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Extracted URLs ({extractedUrls.length})</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? "Copied" : "Copy All"}
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          All URLs extracted from the sitemap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4 font-mono text-sm">
          <div className="space-y-1">
            {extractedUrls.map((url, index) => (
              <div key={index} className="break-all py-1 hover:bg-muted px-2 rounded">
                {url}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        URLs are sorted in the order they appeared in the sitemap
      </CardFooter>
    </Card>
  );
}