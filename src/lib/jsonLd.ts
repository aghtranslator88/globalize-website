/**
 * Safely serialize JSON-LD objects for injection into <script type="application/ld+json">.
 * Replaces `<` with `\u003c` to prevent any possibility of script tag breakout / XSS.
 */
export function serializeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
