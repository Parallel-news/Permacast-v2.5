import React, { useContext } from 'react';
import { appContext } from '../utils/initStateGen.js';

import { 
  Greeting,
  FeaturedEpisode,
  FeaturedPodcastsMobile,
  RecentlyAdded,
  FeaturedCreators
} from '../component/featured';


export default function Home({recentlyAdded, featuredPodcasts, creators}) {
  const appState = useContext(appContext)
  const Loading = () => <div className="w-full h-[100px] rounded-3xl mt-2 animate-pulse bg-gray-300/30"></div>

  return (
    <div className="overflow-scroll w-full pb-10">
      {!appState.loading ? (
        <Greeting />
      ): <Loading />}
      {!appState.loading ? (
        <div className="hidden md:block">
          <FeaturedEpisode episode={recentlyAdded[0]} episodeId={1} />
        </div>
      ): <Loading />}
      {/* {!appState.loading ? (
        <div className="hidden md:grid w-full mt-8 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
          <FeaturedPodcasts podcasts={featuredPodcasts} />
        </div>
      ): <Loading />} */}
      {!appState.loading ? (
        <FeaturedPodcastsMobile podcasts={featuredPodcasts} />
      ): <Loading />}
      <div className="my-9 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
        <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 mb-9">
          {!appState.loading ? (
            <RecentlyAdded episodes={recentlyAdded} />
          ): <Loading />}
        </div>
        {!appState.loading ? (
          <div className="w-full">
            <FeaturedCreators creators={creators} />
          </div>
        ): <Loading />}
      </div>
    </div>
  )
}
