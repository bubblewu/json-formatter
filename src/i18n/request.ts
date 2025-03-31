import { getRequestConfig } from 'next-intl/server';

// 定义支持的语言列表
export const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'] as const;
export const defaultLocale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // 等待requestLocale解析
  let locale = await requestLocale || defaultLocale;
  
  // 确保locale是有效的
  if (!locale || !(locales as readonly string[]).includes(locale)) {
    locale = defaultLocale;
  }
  
  try {
    // 根据locale加载消息
    const messages = (await import(`../messages/${locale}.json`)).default;
    return {
      locale, // 必须返回locale
      messages,
      timeZone: 'UTC'
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    // 出错时使用默认语言
    const defaultMessages = (await import(`../messages/${defaultLocale}.json`)).default;
    return {
      locale: defaultLocale, // 出错时使用默认locale
      messages: defaultMessages,
      timeZone: 'UTC'
    };
  }
}); 