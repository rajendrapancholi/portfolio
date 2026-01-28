/**
 * Safely stringify JSON for <script type="application/ld+json">
 * - Escapes < to \u003c (prevents </script> breakout / XSS)
 * - Escapes line/paragraph separators that break JS literals
 * - Optional: attempts safe URI decoding on strings (remove if not needed)
 */
export default function safeJSONStringify(
  json: unknown,
  options: { decodeUri?: boolean } = {},
): string {
  const { decodeUri = false } = options;

  function sanitizeString(value: string): string {
    let v = value;

    // Optional: safe decode only if it looks encoded
    if (decodeUri && v.includes("%")) {
      try {
        v = decodeURIComponent(v);
      } catch {
        // keep original on failure
      }
    }

    // Critical: prevent </script> injection
    v = v.replace(/</g, "\\u003c");

    // Prevent breaking JS string literals (rare but good practice)
    v = v.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

    // Optional extra paranoia (not strictly needed for JSON-LD)
    // v = v.replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

    return v;
  }

  function walk(node: unknown): unknown {
    if (node == null) return node;
    if (typeof node === "string") return sanitizeString(node);
    if (Array.isArray(node)) return node.map(walk);

    if (typeof node === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(node)) {
        result[key] = walk(val);
      }
      return result;
    }

    return node; // numbers, bools, etc.
  }

  const sanitized = walk(json);
  return JSON.stringify(sanitized);
}

/**
 * Sanitizes a string into a URL-friendly format (slug).
 *
 * This function performs the following:
 * 1. Converts the string to lowercase and replaces spaces/underscores with hyphens.
 * 2. Removes all characters NOT a-z, 0-9, or hyphens.
 * 3. Collapses multiple consecutive hyphens into a single hyphen.
 * 4. Trims hyphens from the start and end of the result.
 *
 * @param {string} slug - The raw string to be sanitized.
 * @returns {string} The cleaned, URL-safe string.
 * @example
 * // returns "hello-world"
 * sanitizeSlug("---Hello@World !!---");
 */
export const sanitizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // 1. Convert spaces and underscores to hyphens
    .replace(/[^\w-]+/g, "") // 2. Remove all non-word chars (except hyphens)
    .replace(/-+/g, "-") // 3. Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, ""); // 4. Trim hyphens from start and end
};
