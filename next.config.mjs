/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 's3-alpha-sig.figma.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8001',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8001',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8001',
          pathname: '/uploads/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8001',
          pathname: '/uploads/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8001',
          pathname: '/media/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8001',
          pathname: '/media/**',
        },
      ],
    },
  };
  
  export default nextConfig;