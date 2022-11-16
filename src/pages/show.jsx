import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ArrowDownTrayIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

import { MESON_ENDPOINT } from "../utils/arweave";
import { getButtonRGBs, isTooLight } from "../utils/ui";
import {
  getPodcasts,
  getPodcastEpisodes,
  convertToEpisode,
} from "../utils/podcast";
import { appContext } from "../utils/initStateGen.js";

import TipButton from "../component/reusables/tip";
import PlayButton from "../component/reusables/playButton";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import Track from "../component/track";
import { useRecoilState } from "recoil";
import { videoSelection } from "../atoms";

export default function Episode(props) {
  const [vs_, setVS_] = useRecoilState(videoSelection);
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start pl-[100px]">
        <div className="w-[800px] h-[400px] bg-black rounded-[2px]">
          <video
            id="my-player"
            class="video-js"
            controls
            preload="auto"
            poster={vs_[1].cover}
            data-setup="{}"
            className="rounded-[4px] w-full h-full"
          >
            <source
              src={
                "https://mdn.github.io/learning-area/javascript/apis/video-audio/finished/video/sintel-short.webm"
              }
              type="video/webm"
            ></source>
            <p class="vjs-no-js">
              To view this video please enable JavaScript, and consider
              upgrading to a web browser that
              <a
                href="https://videojs.com/html5-video-support/"
                target="_blank"
              >
                supports HTML5 video
              </a>
            </p>
          </video>
        </div>
        <img
          src={`https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg`}
          className="w-[110px] h-[110px] cursor-pointer relative top-[1px] left-4 object-cover"
          onClick={() => {}}
        />
        <div className="mt-8 md:mt-[-2px] md:ml-8 flex flex-col">
          <div className="text-center md:text-left text-3xl font-medium text-gray-200 select-text">
            Sintel by Blender
          </div>
          <div className="flex flex-row justify-center md:justify-start items-center mt-2">
            <div className="px-3 py-1 text-xs mr-2 rounded-full bg-black/30">
              Fantasy
            </div>
            <div className={"text-sm text-gray-200"}>Sun May 20 2022</div>
          </div>
          <div className="mt-3 flex flex-col md:flex-row items-center gap-x-4">
            <div className="flex flex-row items-center gap-x-2">
              {/* <div className="-ml-1.5 rounded-full pointer w-8 h-8 flex flex-row items-center justify-center bg-black/30">
                <PlayIcon className="w-4 h-4 fill-current" />
              </div> */}
              <TipButton />
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <a
                href={`#`}
                className="flex items-center rounded-full btn btn-sm normal-case text-sm font-medium border-0"
                // style={{backgroundColor: rgb?.backgroundColor, color: rgb?.color}}
                download
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download
              </a>
              <button
                className="flex items-center rounded-full btn btn-sm normal-case text-sm font-medium border-0"
                // style={{backgroundColor: rgb?.backgroundColor, color: rgb?.color}}
                onClick={() => {
                  // setCopied(true);
                  // setTimeout(() => {if (!copied) setCopied(false)}, 2000)
                  // navigator.clipboard.writeText(window.location.href)
                }}
              >
                <ArrowUpOnSquareIcon className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
          <div className="text-gray-400 mt-8 select-text w-[470px] relative right-[124px] bottom-3">
            Aliquip proident deserunt duis anim in ullamco. Proident ea officia
            excepteur ea sunt magna. Elit nulla occaecat deserunt adipisicing
            sunt. Deserunt nulla consectetur aliquip Lorem reprehenderit in
            aliqua dolor mollit. Adipisicing esse ullamco sint sit proident.
            Aliqua commodo tempor aliqua commodo nisi id.
          </div>
          <div
            className={`w-[470px] h-[30px] relative right-[130px] bottom-[4px] text-white/50 flex flex-col pl-2 justify-center items-center`}
          >
          <div className={`w-[350px] h-[1px] bg-white/30 relative bottom-1`}/>
            What's next?!
          </div>
          <div
            className={`w-[470px] h-[110px] relative right-[130px] bottom-[2.5px] flex flex-row justify-center items-center`}
          >
            <div
              className={`w-full h-full bg-black/50 rounded-[4px] m-[4px]`}
            />
            <div
              className={`w-full h-full bg-black/50 rounded-[4px] m-[4px]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
