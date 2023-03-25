module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'uk', 'zh'],
  },
  debug: true,
  reloadOnPrerender: process.env.IS_PROD !== 'true',
}