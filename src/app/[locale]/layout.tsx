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
      icons: {
        icon: [
          { url: '/logo-json.png', type: 'image/png' },
        ],
        apple: [
          { url: '/logo-json.png', type: 'image/png' },
        ],
      },
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1.5,
        userScalable: true,
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
    icons: {
      icon: [
        { url: '/logo-json.png', type: 'image/png' },
      ],
      apple: [
        { url: '/logo-json.png', type: 'image/png' },
      ],
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1.5,
      userScalable: true,
    },
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
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="icon" type="image/png" href="/logo-json.png" />
        <link rel="apple-touch-icon" type="image/png" href="/logo-json.png" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 