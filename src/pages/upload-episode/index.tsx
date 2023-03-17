import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { EpisodeForm, episodeTitleStyling, uploadEpisodeStyling } from "../../component/uploadEpisode/uploadEpisodeTools"
import { genArweaveAPI } from 'arseeding-js'
import { useState } from 'react';
import { handleFileChange, inspectEventContentType } from '../../utils/arseeding';

export default function UploadEpisode() {
    
    const { t } = useTranslation();

    const [file, setFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<string>("")


  const url = 'https://arweave.net/5TKKx0-_GyvH5hZ3pKjSox8LcYfoRlufo1yJeicJZAY';
    
    return (
        <div className={uploadEpisodeStyling}>
            <p className={episodeTitleStyling}>{t("uploadepisode.title")}</p>
            <EpisodeForm />
            <input type="file" onChange={(e) => handleFileChange(e)} />Save Audio

            <button onClick={(e: any) => setMediaType(inspectEventContentType(e))}>Upload Audio</button>
            <p>{mediaType}</p>
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

