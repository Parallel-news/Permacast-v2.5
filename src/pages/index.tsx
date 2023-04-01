import axios from 'axios';
import { NextPage } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import {
  Greeting, RecentlyAdded
} from "../component/featured";
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


const Home: NextPage = () => {

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
      <div className="my-9 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
        <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 mb-9">
          {!loading ? (
            <>
              <h2 className="text-zinc-400 text-lg mb-3">{t("home.recentlyadded")}</h2>
              <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
                {latestEpisodes.map((episode: FullEpisodeInfo) => (
                  <div className="hidden md:block">
                    <Track {...{episode }} includeDescription includePlayButton  />
                  </div>
                )) || <Loading />}
              </div>
            </>
          ) : (
            <Loading />
          )}
        </div>
        {!loading ? (
          <div className="w-full">
            <FeaturedCreators />
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
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