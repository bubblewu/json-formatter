import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
    optimizePackageImports: ['@monaco-editor/react', 'react-syntax-highlighter'],
  },
  webpack: (config, { isServer, dev }) => {
    // 减少构建时的递归深度
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.next', '**/out'],
    };

    // 生产环境优化
    if (!isServer && !dev) {
      // 禁用源映射以减少大小
      config.devtool = false;

      // 极端优化分块策略
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          ...config.optimization.minimizer || [],
        ],
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 30,
          maxAsyncRequests: 30,
          minSize: 5000,
          maxSize: 200000, // 200KB
          cacheGroups: {
            monaco: {
              test: /[\\/]node_modules[\\/](@monaco-editor|monaco-editor)[\\/]/,
              name: 'monaco',
              priority: 40,
              reuseExistingChunk: true,
              chunks: 'all',
              enforce: true,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 30,
              reuseExistingChunk: true,
              chunks: 'all',
              enforce: true,
            },
            highlight: {
              test: /[\\/]node_modules[\\/](react-syntax-highlighter)[\\/]/,
              name: 'highlighter',
              priority: 20,
              reuseExistingChunk: true,
              chunks: 'all',
              enforce: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `npm.${packageName.replace('@', '')}`;
              },
              priority: 10,
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

      // 移除不必要的模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }

    return config;
  },
  env: {
    _next_intl_trailing_slash: '',
  },
};

export default withNextIntl(nextConfig); 