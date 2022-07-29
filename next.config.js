/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
    ],
  }
}

module.exports = nextConfig;
