const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl ({
  env:{
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    NEXT_PUBLIC_SUPABSE_AUTH_COOKIE: process.env.NEXT_PUBLIC_SUPABSE_AUTH_COOKIE,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true
  },
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  },
});

module.exports = nextConfig;
