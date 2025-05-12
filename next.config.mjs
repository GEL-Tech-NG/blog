/** @type {import('next').NextConfig} */

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const nextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ||
      (productionUrl ? `https://${productionUrl}` : "http://localhost:3001"),
  },
};

export default nextConfig;
