import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "JSON Formatter",
  description: "A free online tool to format, validate, and beautify your JSON data",
  keywords: "JSON, formatter, validator, beautify, format JSON, JSON tools, JSON editor, online JSON formatter",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="robots" content="index, follow" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="icon" type="image/png" href="/logo-json.png" />
        <link rel="apple-touch-icon" type="image/png" href="/logo-json.png" />
      </head>
      <body>
        <div className={inter.className}>
          {children}
        </div>
      </body>
    </html>
  );
}
