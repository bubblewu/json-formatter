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
      
      // 简化的分割配置
      if (!config.optimization) {
        config.optimization = {};
      }
      
      if (!config.optimization.splitChunks) {
        config.optimization.splitChunks = {};
      }
      
      config.optimization.moduleIds = 'deterministic';
      config.optimization.splitChunks.chunks = 'all';
    }
    
    return config;
  },
  // 配置页面生成选项
  experimental: {
    // 禁用特定路径的静态预渲染
    workerThreads: false,
    cpus: 1
  },
  // 配置图片优化
  images: {
    unoptimized: true,
  },
  // 增加性能优化
  productionBrowserSourceMaps: false,
  // 配置ESM兼容性
  transpilePackages: ['@monaco-editor/react', 'monaco-editor'],
  // 设置环境变量
  env: {
    _next_intl_trailing_slash: 'true'
  },
  serverRuntimeConfig: {
    host: '0.0.0.0',  // 监听所有地址
    port: 3000,
  },
  serverRuntimeConfig: {
    host: '0.0.0.0',  // 监听所有地址
    port: 3000,
  },
};

export default withNextIntl(nextConfig); 