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
