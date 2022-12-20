import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Shikwasa from "../shikwasa-src/main.js";
import { useTranslation } from "react-i18next";
import { FaRss, FaRegGem } from "react-icons/fa";
import { PlusIcon, HeartIcon } from "@heroicons/react/24/solid";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import Track from "../component/track.jsx";
import TipButton from "../component/reusables/tip.jsx";
import UploadEpisode from "./uploadEpisode.jsx";
import UploadVideo from "./uploadVideo.jsx";
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";
import {
  arweave,
  smartweave,
  NEWS_CONTRACT,
  MESON_ENDPOINT,
} from "../utils/arweave.js";
// import * as SmartWeaveSdk from 'redstone-smartweave';
// import { contract } from 'redstone-smartweave';
// import { Dialog, Transition } from '@headlessui/react'
// import { Fragment } from 'react'
import {
  convertToPodcast,
  convertToEpisode,
  getPodcasts,
  getPodcastEpisodes,
  getPodcast,
} from "../utils/podcast.js";
import { Cooyub } from "../component/reusables/icons";

import { getButtonRGBs } from "../utils/ui.js";
import { appContext } from "../utils/initStateGen.js";
import { isDarkMode } from "../utils/theme.js";
import { API_MAP } from "../utils/arweave.js";

import { useRecoilState } from "recoil";
import {
  switchFocus,
  videoSelection,
  primaryData,
  secondaryData,
} from "../atoms";
import { useLocation, useHistory } from "react-router-dom";

