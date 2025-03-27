import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  defaultLocale,
  locales
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 