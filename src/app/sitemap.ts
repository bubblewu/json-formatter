import { locales } from '@/i18n/request';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://json-formatter.vercel.app';
  const currentDate = new Date().toISOString();
  
  // 为每种语言生成主页URL
  const homeUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 1.0,
    alternates: {
      languages: {
        'x-default': `${baseUrl}/en`,
        ...Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}`])
        )
      }
    }
  }));
  
  // 为每种语言生成历史页面URL
  const historyUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}/history`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        'x-default': `${baseUrl}/en/history`,
        ...Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/history`])
        )
      }
    }
  }));

  // 为每种语言生成联系页面URL
  const contactUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}/contact`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        'x-default': `${baseUrl}/en/contact`,
        ...Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/contact`])
        )
      }
    }
  }));

  // 为每种语言生成隐私政策页面URL
  const privacyUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}/privacy`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    alternates: {
      languages: {
        'x-default': `${baseUrl}/en/privacy`,
        ...Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/privacy`])
        )
      }
    }
  }));

  // 为每种语言生成使用条款页面URL
  const termsUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}/terms`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    alternates: {
      languages: {
        'x-default': `${baseUrl}/en/terms`,
        ...Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/terms`])
        )
      }
    }
  }));
  
  // 组合所有URL
  return [
    ...homeUrls,
    ...historyUrls,
    ...contactUrls,
    ...privacyUrls,
    ...termsUrls
  ];
} 