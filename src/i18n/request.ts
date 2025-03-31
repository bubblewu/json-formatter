import { getRequestConfig } from 'next-intl/server';

// 定义支持的语言列表
export const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'] as const;
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // 使用locale参数，确保有默认值
  const localeToUse = locale || defaultLocale;
  
  try {
    const messages = (await import(`../messages/${localeToUse}.json`)).default;
    return {
      // 明确返回locale
      locale: localeToUse,
      messages,
      timeZone: 'UTC'
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${localeToUse}:`, error);
    // 出错时使用默认语言
    const defaultMessages = (await import(`../messages/${defaultLocale}.json`)).default;
    return {
      locale: defaultLocale,
      messages: defaultMessages,
      timeZone: 'UTC'
    };
  }
}); 