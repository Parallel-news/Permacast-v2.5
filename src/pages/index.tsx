import axios from 'axios';
import { NextPage } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Greeting } from "../component/featured";
import FeaturedChannelModal from '../component/home/featuredChannelModal';
import FeaturedPodcast, { featuredPocastCarouselStyling } from '../component/home/featuredPodcast';
import FeaturedCreators from '../component/creator/featuredCreators';
import Loading from '../component/reusables/loading';
import {
  featuredEpisode,
  latestEpisodesAtom,
  podcastsAtom
} from "../atoms/index";

import { Episode, EXMDevState, FeaturedChannel, FullEpisodeInfo, Podcast } from '../interfaces';
import Track from '../component/reusables/track';
import { getContractVariables, getFeaturedChannelsContract } from '../utils/contract';
import GetFeatured from '../component/home/getFeatured';
import { findPodcast } from '../utils/filters';

interface HomeProps {
  isProduction: boolean,
  contractAddress: string,
  featuredContractAddress: string
};

const Home: NextPage<HomeProps> = ({ isProduction, contractAddress, featuredContractAddress }) => {

  const { t } = useTranslation();


  const [podcasts_, setPodcasts_] = useRecoilState(podcastsAtom);
  const [featuredEpisode_, setFeaturedEpisode_] = useRecoilState(featuredEpisode);
  const [latestEpisodes, setLatestEpisodes] = useRecoilState(latestEpisodesAtom);


  const [featuredChannels, setFeaturedChannels] = useState<FeaturedChannel[]>([]);
  const [loading, setLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // re-write to use internal state
      const exmState: EXMDevState = (await axios.get('/api/exm/read')).data;

      const { podcasts } = exmState;
      const episodes: FullEpisodeInfo[] = podcasts
        .map((podcast: Podcast) => podcast.episodes
          .map((episode: Episode, index: number) => 
            ({podcast, episode: {...episode, order: index}})))
              .flat();
      const sorted = episodes.sort((episodeA, episodeB) => episodeB.episode.uploadedAt - episodeA.episode.uploadedAt);
      setLatestEpisodes(sorted.splice(0, 3));
      const sortedPodcasts = podcasts.filter((podcast: Podcast) => podcast.episodes.length > 0 && !podcast.podcastName.includes("Dick"));
      const foundFeaturedChannels = featuredChannels
        .map(
          (channel: FeaturedChannel) => findPodcast(channel.pid, podcasts))
            .filter((channel: Podcast) => channel);
      setPodcasts_([...(foundFeaturedChannels || []) ,...sortedPodcasts].splice(0, 4));
      setLoading(false);
    };
    const fetchFeatured = async () => {
      const featuredPodcasts = (await axios.get('/api/exm/featured-channels/read')).data;
      setFeaturedChannels(featuredPodcasts?.state?.featured_channels || []);
    };
    fetchFeatured()
    fetchData();
  }, []);
 
  return (
    <div className="w-full pb-10 mb-10">
      <Greeting />
      {isProduction !== true &&
        <div className="select-text">
          <p className='text-yellow-500 font-bold'>Heads up: isProduction !== "true"</p>
          <div className="text-teal-300 flex gap-x-1">EXM Main Address: <p className="underline font-medium">{contractAddress}</p></div>
          <div className="text-indigo-300 flex gap-x-1">EXM Feature Channel Address: <p className="underline font-medium">{featuredContractAddress}</p></div>
        </div>
      }
      {podcasts_.length > 0 ? (
        <>
          <GetFeatured onClick={() => setIsVisible(true)} />
          {isVisible && <FeaturedChannelModal {...{ isVisible, setIsVisible }} />}
          <div className={featuredPocastCarouselStyling}>
            {podcasts_.map((podcast: Podcast, index: number) =>
              <FeaturedPodcast {...podcast} key={index} />
            )}
          </div>
        </>
      ) : <Loading />}

      {/* {Object.keys(secondaryData_).length > 0 ? (
        <FeaturedPodcastsMobile />
      ) : (
        <Loading />
      )} */}
      <div className="my-9 flex flex-col xl:flex-row md:justify-between space-y-10 xl:space-y-0">
        <div className="w-[100%] xl:w-[71%]">
          {!loading ? (
            <>
              <h2 className="text-zinc-400 text-lg mb-3">{t("home.recentlyadded")}</h2>
              <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
                {latestEpisodes.map((episode: FullEpisodeInfo, index: number) => (
                  <div key={index}>
                    <Track {...{ episode }} openFullscreen includeDescription includePlayButton  />
                  </div>
                )) || <div className="w-[100%] xl:w-[71%]"><Loading /></div>}
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
  );
};

export async function getStaticProps({ locale }) {
  const { isProduction, contractAddress } = await getContractVariables();
  let { contractAddress: featuredContractAddress } = await getFeaturedChannelsContract();
  if(!featuredContractAddress) {
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
    },
  }
}


// Home.getInitialProps = async () => {
//   // { query }: { query: { user: string; } })
//   try {
//       const res = await axios.get(``);
//       const userInfo = res.data;  // <-- Access one more data object here
//       return { pathFullInfo: userInfo };
//   } catch (error) {
//       console.log("attempting to use domain routing...")
//       return { pathFullInfo: false };
//   };
// };

export default Home

//xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2
//xl:col-span-3 lg:col-span-2 md:col-span-1