import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 250000, // 限制 chunk 最大 250KB
      },
    };


    return config;
  },
  env: {
    _next_intl_trailing_slash: '',
  },
};

export default withNextIntl(nextConfig); 