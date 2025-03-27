import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    _next_intl_trailing_slash: 'true'
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
  },
  // 添加国际化配置
  i18n: {
    locales: ['en', 'zh', 'ja', 'ko', 'es'],
    defaultLocale: 'en',
  },
  // 配置构建选项
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // 配置模块解析
  transpilePackages: ['@formatjs/intl-localematcher', '@formatjs/intl-numberformat'],
  // 配置webpack别名
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@formatjs': require.resolve('@formatjs/intl'),
      };
    }
    return config;
  }
};

export default withNextIntl(nextConfig); 