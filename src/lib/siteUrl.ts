export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // If envUrl is missing, or contains vercel.app, your-domain, or localhost
  if (!envUrl || envUrl.includes('your-domain') || envUrl.includes('vercel.app') || envUrl.includes('localhost')) {
    return 'https://www.globalizetl.com';
  }

  // Ensure no trailing slash
  return envUrl.replace(/\/$/, '');
}

