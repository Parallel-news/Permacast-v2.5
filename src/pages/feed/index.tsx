import axios from "axios";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { Suspense, startTransition, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { chronStatusAtom, hide0EpisodesAtom, loadingPage } from "@/atoms/index";
import { EXM_READ_LINK, NO_SHOW } from "@/constants/index";

import { getContractVariables } from "@/utils/contract";
import { detectTimestampType } from "@/utils/reusables";
import { Podcast } from "@/interfaces/index";

import { getPodcastData } from "@/features/prefetching";

const ViewDropDown = React.lazy(() => import("../../component/viewDropDown"));
const PodcastGrid = React.lazy(() => import("../../component/home/PodcastGrid"));

const titleRow = `flex flex-row justify-between items-end mb-10 `;
const allPodcastHeader = `text-3xl text-neutral-300/90 font-semibold pt-10 text-center md:text-start `;

const FeedPage: NextPage = () => {

  const { t } = useTranslation();

  const [chronStatus,] = useRecoilState<number>(chronStatusAtom);
  const [hide0Episodes, setHide0Episodes] = useRecoilState<boolean>(hide0EpisodesAtom);
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage);

  const queryPodcastData = getPodcastData();

  const [sortedPodcasts, setSortedPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    if (queryPodcastData.isLoading || queryPodcastData.isError) return;
    if (!!queryPodcastData?.data?.podcasts?.length) return;
    const unifiedTimestamps = queryPodcastData.data.podcasts.map((podcast: Podcast) => {
      if (detectTimestampType(podcast.createdAt) === "seconds") {
        podcast.createdAt = podcast.createdAt * 1000
        return podcast;
      };
    });
    console.log(unifiedTimestamps)
    setSortedPodcasts(unifiedTimestamps);
  }, [queryPodcastData.data]);

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

  useEffect(() => {
    _setLoadingPage(false)
  }, [])

  return (
    <div>
      <div className={titleRow}>
        <div className="flex md:hidden"></div>
        <h2 className={allPodcastHeader}>{t("feed-page.allpodcasts")}</h2>
        <ViewDropDown />
      </div>
      <>
        {sortedPodcasts.length !== 0 && <PodcastGrid podcasts={sortedPodcasts} />}
      </>
      <div className="mt-20"></div>
    </div>
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