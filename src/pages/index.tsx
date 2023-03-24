import axios from 'axios';
import { NextPage } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useEffect, useState, } from "react";
import { useRecoilState } from "recoil";

import {
  Greeting,
  FeaturedEpisode,
  FeaturedPodcastsMobile,
  RecentlyAdded,
} from "../component/featured";
import FeaturedPodcast from '../component/home/featuredPodcast';
import FeaturedCreators from '../component/home/featuredCreators';
import Loading from '../component/reusables/loading';
import {
  podcasts,
  featuredCreators,
  featuredEpisode,
  featuredPodcasts,
  latestEpisodes,
  switchFocus,
 } from "../atoms/index";

import { Episode, EXMDevState, PodcastDev } from '../interfaces';


const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);

  const [podcasts_, setPodcasts_] = useRecoilState(podcasts);
  const [featuredEpisode_, setFeaturedEpisode_] = useRecoilState(featuredEpisode);
  const [latestEpisodes_, setLatestEpisodes_] = useRecoilState(latestEpisodes);
  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  // const [recentlyAdded]


  
  useEffect(() => {
    console.log("index.tsx useEffect");
    const fetchData = async () => {
      setLoading(true)
      const exmState: EXMDevState = (await axios.get('/api/exm/read')).data
      const { podcasts } = exmState;
      const episodes: Episode[] = podcasts.map((podcast: PodcastDev) => podcast.episodes).flat()
      
      setLatestEpisodes_(episodes.sort((episodeA, episodeB) => episodeB.uploadedAt - episodeA.uploadedAt))
      setPodcasts_(podcasts)

      setLoading(false)
    };

    fetchData()

  }, []);

  const PodcastTypeButton = () => {
    return (
      <button 
        className={`btn btn-sm btn-primary`}
        onClick={() => {
          setSwitchFocus_(true);
        }}
      >
      </button>
    )
  }

  return (
    <div className="w-full pb-10 mb-10">
      <Greeting />

      {/* {latestEpisodes_.length > 0 ? (
        <div className="hidden md:block">
          <FeaturedEpisode />
        </div>
      ) : <Loading />} */}

      {podcasts_.length > 0 ? (
        <div className="w-full mt-8 carousel gap-x-12 py-3">
          {podcasts_.map((podcast: PodcastDev, index: number) => 
            <FeaturedPodcast {...podcast} key={index} />
          )}
        </div>
      ): <Loading />}

      {/* {Object.keys(secondaryData_).length > 0 ? (
        <FeaturedPodcastsMobile />
      ) : (
        <Loading />
      )} */}
      <div className="my-9 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
        <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 mb-9">
          {!loading ? (
            <RecentlyAdded />
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