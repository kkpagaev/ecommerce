/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.optimization.minimizer = []

    if(dev) {
      config.watchOptions = {
        followSymlinks: true,
      }

      config.snapshot.managedPaths = [];
      
    }

    return config;
  },
};

export default nextConfig;
