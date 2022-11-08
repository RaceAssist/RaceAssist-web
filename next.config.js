/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    optimizeFonts: true,
    images : {
        domains: ['crafthead.net'],
    },
};

module.exports = nextConfig;
