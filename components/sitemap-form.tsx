"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Link, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { parseSitemap } from "@/lib/sitemap-parser";

interface SitemapFormProps {
  setExtractedUrls: (urls: string[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  progress: { current: number; total: number };
  setProgress: (progress: { current: number; total: number }) => void;
}

export default function SitemapForm({
  setExtractedUrls,
  isProcessing,
  setIsProcessing,
  progress,
  setProgress,
}: SitemapFormProps) {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [dragActive, setDragActive] = useState(false);
  
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sitemapUrl) {
      toast.error("Please enter a sitemap URL");
      return;
    }
    
    try {
      setIsProcessing(true);
      setExtractedUrls([]);
      
      try {
        new URL(sitemapUrl);
      } catch (error) {
        toast.error("Please enter a valid URL");
        setIsProcessing(false);
        return;
      }
      
      const urls = await parseSitemap(sitemapUrl, setProgress);
      setExtractedUrls(urls);
      
      if (urls.length === 0) {
        toast.warning("No URLs found in the sitemap");
      } else {
        toast.success(`Successfully extracted ${urls.length} URLs`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process sitemap. Please check the URL and try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xml')) {
      toast.error("Please upload an XML file");
      return;
    }
    
    try {
      setIsProcessing(true);
      setExtractedUrls([]);
      
      const text = await file.text();
      const urls = await parseSitemap(null, setProgress, text);
      setExtractedUrls(urls);
      
      if (urls.length === 0) {
        toast.warning("No URLs found in the sitemap");
      } else {
        toast.success(`Successfully extracted ${urls.length} URLs`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process sitemap file. Please check the file and try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">XML Sitemap URL Downloader</CardTitle>
        <CardDescription>
          Extract all URLs from an XML sitemap and download them as a text file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="url">
              <Link className="h-4 w-4 mr-2" />
              Enter URL
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sitemap-url">Sitemap URL</Label>
                <Input
                  id="sitemap-url"
                  placeholder="https://example.com/sitemap.xml"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  disabled={isProcessing}
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isProcessing || !sitemapUrl}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Extract URLs"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sitemap-file">Upload Sitemap XML File</Label>
              <div 
                className={`flex items-center justify-center w-full ${
                  dragActive ? "border-primary" : ""
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <label
                  htmlFor="sitemap-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">XML file only</p>
                  </div>
                  <Input
                    id="sitemap-file"
                    type="file"
                    accept=".xml"
                    disabled={isProcessing}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isProcessing && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing sitemap</span>
              {progress.total > 0 && (
                <span>
                  {progress.current} of {progress.total}
                </span>
              )}
            </div>
            <Progress value={progress.total ? (progress.current / progress.total) * 100 : undefined} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}