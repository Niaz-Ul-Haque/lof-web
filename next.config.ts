import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  productionBrowserSourceMaps: false,

  webpack: config => {
    if (config.optimization && config.optimization.minimizer) {
      for (const plugin of config.optimization.minimizer) {
        if (plugin.constructor.name === 'TerserPlugin') {
          Object.assign(plugin.options.terserOptions, {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
            },
            mangle: {
              toplevel: true,
              safari10: true,
            },
            keep_classnames: false,
            keep_fnames: false,
            output: {
              comments: false,
            },
          });
        }
      }
    }

    if (config.optimization) {
      config.optimization.minimize = true;
    }

    return config;
  },

  async redirects() {
    return [
      { source: '/generator', destination: '/customs', permanent: true },
      { source: '/team-generator', destination: '/customs', permanent: true },
      { source: '/team-maker', destination: '/customs', permanent: true },
      { source: '/team-builder', destination: '/customs', permanent: true },
      { source: '/custom-teams', destination: '/customs', permanent: true },
      { source: '/balanced-teams', destination: '/customs', permanent: true },
      { source: '/generate', destination: '/customs', permanent: true },
      { source: '/balance', destination: '/customs', permanent: true },
      { source: '/create-teams', destination: '/customs', permanent: true },
      { source: '/5v5', destination: '/customs', permanent: true },
      { source: '/custom-generator', destination: '/customs', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
