import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import StructuredData from '@/components/StructuredData';
import Breadcrumb from '@/components/Breadcrumb';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getMessages();
  const title = (messages as any)?.title as string;
  const description = (messages as any)?.description as string;
  const baseUrl = 'https://jsonformatplus.com';

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        'en': '/en',
        'zh': '/zh',
        'ja': '/ja',
        'ko': '/ko',
        'es': '/es',
        'de': '/de',
        'fr': '/fr',
        'ru': '/ru'
      }
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: params.locale,
      siteName: 'JSON Format Plus',
      url: `${baseUrl}/${params.locale}`,
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png'],
      creator: '@JSONFormatPlus',
      site: '@JSONFormatPlus'
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'add-your-google-site-verification',
      yandex: 'add-your-yandex-verification',
      other: {
        'msvalidate.01': 'add-your-bing-verification',
        'baidu-site-verification': 'add-your-baidu-verification'
      },
    },
    authors: [{ name: 'JSON Format Plus Team', url: `${baseUrl}/about` }],
    keywords: ['JSON', 'Formatter', 'Validator', 'Beautifier', 'JSON转换', 'JSON工具', 'JSON Editor', 'Online Tool', '在线工具', 'XML', 'CSV', 'YAML', 'JSON to Code'],
    category: 'Developer Tools',
    classification: 'Web Application',
    referrer: 'origin-when-cross-origin',
    creator: 'JSON Format Plus Team',
    publisher: 'JSON Format Plus',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    applicationName: 'JSON Format Plus',
    generator: 'Next.js',
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': 'JSON Format Plus',
      'format-detection': 'telephone=no',
      'msapplication-TileColor': '#2b5797',
      'msapplication-config': '/browserconfig.xml'
    }
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    notFound();
  }

  const locale = params.locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/images/og-image.png" as="image" />
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <meta name="google-adsense-account" content="ca-pub-4496244939895412" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <StructuredData />
            <Breadcrumb />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DJBK27P6ZF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DJBK27P6ZF');
          `}
        </Script>
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4496244939895412"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
} 