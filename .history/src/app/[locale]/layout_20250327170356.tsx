import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { ThemeProvider } from "@/components/ThemeProvider";
import { JsonFormatter } from "@/components/JsonFormatter";
import { StructuredData } from "@/components/StructuredData";
import { Feedback } from "@/components/Feedback";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getMessages } from "@/lib/messages";
import { getFixSuggestion } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages(locale);
  const title = messages.title;
  const description = messages.description;
  const subtitle = messages.subtitle;

  return {
    title: `${title} - ${subtitle}`,
    description,
    keywords: "JSON, formatter, validator, beautifier, online tool, JSONC, JSON5",
    authors: [{ name: "JSON Formatter Team" }],
    creator: "JSON Formatter Team",
    publisher: "JSON Formatter",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://json-formatter.wugang04.com"),
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en",
        "zh-CN": "/zh",
        "ja-JP": "/ja",
        "ko-KR": "/ko",
        "es-ES": "/es",
        "de-DE": "/de",
        "fr-FR": "/fr",
        "ru-RU": "/ru",
      },
      defaultLocale: "en-US",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StructuredData
              title={messages.title}
              description={messages.description}
              locale={locale}
            />
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <JsonFormatter
                  messages={messages}
                  getFixSuggestion={getFixSuggestion}
                  supportedLanguages={SUPPORTED_LANGUAGES}
                />
                <Feedback messages={messages} />
              </main>
              <Footer messages={messages} />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 