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
        <Head>
            <title>Permacast</title>
            <meta name="description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />
            <meta name="twitter:image" content={`/public/favicon.ico`} />
            <meta name="twitter:title" content={`Permacast`} />
            <meta name="twitter:url" content={`https://permacast.dev/`}></meta>
            <meta name="twitter:description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />

            <meta name="og:card" content="summary" />
            <meta name="description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />
            <meta name="og:image" content={`/public/favicon.ico`} />
            <meta name="og:title" content={`Permacast`} />
            <meta name="og:url" content={`https://permacast.dev/`} />
            <meta name="og:description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} /> 
          </Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  };
};
