// ============================================
// PROFITFORGE Pro (v6.0) - Next.js Config
// ES Module Syntax (.mjs)
// ============================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============ CORE ============
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  
  // ============ IMAGES ============
  images: {
    domains: ['localhost', 'vercel.app', 'railway.app'],
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // ============ ENV ============
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://market-engine.up.railway.app',
    NEXT_PUBLIC_VERSION: '6.0.0',
    NEXT_PUBLIC_APP_NAME: 'PROFITFORGE Pro'
  },
  
  // ============ TRAILING SLASH ============
  trailingSlash: false,
  
  // ============ HEADERS ============
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }
        ]
      }
    ];
  },
  
  // ============ WEBPACK ============
  webpack: (config, { isServer, dev }) => {
    // Handle fallbacks for browser
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        os: false,
        child_process: false,
        dns: false,
        url: false,
        util: false,
        buffer: false,
        process: false
      };
    }
    
    // Ignore warnings
    config.ignoreWarnings = [
      { message: /Critical dependency:/ },
      { message: /Module not found:/ }
    ];
    
    return config;
  },
  
  // ============ EXPERIMENTAL ============
  experimental: {
    optimizeCss: true,
    scrollRestoration: true
  },
  
  // ============ ESLINT ============
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // ============ TYPESCRIPT ============
  typescript: {
    ignoreBuildErrors: true
  },
  
  // ============ OUTPUT ============
  output: 'standalone'
};

// ✅ CORRECT EXPORT for ES Module (.mjs)
export default nextConfig;
