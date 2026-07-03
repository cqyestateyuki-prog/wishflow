// BUILD_TARGET=capacitor produces a static export for the native shell
// (scripts/build-capacitor.js moves app/api aside for that build)
const isCapacitorBuild = process.env.BUILD_TARGET === 'capacitor';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isCapacitorBuild ? { output: 'export', images: { unoptimized: true } } : {}),
  // 减少文件监视器的数量，避免 EMFILE 错误（仅开发环境）
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // 使用轮询而不是文件系统事件
        aggregateTimeout: 300,
      }
    }
    return config
  },
  // CORS for the API so the Capacitor shell (capacitor://localhost) can call it.
  // Auth is Bearer-token based (no cookies), so '*' is safe here.
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
