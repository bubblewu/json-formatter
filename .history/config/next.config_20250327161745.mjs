import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // 添加路径别名
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, '../src'),
    };

    // 添加 Monaco 编辑器的 webpack 配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
  experimental: {
    workerThreads: true,
    optimizeCss: true,
    optimizePackageImports: ['@monaco-editor/react'],
    cpus: 1
  },
  // 添加 next-intl 配置
  env: {
    _next_intl_trailing_slash: 'true'
  }
};

export default withNextIntl(nextConfig); 