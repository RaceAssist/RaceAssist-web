/**
 * @type {import('next').NextConfig}
 */


const nextConfig = withInterceptStdout(
    {
        reactStrictMode: true,
        swcMinify: true,
        optimizeFonts: true,
        images: {
            domains: ["crafthead.net"],
        },
        async rewrites() {
            return [
                {
                    source: '/server-api/:path*',
                    destination: process.env.RACEASSIST_API_SERVER_URL + "/:path*",
                },
            ];
        }
    },
    (text) => (text.includes("Duplicate atom key") ? "" : text),
);

module.exports = nextConfig
