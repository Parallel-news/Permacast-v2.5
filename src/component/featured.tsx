import React, { useState, useContext, useEffect, memo, FC } from "react";
import { useTranslation } from "next-i18next";
import { useArconnect } from 'react-arconnect';
import {
  replaceDarkColorsRGB,
  isTooLight,
  trimANSLabel,
  RGBobjectToString,
} from "../utils/ui";
import { getCreator } from "../utils/podcast";
import { EyeIcon } from "@heroicons/react/24/outline";
import { FaPlay } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import Track from "./track";
import { useRecoilState } from "recoil";
import {
  switchFocus,
  videoSelection,
  creators,
  currentThemeColor,
  latestEpisodes
} from "../atoms";
import { PodcastDev } from "../interfaces/index";

export function Greeting() {
  const { t } = useTranslation();
  const {
    ANS,
  } = useArconnect();
  
  return (
    <div>
      <h1 className="text-zinc-100 text-xl">
        {ANS?.currentLabel ? (
          <>
            {t("home.hi")} {trimANSLabel(ANS?.currentLabel)}!
          </>
        ) : (
          <>{t("home.welcome")}</>
        )}
      </h1>
      <p className="text-zinc-400 mb-9">{t("home.subtext")}</p>
    </div>
  );
}

export function FeaturedEpisode() {

  // const {cover, podcastName, description, pid} = episode; --Episode breakdown
  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [vs_, setVS_] = useRecoilState(videoSelection); // Selected Podcast Object
  const { t } = useTranslation();

  // let history = useHistory();
  // let location = useLocation();
  // const rgb = RGBobjectToString(replaceDarkColorsRGB(episode.rgb)) --styling
  // const url = `/podcast/${primaryData_.pid}/${secondaryData_.eid}`; // --url

  useEffect(() => {
    // setSecondaryData_(
    //   primaryData_.podcasts.filter((obj) => {
    //     if (switchFocus_) {
    //       return obj.contentType === "audio/";
    //     } else {
    //       return obj.contentType === "video/";
    //     }
    //   })[0]
    // );
  }, [switchFocus_]);

  return (
    <div className="p-14 flex w-full border border-zinc-800 rounded-3xl">
      {/* <img
        className="w-40 cursor-pointer mr-8"
        src={"https://arweave.net/" + secondaryData_.cover}
        alt={secondaryData_.podcastName}
        // onClick={() => {
        //   history.push(
        //     `/podcast/${secondaryData_.pid}/${secondaryData_.episodes[0].eid}`
        //   );
        // }}
      /> */}
      <div className="col-span-2 my-3 text-zinc-100 max-w-xs md:max-w-lg mr-2">
        <div
          // onClick={() => {
          //   history.push(
          //     `/podcast/${secondaryData_.pid}/${secondaryData_.episodes[0].eid}`
          //   );
          // }}
          className="font-medium cursor-pointer line-clamp-1"
        >
          {/* {secondaryData_.episodes[0].episodeName} */}
        </div>
        <div className="text-sm line-clamp-5">
          {/* {secondaryData_.episodes[0].description} */}
        </div>
      </div>
      <div className="ml-auto">
        <>
          <div
            className="min-w-min border-0 mt-5 rounded-full flex items-center cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-90 text-black font-semibold bg-[#FFFF00] h-12 p-4"
            // style={getButtonRGBs(rgb)}
            onClick={() => {
              // if (switchFocus_) {
              //   appState.queue.playEpisode(
              //     secondaryData_.episodes[0],
              //     secondaryData_.episodes[0].eid
              //   );
              // } else {
              //   setVS_([
              //     "https://arweave.net/" + secondaryData_.episodes[0].contentTx,
              //     {},
              //   ]);
              // }
            }}
          >
            <FaPlay className="w-3 h-3" />
            <div className="ml-1">{t("home.playfeaturedepisode")}</div>
          </div>
          <div
            className="min-w-min border-0 mt-5 rounded-full flex items-center cursor-pointer backdrop-blur-md transition-transform duration-200 ease-in-out transform hover:scale-90 text-black bg-[#FFFF00] h-12 p-4"
            // style={getButtonRGBs(rgb)}
            onClick={() => {
              // history.push(
              //   `/podcast/${secondaryData_.pid}/${secondaryData_.episodes[0].eid}`
              //   // console.log(secondaryData_.episodes.filter((obj) => {
              //   //   return obj.eid === secondaryData_.episodes[0].eid
              //   // })[0]) // -- Direct access to Episode
              // );
            }}
          >
            <FiEye className="h-5 w-5" />
            <div className="ml-1">{t("home.viewfeaturedepisode")}</div>
          </div>
        </>
      </div>
    </div>
  );
}

export function FeaturedPodcastsMobile() {
  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);

  // const podcasts = primaryData_.podcasts.filter((obj) => {
  //   if (switchFocus_) {
  //     return obj.contentType === "audio/";
  //   } else {
  //     return obj.contentType === "video/";
  //   }
  // });
  return (
    <div className="carousel">
      {/* {podcasts.map((podcast, index) => (
        <div
          className="carousel-item max-w-[280px] md:max-w-xs pr-4"
          key={index}
        >
          <FeaturedPodcast podcast={podcast} />
        </div>
      ))} */}
    </div>
  );
}

export function RecentlyAdded() {
  const { t } = useTranslation();
  const [latestEpisodes_, setLatestEpisodes_] = useRecoilState(latestEpisodes);
  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);

  const [episodes, setEpisodes] = useState([]);
  const createdAt_ = (a, b) => {
    if (a.uploadedAt < b.uploadedAt) {
      return 1;
    } else if (a.uploadedAt > b.uploadedAt) {
      return -1;
    } else {
      return 0;
    }
  };
  useEffect(() => {
    // const data_ = primaryData_.podcasts.filter((obj) => {
    //   if (switchFocus_) {
    //     return obj.contentType === "audio/";
    //   } else {
    //     return obj.contentType === "video/";
    //   }
    // });
    // data_.forEach((obj) => {
    //   setEpisodes(episodes.concat(obj.episodes));
    // });
  }, []);
  return (
    <div className="">
      <h2 className="text-zinc-400 mb-4">{t("home.recentlyadded")}</h2>
      <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
        {episodes.sort(createdAt_).map((episode, index) => (
          <div
            key={index}
            className="border border-zinc-800 rounded-3xl p-3 w-full"
          >
            <Track episode={episode} includeDescription={true} />
          </div>
        ))}
      </div>
    </div>
  );
}

