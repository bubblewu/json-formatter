import { getRequestConfig } from 'next-intl/server';

// 定义支持的语言列表
export const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'];

export type Locale = (typeof locales)[number];

export default function getLocaleFromRequest(
  request: Request
): Locale {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // 获取用户的语言偏好
  const acceptLanguage = negotiatorHeaders['accept-language'] || '';
  
  // 获取请求URL中的语言
  const pathname = new URL(request.url).pathname;
  const localeInUrl = pathname.split('/')[1];
  
  // 如果URL中包含有效的locale，则使用该locale
  if (locales.includes(localeInUrl as Locale)) {
    return localeInUrl as Locale;
  }
  
  // 尝试获取用户偏好的语言
  const preferredLocale = acceptLanguage
    .split(',')
    .map(item => item.split(';')[0].trim())
    .find(item => {
      // 检查完整匹配 (例如 'en-US')
      if (locales.includes(item as Locale)) {
        return true;
      }
      
      // 检查语言代码匹配 (例如 'en' 匹配 'en-US')
      const languageCode = item.split('-')[0];
      return locales.includes(languageCode as Locale);
    });
  
  // 如果找到匹配的语言，则使用该语言，否则使用默认语言（英语）
  if (preferredLocale) {
    if (locales.includes(preferredLocale as Locale)) {
      return preferredLocale as Locale;
    }
    
    const languageCode = preferredLocale.split('-')[0];
    if (locales.includes(languageCode as Locale)) {
      return languageCode as Locale;
    }
  }
  
  return 'en';
} 