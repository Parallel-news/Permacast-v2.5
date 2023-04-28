import axios from 'axios';
import React, { Suspense } from 'react';
import { NextPage } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { latestEpisodesAtom, podcastsAtom } from "../atoms/index";
import { Episode, EXMState, FeaturedChannel, FullEpisodeInfo, Podcast } from '../interfaces';
import { getContractVariables, getFeaturedChannelsContract, getPASOMContract } from '../utils/contract';
import { findPodcast } from '../utils/filters';
import { featuredPocastCarouselStyling } from '../component/home/featuredPodcast';


const GetFeatured = React.lazy(() => import('../component/home/getFeatured'))
const Track = React.lazy(() => import('../component/reusables/track'))
const Loading = React.lazy(() => import('../component/reusables/loading'))
const FeaturedCreators = React.lazy(() => import('../component/creator/featuredCreators'))
const FeaturedPodcast = React.lazy(() => import('../component/home/featuredPodcast'))
const FeaturedChannelModal = React.lazy(() => import('../component/home/featuredChannelModal'))
const GreetingLazy = React.lazy(() => import("../component/featured").then(module => ({ default: module.Greeting })));

interface HomeProps {
  isProduction: boolean,
  contractAddress?: string,
  featuredContractAddress?: string,
  PASoMContractAddress?: string,
};

const Home: NextPage<HomeProps> = ({ isProduction, contractAddress, featuredContractAddress, PASoMContractAddress }) => {

  const { t } = useTranslation();
  const [podcasts_, setPodcasts_] = useRecoilState(podcastsAtom);
  const [latestEpisodes, setLatestEpisodes] = useRecoilState(latestEpisodesAtom);
  const [featuredChannels, setFeaturedChannels] = useState<FeaturedChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // re-write to use internal state
      const exmState: EXMState = (await axios.get('/api/exm/read')).data;

      const { podcasts } = exmState;
      const episodes: FullEpisodeInfo[] = podcasts
        .map((podcast: Podcast) => podcast.episodes
          .map((episode: Episode, index: number) =>
            ({ podcast, episode: { ...episode, order: index } })))
        .flat();
      const sorted = episodes.sort((episodeA, episodeB) => episodeB.episode.uploadedAt - episodeA.episode.uploadedAt);
      setLatestEpisodes(sorted.splice(0, 3));
      const sortedPodcasts = podcasts.filter((podcast: Podcast) => podcast.episodes.length > 0 && !podcast.podcastName.includes("Dick"));
      const foundFeaturedChannels = featuredChannels
        .map(
          (channel: FeaturedChannel) => findPodcast(channel.pid, podcasts))
        .filter((channel: Podcast) => channel);
      setPodcasts_([...(foundFeaturedChannels || []), ...sortedPodcasts].splice(0, 6));
      setLoading(false);
    };
    const fetchFeatured = async () => {
      const featuredPodcasts = (await axios.get('/api/exm/featured-channels/read')).data;
      setFeaturedChannels(featuredPodcasts?.state?.featured_channels || []);
    };
    fetchFeatured()
    fetchData()
    setMounted(true)
  }, []);

  // Check for Mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  const HomeLoader = () => {
    return (
      <div className="w-full pb-10 mb-10">
        <GreetingLazy />

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
        <GreetingLazy />
        {isProduction !== true &&
          <div className="select-text">
            <p className='text-yellow-500 font-bold'>Heads up: isProduction !== "true"</p>
            <div className="text-teal-300 flex gap-x-1">EXM Main Address: <p className="underline font-medium">{contractAddress}</p></div>
            <div className="text-indigo-300 flex gap-x-1">EXM Feature Channel Address: <p className="underline font-medium">{featuredContractAddress}</p></div>
            <div>(PRODUCTION) PASoM Contract Address: {PASoMContractAddress}</div>
          </div>
        }
        {podcasts_.length > 0 ? (
          <>
            {/* <GetFeatured onClick={() => setIsVisible(true)} /> */}
            {isVisible && <FeaturedChannelModal {...{ isVisible, setIsVisible }} />}
            <div className={featuredPocastCarouselStyling}>
              {podcasts_.map((podcast: Podcast, index: number) =>
                <FeaturedPodcast {...podcast} key={index} />
              )}
            </div>
          </>
        ) 
        : 
        <Loading />
        }
        <div className="my-9 flex flex-col xl:flex-row md:justify-between space-y-10 xl:space-y-0">
          <div className="w-[100%] xl:w-[71%]">
            {!loading ? (
              <>
                <h2 className="text-zinc-400 text-lg mb-3">{t("home.recentlyadded")}</h2>
                <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
                  {latestEpisodes.map((episode: FullEpisodeInfo, index: number) => (
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
          {!loading ? (
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
