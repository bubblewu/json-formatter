import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    _next_intl_trailing_slash: 'true'
  }
};

export default withNextIntl(nextConfig); 