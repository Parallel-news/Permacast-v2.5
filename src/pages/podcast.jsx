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
import { showPodcasts, videoSelection } from "../atoms";
import { useLocation, useHistory } from "react-router-dom";

export default function Podcast(props) {
  const { t } = useTranslation();
  const appState = useContext(appContext);
  const { address, setAddress } = appState.user;
  const [loading, setLoading] = useState(true);

  const [thePodcast, setThePodcast] = useState(null);
  const [podcastHtml, setPodcastHtml] = useState(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const [videoShows, setVideoShows] = useState([
    {
      title: "Pocast",
      src: "https://vod-progressive.akamaized.net/exp=1669176206~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F2915%2F20%2F514576578%2F2384746383.mp4~hmac=f88fb2d86bc618c7e595e731f5580a752ff2719aac1a54f4ae815273230b6b8c/vimeo-prod-skyfire-std-us/01/2915/20/514576578/2384746383.mp4?download=1&filename=pexels-tea-oebel-6892724.mp4",
      author: "@LwaziNF",
      poster:
        "https://images.pexels.com/photos/11884525/pexels-photo-11884525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      desc: "Proident sint elit quis deserunt laborum culpa in magna nisi in voluptate nostrud laborum excepteur. Commodo excepteur amet pariatur aliqua dolor. Velit commodo labore ut nulla.",
    },
    {
      title: "Populous",
      src: "https://vod-progressive.akamaized.net/exp=1669175708~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F409%2F15%2F377048936%2F1574403617.mp4~hmac=fff79a1d6b82cbbdf8b06ed574a3a28a7b16454487475985ec0671664f130f58/vimeo-prod-skyfire-std-us/01/409/15/377048936/1574403617.mp4?download=1&filename=video.mp4",
      author: "@LwaziNF",
      poster:
        "https://images.pexels.com/photos/2826397/pexels-photo-2826397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      desc: "Dolore qui ea cupidatat elit sint labore. Occaecat irure magna esse cupidatat nisi anim sit eu anim qui aliqua quis. Labore officia aute eu velit ad adipisicing proident ad. Esse velit nostrud consequat sit proident sint culpa velit consequat aliqua occaecat exercitation laborum. Anim sunt cupidatat minim ullamco cupidatat non commodo occaecat qui ex. Pariatur esse aliquip exercitation aliqua commodo amet aute elit mollit.",
    },
    {
      title: "Deep Dive",
      src: "https://vod-progressive.akamaized.net/exp=1669175377~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F1007%2F21%2F530035541%2F2496334075.mp4~hmac=23ea0eba503c984cae328d4c5b63593ea6ac416c5cf618f7ccab97b6fb8b951b/vimeo-prod-skyfire-std-us/01/1007/21/530035541/2496334075.mp4?download=1&filename=pexels-kindel-media-7293890.mp4",
      author: "@LwaziNF",
      poster:
        "https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      desc: "Aliquip elit pariatur labore dolor esse exercitation cupidatat nulla reprehenderit cillum magna dolor irure. Commodo eiusmod enim sunt ex. Sint in incididunt amet velit. Exercitation consequat nulla velit consectetur mollit qui non sunt duis in.",
    },
    {
      title: "Drone Stuff",
      src: "https://vod-progressive.akamaized.net/exp=1669175866~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3457%2F15%2F392289251%2F1662078494.mp4~hmac=145c185a58ae88f41040d80cfeb3a5eb54c6f294aad9de9e9e443a4cf216f8f9/vimeo-prod-skyfire-std-us/01/3457/15/392289251/1662078494.mp4?download=1&filename=production+ID%3A3764259.mp4",
      author: "@LwaziNF",
      poster:
        "https://images.pexels.com/photos/5480805/pexels-photo-5480805.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      desc: "Do culpa ullamco laborum ea amet nisi eiusmod ad consequat eu elit. Et officia laborum duis ex minim id quis reprehenderit veniam. Mollit sit non et duis non velit sint enim laboris voluptate.",
    },
  ]);
  const [currentVideo, setCurrentVideo] = useState(videoShows[0])
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
    async function fetchData() {
      setLoading(true);

      const podcastId = props.match.params.podcastId;
      const podcasts = await getPodcasts();
      const p = getPodcast(podcasts, podcastId);
      const ep = await getPodcastEpisodes(podcastId);
      const convertedPodcast = await convertToPodcast(p);
      const convertedEpisodes = await Promise.all(
        ep.map((e) => convertToEpisode(convertedPodcast, e, false))
      );
      setThePodcast(convertedPodcast);
      setCurrentPodcastColor(convertedPodcast?.rgb);
      setPodcastEpisodes(convertedEpisodes);

      setLoading(false);
    }
    fetchData();

    let playerObj_ = document.getElementById("hidden-player");
    playerObj_.pause();
    playerObj_.src = currentVideo.src;
  }, []);

  let playerObj_ = document.getElementById("hidden-player");
  const history = useHistory();
  const location = useLocation();

  const isOwner =
    thePodcast?.creatorAddress === address ||
    thePodcast?.superAdmins?.includes(address);
  const [showPods_, setShowPods_] = useRecoilState(showPodcasts);
  return (
    <div className="flex flex-col items-center justify-center mb-20">
      <Element name="top" className="element"></Element>
      <div
        className={`w-full mb-6 bg-black rounded-[2px] transition-all ${
          showPods_
            ? "opacity-0 h-[0px] duration-200"
            : "opacity-100 h-[607.50px] duration-200"
        }`}
      >
        <video
          id="hidden-player"
          class="video-js"
          controls
          preload="auto"
          poster={currentVideo.poster}
          data-setup="{}"
          className="rounded-[4px] w-full h-full"
        >
          <source src={currentVideo.src} type="video/*"></source>
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
        isOwner={isOwner}
        loading={loading}
        currentPodcastColor={currentPodcastColor}
      />
      {/* <UploadVideo podcast={thePodcast} /> */}
      <UploadEpisode podcast={thePodcast} />
      {loading && <h5 className="p-5">{t("loadingepisodes")}</h5>}

      <div className="w-full">
        {!loading && (
          <div
            className={`w-full h-[25px] flex flex-row ml-[6px] relative bottom-8`}
          >
            <Link
            activeClass="active"
            className="top"
            to="top"
            spy={true}
            smooth={true}
            offset={-999}
            duration={500}
            >
            <div
              className={`h-full min-w-[30px] rounded-[20px] flex flex-row justify-center items-center mx-1 cursor-pointer ${
                showPods_
                  ? "bg-white/70 hover:bg-white/80"
                  : "bg-white/50 hover:bg-white/80"
              } transition-all duration-200`}
              onClick={() => {
                setShowPods_(true);
                playerObj_.pause();
              }}
            >
              <p className={`m-2 text-black/80 font-medium text-[13px]`}>
                Episodes
              </p>
            </div>
            </Link>

            <div
              className={`h-full min-w-[30px] rounded-[20px] flex flex-row justify-center items-center mx-1 cursor-pointer ${
                !showPods_
                  ? "bg-white/70 hover:bg-white/80"
                  : "bg-white/50 hover:bg-white/80"
              } transition-all duration-200`}
              onClick={() => {
                setShowPods_(false);
              }}
            >
              <p className={`m-2 text-black/80 font-medium text-[13px]`}>
                Videos
              </p>
            </div>
          </div>
        )}
        {showPods_
          ? podcastEpisodes &&
            podcastEpisodes.map((e, i) => (
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
          : videoShows.map((e, i) => {
              return (
                <div className={``}>
                  <div className="mb-6 p-2.5 border rounded-xl border-zinc-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center relative">
                        <img
                          className="h-14 w-14 rounded-lg cursor-pointer object-cover"
                          src={e.poster}
                          alt={"title"}
                          onClick={() => {}}
                        />
                        <div className="ml-4 flex flex-col">
                          <div
                            className="cursor-pointer line-clamp-1 pr-2 text-sm"
                            onClick={() => history.push(`/shows`)}
                          >
                            {e.title}
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
                                      {e.author}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="mx-1.5 w-full line-clamp-1 text-xs">
                              {e.desc}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <Link
                      activeClass="active"
                      className="top"
                        to="top"
                        spy={true}
                        smooth={true}
                        offset={0}
                        duration={500}
                      > */}
                        <div
                          className="cursor-pointer rounded-[34px] p-3 bg-black/40"
                          onClick={() => {
                            // Minor video control..
                            if (playerObj_.src === e.src) {
                              if (isPlaying) {
                                playerObj_.pause();
                                setIsPlaying(false);
                              } else {
                                playerObj_.play();
                                setIsPlaying(true);
                              }
                            } else {
                              setCurrentVideo(e)
                              playerObj_.src = e.src;
                              playerObj_.pause();
                            }
                          }}
                        >
                          <PlayIcon className="w-4 h-4 fill-current" />
                        </div>
                      {/* </Link> */}
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

  const loadRss = () => {
    window.open(API_MAP.rss + thePodcast.podcastId, "_blank");
  };
  return (
    <div className={``}>
      {!loading && (
        <div className="pb-14 flex flex-col justify-center md:flex-row md:items-center w-full">
          <img
            className="w-40 cursor-pointer rounded-sm mx-auto md:mx-0 md:mr-8"
            src={thePodcast?.cover}
            alt={thePodcast.title}
          />
          <div className="col-span-2 my-3 text-zinc-100 w-full md:w-4/6 md:mr-2">
            <div className="text-center md:text-left text-xl font-semibold tracking-wide select-text line-clamp-1 hover:line-clamp-none">
              {thePodcast?.title}
            </div>
            <div className="line-clamp-5 hover:line-clamp-none select-text">
              {thePodcast?.description}
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
              {thePodcast && isOwner && (
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
