import axios from "axios";
import { EXM_READ_LINK, NO_SHOW } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import React from "react";

const ShowForm = React.lazy(() => import("../../component/uploadShow/uploadShowTools").then(module => ({ default: module.ShowForm })));

const showTitleStyling = "text-white text-xl mb-4"
const uploadShowStyling = "w-full flex flex-col justify-center items-center space-y-1 pb-[200px]"

export default function UploadShow({yourShows, error}) {

    const { t } = useTranslation();

    return (
        <div className={uploadShowStyling}>
            <p className={showTitleStyling}>{t("uploadshow.addpodcast")}</p>
            <ShowForm 
                podcasts={yourShows}
                edit={true}
                selectedPid="6ad59891f28a921b170eaf08966e97d4a70522aba439d07ed116e5c732838723ea44a536b9a4a3e7609dd51855cdc9f05d7b9b896ad433df2d20b21b8d1acfd0"
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