import createNextIntlPlugin from 'next-intl/plugin';
import { withNextMetadata } from '@cloudflare/next-on-pages/metadata';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@monaco-editor/react', 'react-syntax-highlighter'],
  },
  webpack: (config, { isServer }) => {
    // 减少构建时的递归深度
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.next'],
    };

    // 优化 Monaco Editor 构建
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
  env: {
    _next_intl_trailing_slash: 'true',
  },
  distDir: '.next',
  trailingSlash: true,
  generateStaticParams: async () => {
    return {
      locales: ['en', 'zh'],
      paths: [
        '/',
        '/history',
        '/admin/feedback',
      ],
    };
  },
};

export default withNextIntl(nextConfig); 