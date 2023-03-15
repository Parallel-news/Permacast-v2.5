import Head from 'next/head';
import Script from 'next/script';
import { appWithTranslation } from 'next-i18next';

import { RecoilRoot } from 'recoil';
import { ArconnectProvider } from 'react-arconnect';

import Layout from '../component/layout';


import '../shikwasa-src/css/base.css';
import '../shikwasa-src/css/chapter.css';
import '../styles/globals.css';

// import { AnimatePresence } from "framer-motion";



function App({ Component, pageProps }) {
  return (
    <RecoilRoot> 
      {/* <AnimatePresence exitBeforeEnter> */}
        <ArconnectProvider>
          <Head>
            <title>Permacast</title>
            <meta name="description" content="Home | Permacast" />
            <meta name="twitter:card" content="summary" />
            {/* <link rel="icon" href={user ? `https://pz-prepnb.meson.network/${user.avatar}` : "https://ar.page/favicon.png"} />
            <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1 minimum-scale=1" />
            <meta name="description" content={user ? `${user.bio} | ar.page` : "Home | ar.page"} />
            <meta name="twitter:image" content={(user) ? `https://pz-prepnb.meson.network/${user.avatar}` : "https://ar.page/favicon.png"} />
            <meta name="twitter:title" content={user ? `${user.currentLabel} | ar.page` : "Home | ar.page"} />
            <meta name="twitter:url" content={user ? `https://${user.currentLabel}.ar.page` : "https://ar.page"} />
            <meta name="twitter:description" content={user ? user.bio : "All your Web3 content, finally stored in one place."} />
            <meta name="twitter:site" content="@decentdotland" /> */}

            {/* <meta name="og:card" content="summary" />
            <meta name="description" content={user ? `${user.currentLabel} | ar.page` : "Home | ar.page"} />
            <meta name="og:image" content={user ? `https://pz-prepnb.meson.network/${user.avatar}` : "https://ar.page/favicon.png"} />
            <meta name="og:title" content={user ? `${user.currentLabel} | ar.page` : "Home | ar.page"} />
            <meta name="og:url" content={user ? `https://${user.currentLabel}.ar.page` : "https://ar.page"} />
            <meta name="og:description" content={user ? user.bio : "All your Web3 content, finally stored in one place."} /> */}
          </Head>
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ArconnectProvider>
      {/* </AnimatePresence> */}
    </RecoilRoot>
  )
}

export default appWithTranslation(App);
