import axios from 'axios';
import { NextPage } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Greeting } from "../component/featured";
import FeaturedPodcast, { featuredPocastCarouselStyling } from '../component/home/featuredPodcast';
import FeaturedCreators from '../component/creator/featuredCreators';
import Loading from '../component/reusables/loading';
import {
  featuredEpisode,
  latestEpisodesAtom,
  podcastsAtom
} from "../atoms/index";

import { Episode, EXMDevState, FullEpisodeInfo, Podcast, PodcastDev } from '../interfaces';
import Track from '../component/reusables/track';
import { getContractVariables } from '../utils/contract';

interface props {isProduction: string, contractAddress: string};

const Home: NextPage<props> = ({ isProduction, contractAddress }) => {

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [podcasts_, setPodcasts_] = useRecoilState(podcastsAtom);
  const [featuredEpisode_, setFeaturedEpisode_] = useRecoilState(featuredEpisode);
  const [latestEpisodes, setLatestEpisodes] = useRecoilState(latestEpisodesAtom);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const exmState: EXMDevState = (await axios.get('/api/exm/read')).data;
      const { podcasts } = exmState;
      const episodes: FullEpisodeInfo[] = podcasts
        .map((podcast: Podcast) => podcast.episodes
          .map((episode: Episode, index: number) => 
            ({podcast, episode: {...episode, order: index}})))
              .flat();
      const sorted = episodes.sort((episodeA, episodeB) => episodeB.episode.uploadedAt - episodeA.episode.uploadedAt);
      setLatestEpisodes(sorted.splice(0, 3));
      setPodcasts_(podcasts.splice(0, 4));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full pb-10 mb-10">
      <Greeting />
      {isProduction !== "true" &&
        <div className="select-text">
          <p className='text-red-500 font-bold'>Warning: this is staging build!</p>
          <p className="text-teal-300">Address: {contractAddress}</p>
        </div>
      }
      {podcasts_.length > 0 ? (
        <div className={featuredPocastCarouselStyling}>
          {podcasts_.map((podcast: PodcastDev, index: number) =>
            <FeaturedPodcast {...podcast} key={index} />
          )}
        </div>
      ) : <Loading />}

      {/* {Object.keys(secondaryData_).length > 0 ? (
        <FeaturedPodcastsMobile />
      ) : (
        <Loading />
      )} */}
      <div className="my-9 flex flex-col md:flex-row md:justify-between">
        <div className="w-[66%] xl:w-[75%]">
          {!loading ? (
            <>
              <h2 className="text-zinc-400 text-lg mb-3">{t("home.recentlyadded")}</h2>
              <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
                {latestEpisodes.map((episode: FullEpisodeInfo, index: number) => (
                  <div className="hidden md:block" key={index}>
                    <Track {...{ episode }} openFullscreen includeDescription includePlayButton  />
                  </div>
                )) || <div className="w-[66%] xl:w-[75%]"><Loading /></div>}
              </div>
            </>
          ) : (
            <Loading />
          )}
        </div>
        {!loading ? (
          <div className="w-[30%] xl:w-[23%]">
            <FeaturedCreators />
          </div>
        ) : (
          <div className="w-[30%] xl:w-[23%]"><Loading /></div>
        )}
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  const { isProduction, contractAddress } = await getContractVariables();

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      isProduction,
      contractAddress
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