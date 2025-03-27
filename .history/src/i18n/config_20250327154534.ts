import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/constants';

export const locales = SUPPORTED_LANGUAGES;
export const defaultLocale = DEFAULT_LANGUAGE;

export const localeNames = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский'
} as const;

export type Locale = typeof locales[number];
export type LocaleName = keyof typeof localeNames; 