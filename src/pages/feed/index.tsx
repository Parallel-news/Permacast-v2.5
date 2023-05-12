import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { FC, Suspense, startTransition, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { chronStatusAtom, hide0EpisodesAtom, loadingPage } from "../../atoms";
import { EXM_READ_LINK, NO_SHOW } from "../../constants";
import { getContractVariables } from "../../utils/contract";
import { detectTimestampType } from "../../utils/reusables";
import { Podcast } from "../../interfaces";

const ViewDropDown = React.lazy(() => import("../../component/viewDropDown"));
const FeaturedPodcast = React.lazy(() => import("../../component/home/featuredPodcast"));

const titleRow = `flex flex-row justify-between items-end mb-10 lg:mx-10`;
const allPodcastHeader = `text-3xl text-neutral-300/90 font-semibold pt-10 text-center md:text-start `;
const podcastContainer = `grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 gap-y-10 pb-40 `;

interface FeedPageProps {
  yourShows: Podcast[];
};

const FeedPage: FC<FeedPageProps> = ({ yourShows }) => {
  const { t } = useTranslation();

  const [chronStatus,] = useRecoilState<number>(chronStatusAtom);
  const [hide0Episodes, setHide0Episodes] = useRecoilState<boolean>(hide0EpisodesAtom);
  const [shows, setShows] = useState<Podcast[]>([]);
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage)

  useEffect(() => {
    let showsCopy = [...yourShows];
    let shows = showsCopy
      .sort((a, b) => a.createdAt - b.createdAt)
      .filter((podcast: Podcast) => hide0Episodes ? podcast.episodes.length > 0: podcast);
    startTransition(() => {
      if (chronStatus % 2) {
        setShows(shows.reverse());
      } else {
        setShows(shows);
      };
    })
  }, [chronStatus, hide0Episodes, yourShows]);

  useEffect(() => {
    _setLoadingPage(false)
  }, [])

  const Podcasts: FC<{ shows: Podcast[] }> = ({ shows }) => {
    return (
      <div className={podcastContainer} id="3x">
        {shows.map((podcast: Podcast, index: number) =>
          <FeaturedPodcast {...podcast} key={index} />
        )}
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={<div></div>}>
        <div className={titleRow}>
          <div className="flex md:hidden"></div>
          <h2 className={allPodcastHeader}>{t("feed-page.allpodcasts")}</h2>
            <ViewDropDown />
        </div>
        {shows.length !== 0 && <Podcasts shows={shows} />}
      </Suspense>
    </>
  );
};

export async function getStaticProps({ locale }) {
  const { contractAddress } = getContractVariables()
  let yourShows = null
  let error = "";
  try {
    const res = await axios.get(EXM_READ_LINK + contractAddress)
    yourShows = res.data?.podcasts;
    yourShows.map((podcast: Podcast) => {
      if (detectTimestampType(podcast.createdAt) === "seconds") {
        podcast.createdAt = podcast.createdAt * 1000
        return podcast;
      }
    })
  } catch (e) {
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

export default FeedPage;