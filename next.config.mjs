/** @type {import('next').NextConfig} */

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const netlifySiteUrl = process.env.NETLIFY && process.env.URL;
let url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL ||
      netlifySiteUrl ||
      `https://${vercelProductionUrl}`
    : "http://localhost:3000";
const nextConfig = {
  env: {
    NEXTAUTH_URL: url,
    NEXT_PUBLIC_SITE_URL: url,
  },
};

export default nextConfig;
