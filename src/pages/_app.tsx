import Head from 'next/head';
import Script from 'next/script';
import { appWithTranslation } from 'next-i18next';

import { RecoilRoot } from 'recoil';
import { AnsProvider } from 'ans-for-all';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { mainnet, goerli } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../component/layout';


import '@rainbow-me/rainbowkit/styles.css';
import '../shikwasa-src/css/base.css';
import '../shikwasa-src/css/chapter.css';
import '../styles/globals.css';

// import { AnimatePresence } from "framer-motion";



function App({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [mainnet],
    [publicProvider()]
  );
  const { connectors } = getDefaultWallets({appName: 'Permacast', chains});
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })
  
  return (
    <RecoilRoot> 
      {/* <AnimatePresence exitBeforeEnter> */}
        <AnsProvider>
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
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={darkTheme({accentColor: "rgb(24,24,27)"})}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </RainbowKitProvider>
          </WagmiConfig>
        </AnsProvider>
      {/* </AnimatePresence> */}
    </RecoilRoot>
  )
}

export default appWithTranslation(App);
