/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    reactStrictMode: true,
    images: {
        domains: [
            'links.papareact.com',
            'images.unsplash.com',
            'localhost',
            'api.dev-tech.com.ua',
            'dev-tech.com.ua',
            'test-api.dev-tech.com.ua',
            'test.dev-tech.com.ua'
        ]
    },
    i18n: {
        locales: ['en', 'fr'],
        defaultLocale: 'fr',
        localeDetection: false
    },
    publicRuntimeConfig: {
        apiUrl: process.env.API_URL,
        siteUrl: process.env.API_SITE_URL,
        stripeKey: process.env.API_STRIPE
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    }
};
