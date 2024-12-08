import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/Home.html",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