export default function Podcast(props) {
  const { t } = useTranslation();
  const appState = useContext(appContext);
  const { address, setAddress } = appState.user;
  const [loading, setLoading] = useState(true);

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
  const [secondaryData_, setSecondaryData_] = useRecoilState(secondaryData);

  const [thePodcast, setThePodcast] = useState(null);
  const [podcastHtml, setPodcastHtml] = useState(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const [videoShows_, setVideoShows_] = useState([]);
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const { setCurrentPodcastColor, currentPodcastColor } = appState.theme;

  const { isOpen, setIsOpen } = appState.globalModal;
  const [isPlaying, setIsPlaying] = useState(false);

  const loadEpisodes = async (podcast, episodes) => {
    console.log(podcast);
    const episodeList = [];
    for (let i in episodes) {
      let e = episodes[i];
      // console.log("episode", e)
      if (e.eid !== "FqPtfefS8QNGWdPcUcrEZ0SXk_IYiOA52-Fu6hXcesw") {
        episodeList.push(
          <div
            className="flex flex-col md:flex-row justify-between items-center shadow-lg rounded-xl border border-zinc-800 hover:border-white px-10 py-5 md:py-2 my-4 md:h-24 mx-3 md:mx-auto"
            key={e.eid}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-x-10 mr-5">
              <div className="flex space-x-10 mb-3 md:mb-0">
                <button onClick={() => showPlayer(podcast, e)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <a
                  href={`${MESON_ENDPOINT}/${e.contentTx}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </a>
              </div>
              <div className="font-bold w-full md:w-auto text-center">
                {e.episodeName}
              </div>
            </div>
            <div className="text-sm w-full md:w-auto text-center">
              {truncatedDesc(e.description, 52)}
            </div>
          </div>
        );
      }
    }
    return episodeList;
  };

  const checkEpisodeForm = async (podObj) => {
    if (
      address === podObj.creatorAddress ||
      podObj.superAdmins.includes(address)
    ) {
      setShowEpisodeForm(true);
      window.scrollTo(0, 0);
    } else {
      alert("Not the owner of this podcast");
    }
  };

  const truncatedDesc = (desc, maxLength) => {
    if (desc.length < maxLength) {
      return <>{desc}</>;
    } else {
      return (
        <>
          {desc.substring(0, maxLength)}...{" "}
          <span
            className="text-blue-500 hover:cursor-pointer"
            onClick={() => showDesc(desc)}
          >
            [read more]
          </span>
        </>
      );
    }
  };

  const showDesc = (desc) => {
    Swal.fire({
      text: desc,
      button: "close",
      customClass: "font-mono",
    });
  };

  const showPlayer = (podcast, e) => {
    const player = new Shikwasa({
      container: () => document.querySelector(".podcast-player"),
      themeColor: "gray",
      theme: `${isDarkMode() ? "dark" : "light"}`,
      autoplay: true,
      audio: {
        title: e.episodeName,
        artist: podcast.podcastName,
        cover: `${MESON_ENDPOINT}/${podcast?.cover}`,
        src: `${MESON_ENDPOINT}/${e.contentTx}`,
      },
      download: true,
    });
    player.play();
  };

  useEffect(() => {
    console.log(
      primaryData_.podcasts.filter((obj) => {
        return obj.pid === props.match.params.podcastId;
      })[0].episodes
    );

    setSecondaryData_(
      primaryData_.podcasts.filter((obj) => {
        return obj.pid === props.match.params.podcastId;
      })[0]
    );

    setVideoShows_(
      primaryData_.podcasts.filter((obj) => {
        return obj.pid === props.match.params.podcastId;
      })[0].episodes
    );

    let playerObj_ = document.getElementById("hidden-player");
    playerObj_.pause();
    playerObj_.src =
      "https://arweave.net/" + secondaryData_.episodes[0].contentTx;
  }, []);

  let playerObj_ = document.getElementById("hidden-player");
  const history = useHistory();
  const location = useLocation();

  const isOwner =
    thePodcast?.creatorAddress === address ||
    thePodcast?.superAdmins?.includes(address);

  return (
    <div className="flex flex-col items-center justify-center mb-20">
      <div
        className={`w-full mb-6 bg-black rounded-[2px] transition-all ${
          switchFocus_
            ? "opacity-0 h-[0px] duration-200"
            : "opacity-100 h-[607.50px] duration-200"
        }`}
      >
        <video
          id="hidden-player"
          class="video-js"
          controls
          preload="auto"
          poster={"https://arweave.net/" + secondaryData_.cover}
          data-setup="{}"
          className="rounded-[4px] w-full h-full"
        >
          <source src={"#"} type="video/*"></source>
          <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading
            to a web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
            </a>
          </p>
        </video>
      </div>

      <PodcastHeader
        thePodcast={thePodcast}
        isOwner={true}
        // isOwner={isOwner}
        loading={loading}
        currentPodcastColor={currentPodcastColor}
      />
      <UploadVideo podcast={thePodcast} />
      <UploadEpisode podcast={thePodcast} />
      {/* {loading && <h5 className="p-5">{t("loadingepisodes")}</h5>} */}

      <div className="w-full">
        
        {switchFocus_
          ? videoShows_.length > 0 &&
          videoShows_.map((e, i) => (
              <div
                key={i}
                className="mb-6 p-2.5 border rounded-xl border-zinc-600"
              >
                <Track
                  episode={e}
                  includeDescription={true}
                  episodeNumber={i + 1}
                />
              </div>
            ))
          : videoShows_.map((e, i) => {
              return (
                <div className={``}>
                  <div className="mb-6 p-2.5 border rounded-xl border-zinc-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center relative">
                        <img
                          className="h-14 w-14 rounded-lg cursor-pointer object-cover"
                          src={"https://arweave.net/" + secondaryData_.cover}
                          alt={e.episodeName}
                          onClick={() => {}}
                        />
                        <div className="ml-4 flex flex-col">
                          <div
                            className="cursor-pointer line-clamp-1 pr-2 text-sm"
                            onClick={() => {
                              // history.push(`/`)
                            }}
                          >
                            {e.episodeName}
                          </div>
                          <div className="flex items-center">
                            {true && (
                              <>
                                <p className="text-zinc-400 text-[8px]">by</p>
                                <div className="ml-1.5 p-1 bg-black/40 rounded-full cursor-pointer">
                                  <div className="flex items-center min-w-max">
                                    {/* <img className="h-6 w-6" src={cover} alt={title} /> */}
                                    <Cooyub
                                      className="rounded-full"
                                      svgStyle="h-2 w-2"
                                      rectStyle="h-6 w-6"
                                      fill={"#007600"}
                                    />
                                    <p
                                      className="text-[8px] pr-1 ml-1 "
                                      onClick={() => {}}
                                    >
                                      {secondaryData_.author}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="mx-1.5 w-full line-clamp-1 text-xs">
                              {e.description}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer rounded-[34px] p-3 bg-black/40"
                        onClick={() => {
                          // Minor video control..
                          if (playerObj_.src === 'https://arweave.net/'+e.contentTx) {
                            if (isPlaying) {
                              playerObj_.pause();
                              setIsPlaying(false);
                            } else {
                              playerObj_.play();
                              setIsPlaying(true);
                            }
                          } else {
                            // setCurrentVideo(e)
                            playerObj_.src = 'https://arweave.net/'+e.contentTx;
                            playerObj_.pause();
                          }
                        }}
                      >
                        <PlayIcon className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        {!loading && podcastEpisodes.length === 0 && (
          <h5 className="py-5">{t("noepisodes")}</h5>
        )}
      </div>

      <div className="podcast-player sticky bottom-0 w-screen" />
    </div>
  );
}

// export function PodcastView({podcast}) {
//   const appState = useContext(appContext);
//   const {title, description} = podcast;

//   return (
//     <div className="h-full">
//       <div className="p-14 flex w-full border border-zinc-800 rounded-3xl">
//         <div className="col-span-2 my-3 text-zinc-100 max-w-xs md:max-w-lg mr-2">
//           <div className="font-medium cursor-pointer line-clamp-1"></div>
//           <div className="text-sm line-clamp-5"></div>
//         </div>
//       </div>
//       <div>
//         {podcast.episodes?.map((e, i) => (
//           <div className="mt-4">
//             <Track episode={e} key={i} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // // // // // Auxiliary Functions

// Podcast Header element 👇👇👇
const PodcastHeader = ({
  thePodcast,
  isOwner,
  loading,
  currentPodcastColor,
}) => {
  const { t } = useTranslation();
  const appState = useContext(appContext);
  const { setIsOpen } = appState.globalModal;

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
  const [secondaryData_, setSecondaryData_] = useRecoilState(secondaryData);

  const loadRss = () => {
    window.open(API_MAP.rss + thePodcast.podcastId, "_blank");
  };
  return (
    <div className={``}>
      {Object.keys(secondaryData_).length > 0 && (
        <div className="pb-14 flex flex-col justify-center md:flex-row md:items-center w-full">
          <img
            className="w-40 cursor-pointer rounded-sm mx-auto md:mx-0 md:mr-8"
            src={'https://arweave.net/'+secondaryData_?.cover}
            alt={secondaryData_.podcastName}
          />
          <div className="col-span-2 my-3 text-zinc-100 w-full md:w-4/6 md:mr-2">
            <div className="text-center md:text-left text-xl font-semibold tracking-wide select-text line-clamp-1 hover:line-clamp-none">
              {secondaryData_?.podcastName}
            </div>
            <div className="line-clamp-5 hover:line-clamp-none select-text">
              {secondaryData_?.description}
            </div>
          </div>
          <div className="mx-auto md:mx-0 md:ml-auto md:mr-9">
            <div className="flex items-center justify-between">
              <button
                className="btn btn-primary btn-sm normal-case rounded-full border-0"
                style={getButtonRGBs(currentPodcastColor)}
                onClick={() => loadRss()}
              >
                <FaRss className="mr-2 w-3 h-3" />
                <span className="font-normal">RSS</span>
              </button>
              {!isOwner && (
                <div className="ml-4">
                  <TipButton />
                </div>
              )}
              {secondaryData_ && isOwner && (
                <button
                  className="btn btn-outline btn-sm normal-case rounded-full border-0 flex cursor-pointer font-normal ml-4"
                  style={getButtonRGBs(currentPodcastColor)}
                  onClick={() => setIsOpen(true)}
                >
                  <PlusIcon className="mr-2 w-4 h-4" />{" "}
                  {t("podcast.newepisode")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
