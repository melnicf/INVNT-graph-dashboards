import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Vercel Blob public URLs: https://<store-id>.public.blob.vercel-storage.com/...
    // https://vercel.com/docs/vercel-blob/public-storage#displaying-an-image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
