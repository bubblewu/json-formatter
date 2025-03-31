import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@/app/globals.css';

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
      }
    };
  }

  // 使用翻译构建元数据
  return {
    title: messages.meta?.title || 'JSON Formatter - Format, Validate and Beautify JSON Data',
    description: messages.meta?.description || 'A free online tool to format, validate and beautify your JSON data',
    keywords: messages.meta?.keywords || 'JSON, formatter, validator, beautify, format JSON, JSON tools, JSON editor, online JSON formatter',
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
    }
  };
}

// 分离viewport配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 验证locale参数
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  let messages;
  
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages:', error);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="google-adsense-account" content="ca-pub-4496244939895412" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="icon" type="image/png" href="/logo-json.png" />
        <link rel="apple-touch-icon" type="image/png" href="/logo-json.png" />
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DJBK27P6ZF" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DJBK27P6ZF');
          `}
        </Script>
        {/* Google AdSense */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4496244939895412"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="font-sans">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
} 