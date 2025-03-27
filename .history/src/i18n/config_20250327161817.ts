import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/constants';

export const locales = SUPPORTED_LANGUAGES;
export const defaultLocale = DEFAULT_LANGUAGE;

export const localeNames = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский'
} as const;

export type Locale = typeof locales[number];
export type LocaleName = typeof localeNames[Locale]; 