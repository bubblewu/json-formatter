import { getRequestConfig } from 'next-intl/server';

// 定义支持的语言列表
export const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'] as const;
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 