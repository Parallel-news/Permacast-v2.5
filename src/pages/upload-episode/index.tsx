import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { EpisodeForm, episodeTitleStyling, uploadEpisodeStyling } from "../../component/uploadEpisode/uploadEpisodeTools"
import { genAPI, genArweaveAPI } from 'arseeding-js'
import { useEffect, useState } from 'react';

export default function UploadEpisode() {
    
    const { t } = useTranslation();
    
    const mockUpload = async () => {
      const instance = await genArweaveAPI(window.arweaveWallet)
      console.log("Instance: ", instance)
      const arseedUrl = 'https://arseed.web3infra.dev'
      const data = Buffer.from('Sebastians Message')
      const payCurrency = 'ar' // everpay supported all tokens
      const ops = {
          tags: [{name: "Content-Type", value:'text/markdown'}]
      }
      const res = await instance.sendAndPay(arseedUrl, data, payCurrency, ops)
      console.log(res)

    }

    const [contentType, setContentType] = useState(null);
  const url = 'https://arweave.net/5TKKx0-_GyvH5hZ3pKjSox8LcYfoRlufo1yJeicJZAY';

  useEffect(() => {
    const checkContentType = async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        const ct = response.headers.get('content-type');
        setContentType(ct);
      } catch (error) {
        console.error('Error fetching content type:', error);
      }
  };

    checkContentType();
  }, [url]);
    
    return (
        <div className={uploadEpisodeStyling}>
            <p className={episodeTitleStyling}>{t("uploadepisode.title")}</p>
            <EpisodeForm />
            <button onClick={() => mockUpload()}>Test</button>
            <p>{contentType}</p>
        </div>
    )
}


export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
        ])),
      },
    }
  }

/*
{
    "everHash": "0x177070a2796cc98d90aa08c8a1d84ddcf1e16baba9ae1a12fcab5d1975447d86",
    "order": {
        "itemId": "5TKKx0-_GyvH5hZ3pKjSox8LcYfoRlufo1yJeicJZAY",
        "size": 1091,
        "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
        "currency": "AR",
        "decimals": 12,
        "fee": "210797217",
        "paymentExpiredTime": 1679023161,
        "expectedBlock": 1138863
    }
}






*/
