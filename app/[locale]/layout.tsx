import { ReactNode } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // 设置当前请求的语言
  unstable_setRequestLocale(locale);
  
  // 获取翻译消息
  const messages = (await import(`../../messages/${locale}.json`)).default;
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header locale={locale} />
        <main className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}