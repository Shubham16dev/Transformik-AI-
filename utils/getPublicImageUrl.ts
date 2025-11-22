// utils/getPublicImageUrl.ts

const CLOUDFLARE_R2_BASE_URL = "https://assets.transformik.com";

export function getPublicImageUrl(bucket: string, path?: string) {
  if (!path) return undefined;

  // Extract filename from path (e.g., "ToolLogos/10web.png" -> "10web.png")
  const filename = path.split("/").pop();
  if (!filename) return undefined;

  // Map bucket and path to Cloudflare R2 structure
  if (bucket === "Images" && path.startsWith("ToolLogos/")) {
    return `${CLOUDFLARE_R2_BASE_URL}/tool-logos/${filename}`;
  }

  if (bucket === "Images" && path.startsWith("ToolScreenshot/")) {
    return `${CLOUDFLARE_R2_BASE_URL}/tool-screenshots/${filename}`;
  }

  // Default fallback for other paths
  return `${CLOUDFLARE_R2_BASE_URL}/${path}`;
}
