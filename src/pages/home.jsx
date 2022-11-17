import React, { useContext } from "react";
import { appContext } from "../utils/initStateGen.js";
import {
  Greeting,
  FeaturedEpisode,
  FeaturedPodcastsMobile,
  RecentlyAdded,
  FeaturedCreators,
} from "../component/featured";

// var featuredVideoShows = [{
// contentTx: null,
// contentUrl: null,
// cover: "https://pz-prepnb.meson.network/06tCA0ZK6NwYktkPS0Y1mO8cRdoKTIDNanJhdYl0DBc",
// createdAt: 1652871579,
// creatorANS: "darwin.ar",
// creatorAddress: "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0",
// creatorEmail: "",
// creatorName: "Darwin",
// description: "Terra Public Radio and TerraSpaces was created to provide a free platform and service to help educate the public. TerraSpaces is an auditory time capsule of the early days of a world changing ecosystem.",
// episodesCount: 452,
// explicit: "no",
// firstTenEpisodes: function firstTenEpisodes(),​
// getEpisodes: function getEpisodes(start, end),
// language: "en",
// mediaType: null,
// objectType: "podcast",
// podcastId: "IKsjaUBJiKNDtLPIOyobkUM6iPtTKAK2bMDBu30KdmE",
// rgb: "rgb(179,198,225)",
// superAdmins: Array [ "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0", "kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI" ],
// title: "TerraSpaces.org",
// visible: true
// }]

export default function Home({ recentlyAdded, featuredPodcasts }) {
  const appState = useContext(appContext);
  const Loading = () => (
    <div className="w-full h-[100px] rounded-3xl mt-2 animate-pulse bg-gray-300/30"></div>
  );

  return (
    <div className="overflow-scroll w-full pb-10 mb-10">
      {!appState.loading ? <Greeting /> : <Loading />}
      {!appState.loading ? (
        <div className="hidden md:block">
          <FeaturedEpisode episode={recentlyAdded[0]} episodeId={1} />
        </div>
      ) : (
        <Loading />
      )}

      {/* {!appState.loading ? (
        <div className="hidden md:grid w-full mt-8 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
          <FeaturedPodcasts podcasts={featuredPodcasts} />
        </div>
      ): <Loading />} */}

      {!appState.loading ? (
        <FeaturedPodcastsMobile podcasts={featuredPodcasts} />
      ) : (
        <Loading />
      )}
      <div className="my-9 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
        <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 mb-9">
          {!appState.loading ? (
            <RecentlyAdded episodes={recentlyAdded} />
          ) : (
            <Loading />
          )}
        </div>
        {!appState.loading ? (
          <div className="w-full">
            <FeaturedCreators />
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
