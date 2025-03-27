import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本地开发配置
  webpack: (config, { isServer }) => {
    // 减少构建时的递归深度
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.next'],
    };

    // 优化 Monaco Editor 构建
    if (!isServer) {
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