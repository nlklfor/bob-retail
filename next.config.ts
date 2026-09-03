import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on a VPS via Docker, not Vercel — standalone bundles only
  // the node_modules the server actually needs into .next/standalone, so
  // the runtime image doesn't have to ship the whole workspace.
  output: "standalone",
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
  // Tells any buffering reverse proxy (the Caddy container in front of this
  // app — see docs/deployment.md) not to hold back streamed responses.
  // Next's own self-hosting guide calls this out explicitly; harmless if
  // the proxy in front already passes streams through untouched.
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: [{ key: "X-Accel-Buffering", value: "no" }],
      },
    ];
  },
};

export default nextConfig;
