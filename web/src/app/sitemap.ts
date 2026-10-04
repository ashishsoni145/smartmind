import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL = 'https://sharpmind.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/product',
    '/features',
    '/ai-academic-os',
    '/learning-flow',
    '/download',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/get-started',
    '/login',
    '/signup',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/product' || route === '/features' ? 0.9 : 0.7,
  }));
}
