import '../shikwasa-src/css/base.css';
import '../shikwasa-src/css/chapter.css';
import '../styles/globals.css';

import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import Script from 'next/script';
import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { PERMISSIONS } from '@/constants/arconnect';
import { queryClient } from '@/lib/react-query';

const ArconnectProvider = React.lazy(() => import('react-arconnect').then(module => ({ default: module.ArconnectProvider })));
const Layout = React.lazy(() => import('@/component/layout'));
const QueryAns = React.lazy(() => import('@/features/prefetching').then(module => ({ default: module.QueryAns })));
const QueryPodcasts = React.lazy(() => import('@/features/prefetching').then(module => ({ default: module.QueryPodcasts })));
const RecoilRoot = React.lazy(() => import('recoil').then(module => ({ default: module.RecoilRoot })));
const ShikwasaProviderLazy = React.lazy(() => import('@/hooks/useShikwasa').then(module => ({ default: module.ShikwasaProvider })));


function App({ Component, pageProps }) {
  // todo: outsource head to a component / outsource info as variables
  return (
    <RecoilRoot>
      <Head>
        <title>Permacast</title>
        <meta name="description" content={`Permanent podcasting on Arweave. Pay once, store forever.`} />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:image" content={`https://permacast.app/favicon.ico`} />
        <meta name="twitter:title" content={`Permacast`} />
        <meta name="twitter:url" content={`https://permacast.app/`}></meta>
        <meta name="twitter:description" content={`Permanent podcasting on Arweave. Pay once, store forever.`} />

        <meta property="og:card" content="summary" />
        <meta property="og:image" content={`https://permacast.app/favicon.ico`} />
        <meta property="og:title" content={`Permacast`} />
        <meta property="og:url" content={`https://permacast.app/`} />
        <meta property="og:description" content={`Permanent podcasting on Arweave. Pay once, store forever.`} />
      </Head>
        <ArconnectProvider permissions={PERMISSIONS}>

          <QueryClientProvider client={queryClient}>
            <QueryPodcasts />
            <QueryAns />
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
                <Component {...pageProps} className="scrollbar-container"/>
              </Layout>
            </ShikwasaProviderLazy>
          </QueryClientProvider>
        </ArconnectProvider>
    </RecoilRoot>
  )
}

export default appWithTranslation(App);
