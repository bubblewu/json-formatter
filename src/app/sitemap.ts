import { locales } from '@/i18n/request';
import { MetadataRoute } from 'next';
import { WEBSITE_URL } from '@/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();
  
  // 为每种语言生成主页URL
  const homeUrls = locales.map(locale => ({
    url: `${WEBSITE_URL}/${locale}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 1.0,
    alternates: {
      languages: {
        'x-default': `${WEBSITE_URL}/en`,
        ...Object.fromEntries(
          locales.map(l => [l, `${WEBSITE_URL}/${l}`])
        )
      }
    }
  }));
  
  // 工具页面
  const toolPages = [
    { path: 'json-to-xml', priority: 0.9, changeFreq: 'weekly' as const },
    { path: 'json-to-csv', priority: 0.9, changeFreq: 'weekly' as const },
    { path: 'json-to-yaml', priority: 0.9, changeFreq: 'weekly' as const },
    { path: 'beautify', priority: 0.9, changeFreq: 'daily' as const },
    { path: 'minify', priority: 0.9, changeFreq: 'weekly' as const },
    { path: 'validate', priority: 0.9, changeFreq: 'weekly' as const },
    { path: 'json-to-java', priority: 0.85, changeFreq: 'weekly' as const },
    { path: 'json-to-csharp', priority: 0.85, changeFreq: 'weekly' as const },
    { path: 'json-to-golang', priority: 0.85, changeFreq: 'weekly' as const },
    { path: 'json-to-php', priority: 0.85, changeFreq: 'weekly' as const },
    { path: 'json-to-python', priority: 0.85, changeFreq: 'weekly' as const },
    { path: 'json-to-typescript', priority: 0.85, changeFreq: 'weekly' as const },
  ];
  
  // 为每种语言生成工具页面URL
  const toolUrls = toolPages.flatMap(tool => 
    locales.map(locale => ({
      url: `${WEBSITE_URL}/${locale}/${tool.path}`,
      lastModified: currentDate,
      changeFrequency: tool.changeFreq,
      priority: tool.priority,
      alternates: {
        languages: {
          'x-default': `${WEBSITE_URL}/en/${tool.path}`,
          ...Object.fromEntries(
            locales.map(l => [l, `${WEBSITE_URL}/${l}/${tool.path}`])
          )
        }
      }
    }))
  );

  // 信息页面
  const infoPages = [
    { path: 'history', priority: 0.8, changeFreq: 'weekly' as const },
    { path: 'contact', priority: 0.7, changeFreq: 'monthly' as const },
    { path: 'privacy', priority: 0.6, changeFreq: 'monthly' as const },
    { path: 'terms', priority: 0.6, changeFreq: 'monthly' as const },
    { path: 'about', priority: 0.7, changeFreq: 'monthly' as const },
    { path: 'faq', priority: 0.8, changeFreq: 'weekly' as const },
    { path: 'sitemap', priority: 0.5, changeFreq: 'monthly' as const },
  ];
  
  // 为每种语言生成信息页面URL
  const infoUrls = infoPages.flatMap(page => 
    locales.map(locale => ({
      url: `${WEBSITE_URL}/${locale}/${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFreq,
      priority: page.priority,
      alternates: {
        languages: {
          'x-default': `${WEBSITE_URL}/en/${page.path}`,
          ...Object.fromEntries(
            locales.map(l => [l, `${WEBSITE_URL}/${l}/${page.path}`])
          )
        }
      }
    }))
  );
  
  // 教程页面
  const tutorialUrls = locales.map(locale => ({
    url: `${WEBSITE_URL}/${locale}/tutorials`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        'x-default': `${WEBSITE_URL}/en/tutorials`,
        ...Object.fromEntries(
          locales.map(l => [l, `${WEBSITE_URL}/${l}/tutorials`])
        )
      }
    }
  }));
  
  // 博客页面
  const blogUrls = locales.map(locale => ({
    url: `${WEBSITE_URL}/${locale}/blog`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        'x-default': `${WEBSITE_URL}/en/blog`,
        ...Object.fromEntries(
          locales.map(l => [l, `${WEBSITE_URL}/${l}/blog`])
        )
      }
    }
  }));
  
  // 组合所有URL （无效页面不展示）
  return [
    ...homeUrls,
    // ...toolUrls,
    // ...infoUrls,
    ...tutorialUrls,
    // ...blogUrls
  ];
} 