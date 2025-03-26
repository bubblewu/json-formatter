import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 支持的语言列表
export const locales = ['en', 'zh'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = 'en';

// 对于直接导入静态JSON文件
import enMessages from '../messages/en.json';
import zhMessages from '../messages/zh.json';

// 简化配置以避免在服务器组件中使用动态参数
export function getStaticMessages(locale: string) {
  // 只处理我们支持的语言
  if (locale === 'zh') {
    return zhMessages;
  }
  // 默认返回英语
  return enMessages;
}

export default getRequestConfig(async ({ locale }) => {
  // 验证请求的语言是否受支持
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale: locale as string,
    messages: getStaticMessages(locale)
  };
}); 