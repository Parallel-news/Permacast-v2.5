import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { EpisodeForm, episodeTitleStyling, uploadEpisodeStyling } from "../../component/uploadEpisode/uploadEpisodeTools"
import { genAPI, genArweaveAPI } from 'arseeding-js'
import { useEffect, useState } from 'react';

export default function UploadEpisode() {
    
    const { t } = useTranslation();

    const [file, setFile] = useState<File | null>(null);
    // For Description Upload
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("e: ", event.target)
      const selectedFile = event.target.files ? event.target.files[0] : null;
      const sF = event.target.files[0];
      const fileType = sF.type;
      console.log("File type:", fileType);
      setFile(selectedFile);
    };

    // For Audio Upload
    const uploadAudio = async () => {
      if (!file) {
        console.log("No file selected");
        return;
      }
    
      const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
    
          reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
          };
    
          reader.onerror = () => {
            reject(reader.error);
          };
    
          reader.readAsArrayBuffer(file);
        });
      };
    
      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const audioBuffer = Buffer.from(arrayBuffer);
    
        // Now you have the audioBuffer, you can use it in your `instance.sendAndPay` function
    
        // Your existing code
        const instance = await genArweaveAPI(window.arweaveWallet);
        console.log("Instance: ", instance);
        const arseedUrl = "https://arseed.web3infra.dev";
        const payCurrency = "ar"; // everpay supported all tokens
        const ops = {
          tags: [{ name: "Content-Type", value: "image/jpg" }], // Adjust the MIME type based on your audio file type
        };
        const res = await instance.sendAndPay(arseedUrl, audioBuffer, payCurrency, ops);
    
        // Handle the response
        console.log("Upload response:", res);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

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
            <input type="file" onChange={(e) => handleFileChange(e)} />Save Audio

            <button onClick={(e: any) => uploadAudio()}>Upload Audio</button>
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

// DESCRIPTION
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

//AUDIO m4a
{
    "everHash": "0xb9bc595edd23675a37c652a665cbd6bda9db767294e57e972cf315778c8a6097",
    "order": {
        "itemId": "4xUWbi9nRziW0gAeUaKUGg1onPD5VXvfscBbfrFIGJo",
        "size": 107133,
        "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
        "currency": "AR",
        "decimals": 12,
        "fee": "210797217",
        "paymentExpiredTime": 1679080099,
        "expectedBlock": 1139318
    }
}

AUDIO MP3
{
    "everHash": "0x5254646cbdfa60be1ac286e9929c2daa37bb780b27b479384ae07d019e9c4ecc",
    "order": {
        "itemId": "PDjIxrwvc9HX2Iaf3VFqtuiKy9C-Cp5kGj-iEPetAFQ",
        "size": 136284,
        "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
        "currency": "AR",
        "decimals": 12,
        "fee": "210797217",
        "paymentExpiredTime": 1679081759,
        "expectedBlock": 1139333
    }
}

// VIDEO MP4
{
    "everHash": "0x1516d73345ab7fbc1da95477290617494975ed00d55af0ed680e396cdda12262",
    "order": {
        "itemId": "oz7zITe4FE73tW4p2kFH1cn72NX1mZ5gAI18wojRA1U",
        "size": 4062722,
        "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
        "currency": "AR",
        "decimals": 12,
        "fee": "3334505112",
        "paymentExpiredTime": 1679085272,
        "expectedBlock": 1139363
    }
}

//Image 
{
    "everHash": "0x098db23a2ee2a38ebc4e25b54650cb2369c6df29cb7e3476bea9e091a075d7da",
    "order": {
        "itemId": "VhR924DdS0BKokinDkOrBhkfxVHaY6F8dB_c_QP0N-M",
        "size": 182272,
        "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
        "currency": "AR",
        "decimals": 12,
        "fee": "210797217",
        "paymentExpiredTime": 1679087162,
        "expectedBlock": 1139377
    }
}
*/
