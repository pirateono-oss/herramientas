import type { MetadataRoute } from 'next';

const locales = ['en', 'es', 'pt'];
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://herramientas.vercel.app';
const tools = ['ip-lookup', 'password-generator', 'word-counter', 'qr-generator'];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    pages.push({ url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 });
    for (const tool of tools) {
      pages.push({ url: `${baseUrl}/${locale}/${tool}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
    }
  }
  return pages;
}
