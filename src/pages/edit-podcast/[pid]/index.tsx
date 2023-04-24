/* eslint-disable jsx-a11y/no-onchange */
import axios from "axios";
import { EXM_READ_LINK, NO_SHOW } from "../../../constants";
import { getContractVariables } from "../../../utils/contract";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import React from "react";

const ShowForm = React.lazy(() => import("../../../component/uploadShow/uploadShowTools").then(module => ({ default: module.ShowForm })));

const showTitleStyling = "text-white text-xl mb-4"
const uploadShowStyling = "w-full flex flex-col justify-center items-center space-y-1 pb-[200px]"

export default function UploadShow({yourShows, error, pid}) {

    const { t } = useTranslation();

    return (
        <div className={uploadShowStyling}>
            <p className={showTitleStyling}>{t("uploadshow.editpodcast")}</p>
            <ShowForm 
                podcasts={yourShows}
                edit={true}
                selectedPid={pid}
            />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { locale, params } = context;
    const { pid } = params;
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
        error,
        pid
      },
    }
}