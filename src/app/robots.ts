import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/_next/*',
          '/admin/*',
          '/private/*',
          '/*.json$',
          '/*.xml$',
          '/sitemap.xml',
          '/robots.txt'
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/'],
        disallow: ['/api/*', '/_next/*', '/admin/*'],
      },
    ],
    sitemap: 'https://json-formatter.vercel.app/sitemap.xml',
  };
} 