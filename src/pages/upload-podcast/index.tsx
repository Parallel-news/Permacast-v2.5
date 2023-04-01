import axios from "axios";
import { ShowForm, uploadShowStyling, showTitleStyling } from "../../component/uploadShow/uploadShowTools"
import { EXM_READ_LINK, NO_SHOW } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";

export default function UploadShow({yourShows, error}) {

    const { t } = useTranslation();

    return (
        <div className={uploadShowStyling}>
            <p className={showTitleStyling}>{t("uploadshow.addpodcast")}</p>
            <ShowForm 
                podcasts={yourShows}
            />
        </div>
    )
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
