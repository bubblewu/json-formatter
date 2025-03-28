import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
  },
  devServer: {
    host: '0.0.0.0', // Allow binding on all network interfaces
    port: 3100, // Keep the same port
  }
};

export default withNextIntl(nextConfig); 