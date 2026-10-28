import type { MaterialProcessingContext } from "../types";

/**
 * Base path for resolving relative material media URLs
 */
export function getMaterialMediaPath(
  context: MaterialProcessingContext
): string {
  return `/workspace/${context.workspace.urlName}/materials/${context.material.path}`;
}

/**
 * Check if a URL is absolute
 * @param src - The URL to check
 * @returns True if the URL is absolute, false otherwise
 */
export function isAbsoluteUrl(src: string): boolean {
  return (
    src.startsWith("/") ||
    src.startsWith("mailto:") ||
    src.startsWith("data:") ||
    /^(?:[a-zA-Z]+:)?\/\//.test(src)
  );
}
