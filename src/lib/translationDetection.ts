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

export function documentHasEnglish(raw: any): boolean {
  if (!raw) return false;
  const name = raw.nameEn || raw.nameAr || raw.name;
  const desc = raw.descriptionEn || raw.descriptionAr || raw.description;
  return isGenuineEnglish(name, desc);
}

export function embassyHasEnglish(raw: any): boolean {
  if (!raw) return false;
  const name = raw.nameEn || raw.title;
  const reqs = Array.isArray(raw.requirementsEn)
    ? raw.requirementsEn.join(' ')
    : Array.isArray(raw.requirements)
    ? raw.requirements.join(' ')
    : typeof raw.requirementsEn === 'string'
    ? raw.requirementsEn
    : '';
  return isGenuineEnglish(name, reqs);
}

export function govHasEnglish(raw: any): boolean {
  if (!raw) return false;
  const name = raw.nameEn || raw.nameAr || raw.name;
  const reqs = Array.isArray(raw.requirementsEn)
    ? raw.requirementsEn.join(' ')
    : Array.isArray(raw.requirements)
    ? raw.requirements.join(' ')
    : typeof raw.requirementsEn === 'string'
    ? raw.requirementsEn
    : '';
  return isGenuineEnglish(name, reqs);
}

export function blogPostHasEnglish(raw: any): boolean {
  if (!raw) return false;
  const title = raw.titleEn || raw.titleAr || raw.title;
  const body = raw.bodyEn || raw.bodyAr || raw.body;
  return isGenuineEnglish(title, body);
}
