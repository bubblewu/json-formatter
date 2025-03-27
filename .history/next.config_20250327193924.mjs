import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // 优化构建输出
  webpack: (config, { isServer }) => {
    // 生产环境优化
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 24400000, // 24MB
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  // 禁用一些不必要的功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'react-icons'],
  },
  // 压缩输出
  compress: true,
  // 优化字体加载
  optimizeFonts: true,
  // 优化图片加载
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
  env: {
    _next_intl_trailing_slash: 'true',
  },
};

export default withNextIntl(nextConfig); 