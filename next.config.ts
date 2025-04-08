import type { NextConfig } from "next";
const getBaseURL = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return "http://locahost:9000/"; // Dev environment API
    case "production":
      return "http://ec2-3-110-40-233.ap-south-1.compute.amazonaws.com:9000/api/"; // Production API
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
