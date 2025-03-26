import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  
  // 默认语言
  defaultLocale: 'en',
  
  // 当访问没有语言前缀的路由时重定向到默认语言
  localePrefix: 'as-needed',
});

export const config = {
  // 匹配除了静态资源、api和_next路径外的所有路由
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 