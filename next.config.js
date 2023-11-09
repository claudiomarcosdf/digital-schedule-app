/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*'
            },
            {
                source: '/whatsapp-api/:path*',
                destination: 'http://localhost:3333/:path*'
            }
        ];
    }
};

module.exports = nextConfig;
