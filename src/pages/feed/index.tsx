import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { chronStatusAtom, hide0EpisodesAtom, loadingPage } from "@/atoms/index";
import { Podcast } from "@/interfaces/index";
import { getVisiblePodcast } from "@/features/prefetching/api";
import { MoonLoader } from "react-spinners";
import { LOADER_COLOR } from "@/constants/index";

const ViewDropDown = React.lazy(() => import("../../component/viewDropDown"));
const PodcastGrid = React.lazy(() => import("../../component/home/PodcastGrid"));

const titleRow = `flex flex-row justify-between items-end mb-10 `;
const allPodcastHeader = `text-3xl text-neutral-300/90 font-semibold pt-10 text-center md:text-start `;

const FeedPage: NextPage = () => {

  const { t } = useTranslation();

  const [chronStatus,] = useRecoilState<number>(chronStatusAtom);
  const [hide0Episodes, ] = useRecoilState<boolean>(hide0EpisodesAtom);
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage);

  const querySortedPodcastData = getVisiblePodcast()

  let sortedPodcasts = querySortedPodcastData.data?.podcasts
  console.log("sp: ", sortedPodcasts)

  if(querySortedPodcastData.isSuccess) {
    sortedPodcasts = sortedPodcasts
      .sort((a, b) => a.createdAt - b.createdAt)
      .filter((podcast: Podcast) => hide0Episodes ? podcast.episodes.length > 0: podcast);
    if (chronStatus % 2) {
      sortedPodcasts = sortedPodcasts.reverse();
    } else {
      sortedPodcasts = querySortedPodcastData.data?.podcasts;
    }
  }

  useEffect(() => _setLoadingPage(false), [])

  return (
    <>
      <div className={titleRow}>
        <h2 className={allPodcastHeader}>{t("feed-page.allpodcasts")}</h2>
        <ViewDropDown />
      </div>
      {querySortedPodcastData.isLoading ? <MoonLoader size={50} color={LOADER_COLOR}/> : null}
      <React.Suspense>
        {querySortedPodcastData.isSuccess && (<PodcastGrid podcasts={sortedPodcasts} />)}
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
