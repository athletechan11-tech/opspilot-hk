import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // 關鍵：將輸出嘅資料夾改做 next（冇底線）
  distDir: 'next',
}

export default nextConfig
