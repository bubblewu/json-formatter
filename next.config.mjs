import createNextIntlPlugin from 'next-intl/plugin';

// 指定配置文件路径
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
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
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 增加性能优化
  productionBrowserSourceMaps: false,
  // 配置ESM兼容性
  transpilePackages: ['@monaco-editor/react', 'monaco-editor'],
  
  serverRuntimeConfig: {
    host: '0.0.0.0',  // 监听所有地址
    port: 3000,
  },
};

export default withNextIntl(nextConfig); 
