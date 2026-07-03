/** @type {import('next').NextConfig} */
const nextConfig = {
  // 减少文件监视器的数量，避免 EMFILE 错误
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // 使用轮询而不是文件系统事件
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig
