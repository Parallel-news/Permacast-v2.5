import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../utils/initStateGen.js";
import {
  Greeting,
  FeaturedEpisode,
  FeaturedPodcastsMobile,
  RecentlyAdded,
  FeaturedCreators,
} from "../component/featured";
import handler, { getAllData } from "../services/services";
import { primaryData, secondaryData, switchFocus } from "../atoms/index.js";
import { useRecoilState } from "recoil";

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

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
  const [secondaryData_, setSecondaryData_] = useRecoilState(secondaryData);

  const [recentlyAdded_, setRecentlyAdded_] = useState([]);
  const Loading = () => (
    <div className="w-full h-[100px] rounded-3xl mt-2 animate-pulse bg-gray-300/30"></div>
  );
  useEffect(() => {
    const abortContr = new AbortController()
    const getAllData_ = () => {
      getAllData({signal: abortContr.signal}).then((data) => {
          setPrimaryData_(data);
          setSecondaryData_(
            data.podcasts.filter((obj) => {
              if(switchFocus_){
                return obj.contentType === 'audio/'
              }else{
                return obj.contentType === 'video/'
              }
            })[0]
          )
          setRecentlyAdded_(
            data.podcasts.filter((obj) => {
              if(switchFocus_){
                return obj.contentType === 'audio/'
              }else{
                return obj.contentType === 'video/'
              }
            })
          )
          return () => {
            abortContr.abort()
          }
      });
    };
    try {
     getAllData_();
    } catch (e) {
      // console.log(e);
    }
  }, []);

  // console.log(Object.keys(secondaryData_) > 0)
  return (
    <div className="overflow-scroll w-full pb-10 mb-10">
      {Object.keys(secondaryData_).length > 0 ? <Greeting /> : <Loading />}
      {!appState.loading && (
        <div
          className={`w-full h-[25px] flex flex-row ml-[6px] relative bottom-5`}
        >
          <div
            className={`h-full min-w-[30px] rounded-[20px] flex flex-row justify-center items-center mx-1 cursor-pointer ${
              switchFocus_
                ? "bg-white/70 hover:bg-white/80"
                : "bg-white/50 hover:bg-white/80"
            } transition-all duration-200`}
            onClick={() => {
              setSwitchFocus_(true);
              setRecentlyAdded_(
                primaryData_.podcasts.filter((obj) => obj.contentType === "audio/")
                );
                // handler({x: 'req'})
            }}
          >
            <p className={`m-2 text-black/80 font-medium text-[13px]`}>
              Episodes
            </p>
          </div>

          <div
            className={`h-full min-w-[30px] rounded-[20px] flex flex-row justify-center items-center mx-1 cursor-pointer ${
              !switchFocus_
                ? "bg-white/70 hover:bg-white/80"
                : "bg-white/50 hover:bg-white/80"
            } transition-all duration-200`}
            onClick={() => {
              setSwitchFocus_(false);
              setRecentlyAdded_(
                primaryData_.podcasts.filter((obj) => obj.contentType === "video/")
              );
              // console.log(data_)
            }}
          >
            <p className={`m-2 text-black/80 font-medium text-[13px]`}>
              Videos
            </p>
          </div>
        </div>
      )}

      { Object.keys(secondaryData_).length > 0 ? (
        <div className="hidden md:block">
          <FeaturedEpisode />
        </div>
      ) : <Loading />}

      {/* {Object.keys(secondaryData_).length > 0 ? (
        <div className="hidden md:grid w-full mt-8 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
          <FeaturedPodcasts podcasts={featuredPodcasts} />
        </div>
      ): <Loading />} */}

      {Object.keys(secondaryData_).length > 0 ? (
        <FeaturedPodcastsMobile />
      ) : (
        <Loading />
      )}
      <div className="my-9 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
        <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 mb-9">
          {Object.keys(secondaryData_).length > 0 ? (
            <RecentlyAdded />
          ) : (
            <Loading />
          )}
        </div>
        {Object.keys(secondaryData_).length > 0 ? (
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
