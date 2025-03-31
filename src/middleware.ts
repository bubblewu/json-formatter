import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

// 创建简化的中间件配置
export default createMiddleware({
  defaultLocale,
  locales,
  // 添加路径名映射，确保正确的路径结构
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/contact': '/contact',
    '/privacy': '/privacy',
    '/terms': '/terms',
    '/history': '/history'
  },
  // 始终在URL中包含语言代码
  localePrefix: 'always'
});

// 更新匹配器以包含所有相关路径
export const config = {
  // 匹配所有非静态资源、API和Next.js内部路径
  matcher: [
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
  ]
}; 