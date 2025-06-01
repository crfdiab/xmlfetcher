type ProgressSetter = (progress: { current: number; total: number }) => void;

export async function parseSitemap(
  url: string | null,
  setProgress: ProgressSetter,
  xmlContent?: string
): Promise<string[]> {
  let allUrls: string[] = [];
  
  try {
    let xml: string;
    if (xmlContent) {
      xml = xmlContent;
    } else if (url) {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
      }
      xml = await response.text();
    } else {
      throw new Error('No sitemap source provided');
    }
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    
    const sitemapElements = xmlDoc.getElementsByTagName("sitemap");
    
    if (sitemapElements.length > 0) {
      setProgress({ current: 0, total: sitemapElements.length });
      
      const sitemapUrls: string[] = [];
      for (let i = 0; i < sitemapElements.length; i++) {
        const locElement = sitemapElements[i].getElementsByTagName("loc")[0];
        if (locElement && locElement.textContent) {
          sitemapUrls.push(locElement.textContent);
        }
      }
      
      for (let i = 0; i < sitemapUrls.length; i++) {
        setProgress({ current: i + 1, total: sitemapUrls.length });
        
        try {
          const response = await fetch(`/api/proxy?url=${encodeURIComponent(sitemapUrls[i])}`);
          if (!response.ok) continue;
          
          const sitemapXml = await response.text();
          const urls = extractUrlsFromSitemap(sitemapXml);
          allUrls = [...allUrls, ...urls];
        } catch (error) {
          console.error(`Failed to process sitemap ${sitemapUrls[i]}:`, error);
        }
      }
    } else {
      allUrls = extractUrlsFromSitemap(xml);
      setProgress({ current: 1, total: 1 });
    }
    
    return allUrls;
  } catch (error) {
    console.error("Error parsing sitemap:", error);
    throw error;
  }
}

function extractUrlsFromSitemap(xml: string): string[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const urlElements = xmlDoc.getElementsByTagName("url");
  
  const urls: string[] = [];
  
  for (let i = 0; i < urlElements.length; i++) {
    const locElement = urlElements[i].getElementsByTagName("loc")[0];
    if (locElement && locElement.textContent) {
      urls.push(locElement.textContent);
    }
  }
  
  return urls;
}