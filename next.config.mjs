/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimisation was off, so every image shipped at full size in its
  // original format — avatar.png alone was 916KB of PNG for a slot never
  // wider than 430px. This app is server-rendered on Vercel (no static
  // export), so Next can resize and serve WebP/AVIF instead.
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimising remote images means their hosts have to be declared —
    // `unoptimized` previously skipped this check entirely.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
      { protocol: 'https', hostname: 'shrug-person-78902957.figma.site' },
    ],
  },
}

export default nextConfig
