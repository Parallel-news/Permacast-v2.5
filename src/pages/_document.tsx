import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import i18nextConfig from '../../next-i18next.config'

export default class _document extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.locale ??
      i18nextConfig.i18n.defaultLocale

    return (
      <Html lang={currentLocale}>
        <Head>
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <div className="absolute bottom-0 bg-zinc-900 w-screen rounded-t-xl" id="podcast-player"></div>
      </Html>
    );
  };
};
