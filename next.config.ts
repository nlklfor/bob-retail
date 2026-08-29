import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aqtxsnacasvlqaagqaoq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Next's own default is 1MB, framework-wide, checked before any of
      // our own code runs — separate from (and lower than) the 5MB file
      // check in uploadProductImageAction. 6MB gives that a little
      // headroom over the raw multipart body of a 5MB image.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
