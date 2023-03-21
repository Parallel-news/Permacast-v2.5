import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { EXM_READ_LINK, NO_SHOW } from '../../constants';
import { getContractVariables } from '../../server/contract';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { EpisodeForm, episodeTitleStyling, showErrorTag, uploadEpisodeStyling } from "../../component/uploadEpisode/uploadEpisodeTools"

export default function UploadEpisode({yourShows, error}) {
    
    const { t } = useTranslation();
    console.log(yourShows)
    if(error.length > 0) {
      return (
        <p className={showErrorTag}>{error}</p>
      ) 
    } else {
      return (
        <div className={uploadEpisodeStyling}>
            <p className={episodeTitleStyling}>{t("uploadepisode.title")}</p>
            <EpisodeForm 
              shows={yourShows}
            />
        </div>
      )
    }
}

export async function getStaticProps({ locale }) {
    const { contractAddress } = getContractVariables()
    let yourShows = null
    let error = "";
    try {
      const res = await axios.get(EXM_READ_LINK+contractAddress)
      yourShows = res.data?.podcasts
    } catch(e) {
      error = NO_SHOW
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
        ])),
        yourShows,
        error
      },
    }
  }