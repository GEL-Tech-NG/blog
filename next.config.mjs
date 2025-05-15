/** @type {import('next').NextConfig} */

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const netlifySiteUrl = process.env.NETLIFY && process.env.URL;
let Url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL ||
      netlifySiteUrl ||
      `https://${vercelProductionUrl}`
    : "http://localhost:3000";
const nextConfig = {
  env: {
    NEXTAUTH_URL: Url,
    NEXT_PUBLIC_SITE_URL: Url,
  },
};

export default nextConfig;
