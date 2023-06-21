import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { chronStatusAtom, hide0EpisodesAtom, loadingPage } from "@/atoms/index";
import { Podcast } from "@/interfaces/index";

import { getPodcastData } from "@/features/prefetching";
import { getUnixSortedPodcast } from "@/features/prefetching/api";

const ViewDropDown = React.lazy(() => import("../../component/viewDropDown"));
const PodcastGrid = React.lazy(() => import("../../component/home/PodcastGrid"));

const titleRow = `flex flex-row justify-between items-end mb-10 `;
const allPodcastHeader = `text-3xl text-neutral-300/90 font-semibold pt-10 text-center md:text-start `;

const FeedPage: NextPage = () => {

  const { t } = useTranslation();

  const [chronStatus,] = useRecoilState<number>(chronStatusAtom);
  const [hide0Episodes, setHide0Episodes] = useRecoilState<boolean>(hide0EpisodesAtom);
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage);

  //const queryPodcastData = getPodcastData();
  const querySortedPodcastData = getUnixSortedPodcast()

  const [sortedPodcasts, setSortedPodcasts] = useState<Podcast[]>([]);
  console.log("x: ", querySortedPodcastData.data)
  console.log("Loading: ", querySortedPodcastData.isLoading)
  console.log("Success:", querySortedPodcastData.isSuccess)

 /*
  useEffect(() => {
    let resortedPodcasts = sortedPodcasts
      .sort((a, b) => a.createdAt - b.createdAt)
      .filter((podcast: Podcast) => hide0Episodes ? podcast.episodes.length > 0: podcast);
    startTransition(() => {
      if (chronStatus % 2) {
        setSortedPodcasts(resortedPodcasts.reverse());
      } else {
        setSortedPodcasts(resortedPodcasts);
      };
    })
  }, [chronStatus, hide0Episodes]);
  */
  useEffect(() => {
    _setLoadingPage(false)
  }, [])

  return (
    <>
      <div className={titleRow}>
        <h2 className={allPodcastHeader}>{t("feed-page.allpodcasts")}</h2>
        <ViewDropDown />
      </div>
      {querySortedPodcastData.isLoading ? <p>Loading...</p> : null}
      <React.Suspense>
        {querySortedPodcastData.isSuccess && (<PodcastGrid podcasts={querySortedPodcastData.data?.podcasts} />)}
      </React.Suspense>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ]))
    },
  }
}

export default FeedPage;

/*

      
      
*/