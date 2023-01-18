const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  reactStrictMode: false, // later
  staticPageGenerationTimeout: 100,
  images: {
    domains: [
      'arweave.net', 
      'img.arweave.dev',
    ],
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp']
  }
}