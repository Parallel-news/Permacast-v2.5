const path = require('path')

const localePath = path.resolve('./public/locales')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'uk', 'zh'],
  },
  localePath,
  debug: true,
  reloadOnPrerender: process.env.IS_PROD !== 'true',
}