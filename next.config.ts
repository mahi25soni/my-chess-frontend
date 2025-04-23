import type { NextConfig } from "next";
const getBaseURL = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return "http://localhost:9000/api"; // Dev environment API
    case "production":
      return "https://ghfjdtetywyerriujncxfdsdfssz.site/"; // Production API
    default:
      return "http://localhost:9000/api"; // Local development API
  }
};
const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: getBaseURL(),
  },
};

export default nextConfig;
