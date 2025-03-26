const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除i18n配置，使用App Router的国际化方案
};

module.exports = withNextIntl(nextConfig); 