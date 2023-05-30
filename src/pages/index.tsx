import axios from 'axios';
import React, { Suspense } from 'react';
import { NextPage } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { latestEpisodesAtom, loadingPage, podcastsAtom } from "../atoms/index";
import { Episode, EXMState, FeaturedChannel, FullEpisodeInfo, Podcast } from '../interfaces';
import { getContractVariables, getFeaturedChannelsContract, getPASOMContract } from '../utils/contract';
import { findPodcast } from '../utils/filters';
import FeaturedPodcastCarousel from '../component/reusables/FeaturedPodcastCarousel';
import { startTransition } from 'react';


const GetFeatured = React.lazy(() => import('../component/home/getFeatured'))
const Track = React.lazy(() => import('../component/reusables/track'))
//const Loading = React.lazy(() => import('../component/reusables/loading'))
const FeaturedCreators = React.lazy(() => import('../component/creator/featuredCreators'))
const FeaturedPodcast = React.lazy(() => import('../component/home/featuredPodcast'))
const FeaturedChannelModal = React.lazy(() => import('../component/home/featuredChannelModal'))
//const GreetingLazy = React.lazy(() => import("../component/featured").then(module => ({ default: module.Greeting })));
import { Greeting } from '../component/featured';
import Loading from '../component/reusables/loading';
import { useMutation, useQuery } from '@tanstack/react-query';

interface HomeProps {
  isProduction: boolean,
  contractAddress?: string,
  featuredContractAddress?: string,
  PASoMContractAddress?: string,
};


const getHomepageState = async () => {
  // const queries = [{
  //   key: 'episodes',
  //   query: `(
  //   )`
  // }];
  const data = (await axios.get('/api/exm/read', {
    // queries,
  })).data;
  const { podcasts } = data;
  const episodes: FullEpisodeInfo[] = podcasts
    .map((podcast: Podcast) => podcast.episodes
      .map((episode: Episode, index: number) =>
        ({ podcast, episode: { ...episode, order: index } })))
    .flat();
  const sortedEpisodes = episodes.sort((episodeA, episodeB) => episodeB.episode.uploadedAt - episodeA.episode.uploadedAt).splice(0, 3);
  const sortedPodcasts = podcasts.filter((podcast: Podcast) => podcast.episodes.length > 0 && !podcast.podcastName.includes("Dick"));

  return { sortedEpisodes, sortedPodcasts };
};

const Home: NextPage<HomeProps> = ({ isProduction, contractAddress, featuredContractAddress, PASoMContractAddress }) => {

  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [, _setLoadingPage] = useRecoilState(loadingPage);

  const stateQuery = useQuery({
    queryKey: ['getHomepageState'],
    queryFn: getHomepageState
  })

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
              <FeaturedCreators />
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
