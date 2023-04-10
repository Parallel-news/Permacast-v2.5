import axios from "axios";
import { useTranslation } from "next-i18next";
import { EXM_READ_LINK, NO_SHOW } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Podcast } from "../../interfaces";
import FeaturedPodcast from "../../component/home/featuredPodcast";

export default function ViewPodcasts({yourShows}) {

    const allPodcastHeader = "text-3xl text-neutral-300/90 font-semibold pt-10 pb-10 text-center md:text-start"
    const podcastContainer = "grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 gap-y-10"

    console.log("Your Shows: ", yourShows)
    const { t } = useTranslation();
    return (
        <>
            <h2 className={allPodcastHeader}>{t("viewPodcasts.allpodcasts")}</h2>
            <div className={podcastContainer}>
                {yourShows.map((podcast: Podcast, index: number) =>
                    <FeaturedPodcast {...podcast} key={index} />
                )}
            </div>
        </>

    )
}
//<FeaturedPodcast {...podcast} key={index} />
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