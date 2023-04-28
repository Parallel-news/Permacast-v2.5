import axios from 'axios';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { EXM_READ_LINK, NO_SHOW } from '../../../../constants';
import { getContractVariables } from '../../../../utils/contract';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRecoilState } from 'recoil';
import { loadingPage } from '../../../../atoms';

const episodeTitleStyling = "text-white text-xl mt-4"
const showErrorTag = "flex justify-center items-center m-auto text-white font-semibold text-xl"
const uploadEpisodeStyling = "flex flex-col justify-center items-center m-auto space-y-3 relative"

const EpisodeForm = React.lazy(() => import('../../../../component/uploadEpisode/uploadEpisodeTools').then(module => ({ default: module.EpisodeForm })));

export default function UploadEpisode({yourShows, error, pid, eid}) {
    
    const { t } = useTranslation();
    const [, _setLoadingPage] = useRecoilState(loadingPage)
    useEffect(() => {
        _setLoadingPage(false)
    }, [])
    
    if(error.length > 0) {
      return (
        <p className={showErrorTag}>{error}</p>
      ) 
    } else {
      return (
        <div className={uploadEpisodeStyling}>
            <p className={episodeTitleStyling}>{t("uploadshow.editpodcast")}</p>
            <EpisodeForm 
              shows={yourShows}
              pid={pid}
              eid={eid}
              edit={true}
            />
        </div>
      )
    }
}

export async function getServerSideProps(context) {
    const { contractAddress } = getContractVariables()
    const { locale, query } = context;
    const { pid, eid } = query;
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
        error,
        pid,
        eid
      },
    }
  }
