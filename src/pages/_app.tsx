import Head from 'next/head';
import Script from 'next/script';
import { appWithTranslation } from 'next-i18next';
import { RecoilRoot } from 'recoil';
import { ArconnectProvider } from 'react-arconnect';
import Layout from '../component/layout';
import '../shikwasa-src/css/base.css';
import '../shikwasa-src/css/chapter.css';
import '../styles/globals.css';
import { MINT_DURATION, TOAST_POSITION } from '../constants';
import { Toaster } from 'react-hot-toast';
import { ShikwasaProvider } from '../hooks';
import React, { useEffect } from 'react';
import localStorageObjectManager, { PODCAST_COVER_COLORS_MANAGER } from '../utils/localstorage';


function App({ Component, pageProps }) {

  useEffect(() => {
    new localStorageObjectManager(PODCAST_COVER_COLORS_MANAGER);
  }, [])
  
  return (
    <RecoilRoot>
          <Head>
            <title>Permacast</title>
            <meta name="description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />
            <meta name="twitter:image" content={`https://permacast-v2-5.vercel.app/favicon.ico`} />
            <meta name="twitter:title" content={`Permacast`} />
            <meta name="twitter:url" content={`https://permacast.dev/`}></meta>
            <meta name="twitter:description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />

            <meta name="og:card" content="summary" />
            <meta name="description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} />
            <meta name="og:image" content={`https://permacast-v2-5.vercel.app/favicon.ico`} />
            <meta name="og:title" content={`Permacast`} />
            <meta name="og:url" content={`https://permacast.dev/`} />
            <meta name="og:description" content={`Permanent podcasting on Arweave. Pay once, store forever, never lose your episodes.`} /> 
          </Head>
        <ArconnectProvider>
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
          <ShikwasaProvider>

            <Toaster
              position={TOAST_POSITION}
              reverseOrder={false}
              toastOptions={{
                  duration: MINT_DURATION
              }}
            />

            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ShikwasaProvider>
        </ArconnectProvider>
    </RecoilRoot>
  )
}

export default appWithTranslation(App);
