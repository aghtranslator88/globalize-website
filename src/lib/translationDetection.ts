export function isGenuineEnglish(title?: string | null, body?: string | null): boolean {
  if (!title && !body) return false;
  const combined = `${title || ''} ${body || ''}`.trim();
  if (!combined) return false;

  const arabicMatches = combined.match(/[\u0600-\u06FF]/g) || [];
  const latinMatches = combined.match(/[a-zA-Z]/g) || [];

  // If arabic characters make up more than 15% of alphabetical characters, it's not genuine English
  if (arabicMatches.length > 5 && arabicMatches.length / (arabicMatches.length + latinMatches.length) > 0.15) {
    return false;
  }

  // Must have sufficient latin text
  return latinMatches.length > 20;
}
