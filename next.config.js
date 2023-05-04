const { i18n } = require('./next-i18next.config')

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = {
  ...withBundleAnalyzer({}),
  i18n,
  reactStrictMode: false, // later
  staticPageGenerationTimeout: 100,
  images: {
    domains: [
      'arweave.net', 
      'img.arweave.dev',
      'arseed.web3infra.dev',
      'pz-znmpfs.meson.network'
    ],
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp']
  },
  
}


// Inected Content via Sentry Wizard Below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "permacast-app",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
