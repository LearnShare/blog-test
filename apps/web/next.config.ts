import path from 'node:path';
import type {
  NextConfig,
} from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
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
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/file/hash/**',
        search: '',
      },
    ],
  },
};

const withMDX = createMDX({
  //
});

export default withMDX(nextConfig);
