import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter",
  description: "A free online tool to format, validate, and beautify your JSON data",
  keywords: "JSON, formatter, validator, beautify, format JSON, JSON tools, JSON editor, online JSON formatter",
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
  },
};

// 将viewport配置分离出来
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
};

// 根布局简化，避免与[locale]布局中重复的HTML结构
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
