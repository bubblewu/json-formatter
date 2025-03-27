import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 获取当前语言的翻译文件
  let messages;
  try {
    messages = (await import(`@/messages/${params.locale}.json`)).default;
  } catch {
    return {
      title: 'JSON Formatter - Format, Validate and Beautify JSON Data',
      description: 'A free online tool to format, validate and beautify your JSON data',
      keywords: 'JSON, formatter, validator, beautify, format JSON, JSON tools, JSON editor, online JSON formatter',
      alternates: {
        canonical: `https://json-formatter.vercel.app/${params.locale}`,
        languages: Object.fromEntries(
          locales.map(loc => [loc, `https://json-formatter.vercel.app/${loc}`])
        ),
      },
    };
  }

  // 根据当前语言返回元数据
  return {
    title: messages.title + ' - ' + messages.subtitle,
    description: messages.description,
    keywords: 'JSON, formatter, validator, beautify, format JSON, JSON tools, JSON editor, online JSON formatter',
    alternates: {
      canonical: `https://json-formatter.vercel.app/${params.locale}`,
      languages: Object.fromEntries(
        locales.map(loc => [loc, `https://json-formatter.vercel.app/${loc}`])
      ),
    },
    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ],
      apple: [
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="robots" content="index, follow" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 