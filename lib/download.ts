/**
 * Download an array of URLs as a text file
 * @param urls The array of URLs to download
 * @param filename The name of the downloaded file
 */
export function downloadUrls(
  urls: string[],
  filename: string = "sitemap-urls.txt"
): void {
  // Create a text content with one URL per line
  const content = urls.join("\n");
  
  // Create a Blob with the content
  const blob = new Blob([content], { type: "text/plain" });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  // Set the link properties
  link.href = url;
  link.download = filename;
  
  // Append the link to the document
  document.body.appendChild(link);
  
  // Click the link to download the file
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}