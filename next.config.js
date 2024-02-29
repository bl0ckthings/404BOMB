/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fallbacks for Node.js modules that may be required by some npm packages
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // If you had to add a specific loader for MP3 files, it would go here.
    // However, Next.js's default file handling should cover MP3 without needing additional loaders.
    
    // Example: Adding an alias (unrelated to MP3 handling but shows how to extend config)
    // config.resolve.alias['@components'] = path.join(__dirname, 'components');

    return config;
  },
};

module.exports = nextConfig;
