import axios from "axios";
import { useTranslation } from "next-i18next";
import { EXM_READ_LINK, NO_SHOW } from "../../../constants";
import { getContractVariables } from "../../../utils/contract";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Podcast } from "../../../interfaces";
import { useEffect, useState } from "react";
import { detectTimestampType } from "../../../utils/reusables";
import React from "react";
import { chronStatusAtom } from "../../../atoms";
import { useRecoilState } from "recoil";

const FeaturedPodcast = React.lazy(()=> import("../../../component/home/featuredPodcast"))
const ViewDropDown = React.lazy(()=> import("../viewDropDown"))

export default function ViewPodcasts({yourShows}) {

    const titleRow = "flex flex-row justify-between items-end mb-10"
    const allPodcastHeader = "text-3xl text-neutral-300/90 font-semibold pt-10 text-center md:text-start"
    const podcastContainer = "grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 gap-y-10 mb-10"

    const { t } = useTranslation();
	const [chronStatus, ] = useRecoilState<number>(chronStatusAtom)
	const [shows, setShows] = useState<Podcast[]>([])

	useEffect(() => {
		const showsCopy = [...yourShows];
		const shows = showsCopy.sort((a, b) =>  a.createdAt - b.createdAt)
		if(chronStatus % 2) {
			setShows(shows.reverse()) 
		} else {
			setShows(shows)
		}
	}, [chronStatus])

    return (
        <>
			<div className={titleRow}>
				{/*Header*/}
				<div className="flex md:hidden"></div>
				<h2 className={allPodcastHeader}>{t("viewPodcasts.allpodcasts")}</h2>
				<ViewDropDown />
			</div>
			{/*Podcasts*/}
            <div className={podcastContainer}>
                {shows.map((podcast: Podcast, index: number) =>
                    <FeaturedPodcast {...podcast} key={index} />
                )}
            </div>
        </>

    )
}

export async function getStaticProps({ locale }) {
    const { contractAddress } = getContractVariables()
    let yourShows = null
    let error = "";
    try {
      const res = await axios.get(EXM_READ_LINK+contractAddress)
      yourShows = res.data?.podcasts
	  yourShows.map(item => {
		if(detectTimestampType(item.createdAt) === "seconds") {
			item.createdAt = item.createdAt*1000
			return item;
		}
	  })
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