import axios from "axios";
import { NextPage } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { Suspense, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useQuery } from '@tanstack/react-query';

import { loadingPage } from "@/atoms/index";

import { Episode, FullEpisodeInfo, Podcast } from '@/interfaces/index';
import { getContractVariables, getFeaturedChannelsContract, getPASOMContract } from '@/utils/contract';

const FeaturedPodcastCarousel = React.lazy(() => import('@/component/reusables/FeaturedPodcastCarousel'));
// const GetFeatured = React.lazy(() => import('../component/home/getFeatured'))
const Track = React.lazy(() => import('@/component/reusables/track'))
//const Loading = React.lazy(() => import('../component/reusables/loading'))
const FeaturedCreators = React.lazy(() => import('@/component/creator/featuredCreators'))
const FeaturedPodcast = React.lazy(() => import('@/component/home/featuredPodcast'))
const FeaturedChannelModal = React.lazy(() => import('@/component/home/featuredChannelModal'))
const Greeting = React.lazy(() => import("@/component/featured").then(module => ({ default: module.Greeting })));;
const Loading = React.lazy(() => import('@/component/reusables/loading'));

interface HomeProps {
  isProduction: boolean,
  contractAddress?: string,
  featuredContractAddress?: string,
  PASoMContractAddress?: string,
};

const getHomepageState = async () => {
  const QUERY_PODCAST_KEY = 'podcastKey';
  const QUERY_FEATURED_CREATORS = 'featuredCreators';

  // https://docs.jsonata.org/simple
  const queries = [{
    key: QUERY_PODCAST_KEY,
    query: `podcasts`
  }, {
    key: QUERY_FEATURED_CREATORS,
    query: `(
      $distinct(
        $sort(podcasts, function($l, $r) {
          $count($l.episodes) < $count($r.episodes)
        }).owner
      )[[0..2]]
    )`
  }];

  const results = (await axios.post('/api/exm/read', {
    queries,
  })).data;

  const podcasts = results[QUERY_PODCAST_KEY];
  const featuredCreators = results[QUERY_FEATURED_CREATORS];

  // too lazy to figure out a query for this
  const episodes: FullEpisodeInfo[] = podcasts
    .map((podcast: Podcast) => podcast.episodes
      .map((episode: Episode, index: number) =>
        ({ podcast, episode: { ...episode, order: index } })))
    .flat();
  const sortedEpisodes = episodes.sort((episodeA, episodeB) => episodeB.episode.uploadedAt - episodeA.episode.uploadedAt).splice(0, 3);
  const sortedPodcasts: Podcast[] = podcasts.filter((podcast: Podcast) => podcast.episodes.length > 0 && !podcast.podcastName.includes("Dick")).splice(0, 6);

  return { sortedEpisodes, sortedPodcasts, featuredCreators };
};

const Home: NextPage<HomeProps> = ({ isProduction, contractAddress, featuredContractAddress, PASoMContractAddress }) => {

  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [, _setLoadingPage] = useRecoilState(loadingPage);

  useEffect(() => {
    _setLoadingPage(false)
  }, [])

  const stateQuery = useQuery({
    queryKey: ['getHomepageState'],
    queryFn: getHomepageState
  });

  const HomeLoader = () => {
    return (
      <div className="w-full pb-10 mb-10">
        <Greeting />

        {isProduction !== true &&
          <div className="select-text">
            <p className='text-yellow-500 font-bold'>Heads up: isProduction !== "true"</p>
            <div className="text-teal-300 flex gap-x-1">EXM Main Address: <p className="underline font-medium">{contractAddress}</p></div>
            <div className="text-indigo-300 flex gap-x-1">EXM Feature Channel Address: <p className="underline font-medium">{featuredContractAddress}</p></div>
            <div>(PRODUCTION) PASoM Contract Address: {PASoMContractAddress}</div>
          </div>
        }

        <Loading />
        <div className="my-9 flex flex-col xl:flex-row md:justify-between space-y-10 xl:space-y-0">
          <div className="w-[100%] xl:w-[71%]">
            <Loading />
          </div>
          <div className="w-full xl:w-[27%]"><Loading /></div>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<HomeLoader />}>
      <div className="w-full pb-10 mb-10">
        <Greeting />
        {isProduction !== true &&
          <div className="select-text">
            <p className='text-yellow-500 font-bold'>Heads up: isProduction !== "true"</p>
            <div className="text-teal-300 flex gap-x-1">EXM Main Address: <p className="underline font-medium">{contractAddress}</p></div>
            <div className="text-indigo-300 flex gap-x-1">EXM Feature Channel Address: <p className="underline font-medium">{featuredContractAddress}</p></div>
            <div>(PRODUCTION) PASoM Contract Address: {PASoMContractAddress}</div>

          </div>
        }
        {stateQuery.isSuccess && stateQuery?.data?.sortedPodcasts?.length > 0 ? (
          <>
            {isVisible && <FeaturedChannelModal {...{ isVisible, setIsVisible }} />}
            <FeaturedPodcastCarousel
              podcasts={stateQuery.data.sortedPodcasts}
            />
          </>
        )
          :
          <Loading />
        }
        <div className="my-9 flex flex-col xl:flex-row md:justify-between space-y-10 xl:space-y-0">
          <div className="w-[100%] xl:w-[71%]">
            {!stateQuery.isLoading ? (
              <>
                <h2 className="text-zinc-400 text-lg mb-3">{t("home.recentlyadded")}</h2>
                <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
                  {stateQuery.data.sortedEpisodes.map((episode: FullEpisodeInfo, index: number) => (
                    <div key={index}>
                      <Track {...{ episode }} openFullscreen includeDescription includePlayButton includeContentType />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Loading />
            )}
          </div>
          {!stateQuery.isLoading ? (
            <div className="w-full xl:w-[27%]">
              <FeaturedCreators addresses={stateQuery.data.featuredCreators} />
            </div>
          ) : (
            <div className="w-full xl:w-[27%]"><Loading /></div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export async function getStaticProps({ locale }) {
  const { isProduction, contractAddress } = getContractVariables();
  let { contractAddress: featuredContractAddress } = getFeaturedChannelsContract();
  const { contractAddress: PASoMContractAddress } = getPASOMContract();
  if (!featuredContractAddress) {
    featuredContractAddress = null
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      isProduction,
      contractAddress,
      featuredContractAddress,
      PASoMContractAddress
    },
  }
}

export default Home
