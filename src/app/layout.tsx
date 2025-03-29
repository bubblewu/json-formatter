import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
          {children}
        </div>
      </body>
    </html>
  );
}
