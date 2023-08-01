module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    optimizeFonts: true,
    images: {
        domains: ["crafthead.net", "cdn.discordapp.com"],
    },
    rewrites: async () => [
        {
            source: "/server-api/:path*",
            destination: `${process.env.RACEASSIST_API_SERVER_URL}/:path*`,
        },
    ],
};
