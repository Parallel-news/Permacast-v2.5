import axios from "axios";
import { useRecoilState } from "recoil";
import { loadingPage } from "../../atoms";
import { useTranslation } from "next-i18next";
import React, { Suspense, useEffect } from "react";
import { EXM_READ_LINK, NO_SHOW } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import LoadingForm from "../../component/reusables/loadingForm";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ShowForm = React.lazy(() => import("../../component/uploadShow/uploadShowTools").then(module => ({ default: module.ShowForm })));

const showTitleStyling = "text-white text-xl mb-4"
const uploadShowStyling = "w-full flex flex-col justify-center items-center space-y-1 pb-[200px]"

export default function UploadShow({yourShows, error}) {

    const { t } = useTranslation();
    const [, _setLoadingPage] = useRecoilState(loadingPage)

    useEffect(() => {
      _setLoadingPage(false)
    }, [])

    return (
        <div className={uploadShowStyling}>
          <Suspense fallback={
            <LoadingForm 
              width={"w-[825px]"}
              height={"h-[500px]"}
              justify={"justify-start"}
            />
          }>
            <p className={showTitleStyling}>{t("uploadshow.addpodcast")}</p>
              <ShowForm 
                  podcasts={yourShows}
                  edit={false}
                  selectedPid=""
              />
          </Suspense>
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