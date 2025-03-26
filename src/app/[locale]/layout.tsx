import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { locales, Locale, getStaticMessages } from '@/i18n';
import '../globals.css';

// 确保字体加载是确定性的
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description: 'A powerful tool for formatting, validating and analyzing JSON data',
};

export default function LocaleLayout({ children, params }: Props) {
  // 使用结构赋值和类型转换来安全获取和处理locale
  const { locale } = params as { locale: string };
  
  // 验证请求的语言是否受支持
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 获取静态消息
  const messages = getStaticMessages(locale);

  return (
    <html suppressHydrationWarning lang={locale}>
      <body suppressHydrationWarning className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 