import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// 创建国际化中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，除了以下内容：
  // - API 路由 (/api/*)
  // - 静态文件 (/static/*)
  // - 媒体文件 (*.jpg, *.jpeg, *.png, *.svg, *.ico, *.mp3, *.mp4)
  // - _next 文件 (/_next/*)
  matcher: ['/((?!api|static|.*\\..*|_next).*)']
}; 