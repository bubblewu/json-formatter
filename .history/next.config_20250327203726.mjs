import createNextIntlPlugin from 'next-intl/plugin';

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
      // 分块策略优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
          minSize: 20000,
          maxSize: 20000000, // 20MB
          cacheGroups: {
            // 将大型依赖拆分为单独的块
            monaco: {
              test: /[\\/]node_modules[\\/](@monaco-editor|monaco-editor)[\\/]/,
              name: 'monaco',
              priority: 20,
              enforce: true,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 20,
              enforce: true,
            },
            highlight: {
              test: /[\\/]node_modules[\\/](react-syntax-highlighter)[\\/]/,
              name: 'highlighter',
              priority: 10,
              enforce: true,
            },
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 5,
              minChunks: 1,
            },
          },
        },
      };

      // 移除不必要的模块
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
};

export default withNextIntl(nextConfig); 