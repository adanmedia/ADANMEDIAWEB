/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Optimiere für Produktion
  swcMinify: true,
  // Füge hier weitere Konfigurationen hinzu, falls nötig
};

export default nextConfig;
