export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // If envUrl is missing or is the placeholder 'your-domain' or localhost
  if (!envUrl || envUrl.includes('your-domain') || envUrl.includes('localhost')) {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return 'https://globalize-website.vercel.app';
  }

  // Ensure no trailing slash
  return envUrl.replace(/\/$/, '');
}
