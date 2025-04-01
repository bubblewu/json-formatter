import { getRequestConfig } from 'next-intl/server';

// 定义支持的语言列表
export const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'] as const;
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // 使用locale参数 (v3.4.0的API)
  let effectiveLocale = locale || defaultLocale;
  
  // 确保locale是有效的
  if (!effectiveLocale || !(locales as readonly string[]).includes(effectiveLocale)) {
    effectiveLocale = defaultLocale;
  }
  
  try {
    // 根据locale加载消息
    const messages = (await import(`../messages/${effectiveLocale}.json`)).default;
    return {
      messages,
      timeZone: 'UTC'
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${effectiveLocale}:`, error);
    // 出错时使用默认语言
    const defaultMessages = (await import(`../messages/${defaultLocale}.json`)).default;
    return {
      messages: defaultMessages,
      timeZone: 'UTC'
    };
  }
}); 