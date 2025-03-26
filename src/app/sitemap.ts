import { locales } from '@/i18n/request';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://json-formatter.vercel.app';
  
  // 为每种语言生成主页URL
  const homeUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));
  
  // 为每种语言生成历史页面URL
  const historyUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}/history`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // 组合所有URL
  return [...homeUrls, ...historyUrls];
} 