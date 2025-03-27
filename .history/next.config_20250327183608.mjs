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
    return config;
  },
  // 配置页面生成选项
  experimental: {
    // 禁用特定路径的静态预渲染
    workerThreads: false,
    cpus: 1
  }
};

export default withNextIntl(nextConfig); 