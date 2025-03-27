import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // 添加Monaco编辑器的webpack配置
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    // 减少构建时的递归深度
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.next'],
    };
    return config;
  },
  // 配置页面生成选项
  experimental: {
    // 禁用特定路径的静态预渲染
    workerThreads: false,
    cpus: 1,
    serverActions: true,
    optimizePackageImports: ['@monaco-editor/react', 'react-syntax-highlighter'],
  }
};

export default withNextIntl(nextConfig); 