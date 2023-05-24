import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import Script from 'next/script';
import { RecoilRoot } from 'recoil';
import '../shikwasa-src/css/base.css';
import '../shikwasa-src/css/chapter.css';
import { SSRProvider } from '@react-aria/ssr';

import { queryClient } from '../lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { appWithTranslation } from 'next-i18next';
import { ArconnectProvider } from 'react-arconnect';
import { PERMISSIONS } from '../constants/arconnect';

const QueryPodcasts = React.lazy(() => import('../component/loaders/QueryPodcasts'));
const QueryANS = React.lazy(() => import('../component/loaders/QueryANS'));
const Layout = React.lazy(() => import('../component/layout'));
const ShikwasaProviderLazy = React.lazy(() => import('../hooks').then(module => ({ default: module.ShikwasaProvider })));


function App({ Component, pageProps }) {

  return (
    <RecoilRoot>
      <Head>
        <title>Permacast</title>
        <meta name="description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:image" content={`https://permacast.app/favicon.ico`} />
        <meta name="twitter:title" content={`Permacast`} />
        <meta name="twitter:url" content={`https://permacast.app/`}></meta>
        <meta name="twitter:description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />

        <meta property="og:card" content="summary" />
        <meta property="og:image" content={`https://permacast.app/favicon.ico`} />
        <meta property="og:title" content={`Permacast`} />
        <meta property="og:url" content={`https://permacast.app/`} />
        <meta property="og:description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />
      </Head>
        <ArconnectProvider permissions={PERMISSIONS}>
          <QueryPodcasts />
          <QueryANS />
          <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={true} />
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-4XDV8F7VJB"
            strategy="afterInteractive" 
          />
          <Script id="gtag-function">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4XDV8F7VJB');
            `}
          </Script>
          <ShikwasaProviderLazy>
            <Layout>
              <SSRProvider>
                    <Component {...pageProps} className="scrollbar-container"/>
              </SSRProvider>
            </Layout>
          </ShikwasaProviderLazy>
          </QueryClientProvider>
        </ArconnectProvider>
    </RecoilRoot>
  )
}

export default appWithTranslation(App);
