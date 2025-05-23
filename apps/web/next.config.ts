import {withSentryConfig} from '@sentry/nextjs';
import path from 'node:path';
import type {
  NextConfig,
} from 'next';
import createMDX from '@next/mdx';

type imageRemoteProtocol = 'http' | 'https';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  pageExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'md',
    'mdx',
    'markdown',
  ],
  images: {
    remotePatterns: [
      {
        protocol: process.env.PROD_PROTOCOL as imageRemoteProtocol,
        hostname: process.env.PROD_HOST as string,
        port: process.env.PROD_PORT as string,
        pathname: '/api/file/hash/**',
        search: '',
      },
    ],
  },
  experimental: {
    viewTransition: true,
  },
  // https://github.com/replicate/replicate-javascript/issues/225#issuecomment-2065499818
  webpack: (config) => {
    config.externals.push({
      'node:crypto': 'commonjs crypto',
    });
    return config;
  },
};

const withMDX = createMDX({
  //
});

export default withSentryConfig(withMDX(nextConfig), {
  org: "h-labs",
  project: "blog-dev",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: {
    disable: true,
  },
});
