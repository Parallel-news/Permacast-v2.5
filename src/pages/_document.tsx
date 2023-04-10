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
          <meta name="description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <div className="absolute bottom-0 bg-zinc-900 w-screen rounded-t-xl z-50" id="podcast-player"></div>
      </Html>
    );
  };
};
