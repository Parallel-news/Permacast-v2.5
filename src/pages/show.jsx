import React from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import TipButton from "../component/reusables/tip";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import { videoSelection } from "../atoms";
import { Cooyub } from "../component/reusables/icons";
import { useEffect } from "react";

export default function Episode() {
  return (
    <div className={`mb-[20px]`}>
      <div className="flex flex-col md:flex-row items-start pl-[100px]">
        <VideoPlayer />
        <VideoDetails />
      </div>
      <div className="text-3xl text-gray-300 my-8">Next Show</div>
      <VideoItem />
    </div>
  );
}

// // // // // // Auxiliary Functions

// Video player module 👇👇👇 
const VideoPlayer = (props) => {
  const [vs_, setVS_] = useRecoilState(videoSelection);
  useEffect(() => {
    let playerObj_ = document.getElementById('main-player')
    playerObj_.pause()
    if(!playerObj_.src !== 'https://hci-itil.com/Videos/mp4movies/mp4-864x480/2022%20Easter%20Greeting.mp4'){
      playerObj_.src = 'https://hci-itil.com/Videos/mp4movies/mp4-864x480/2022%20Easter%20Greeting.mp4'
    }else{
      playerObj_.src = "https://mdn.github.io/learning-area/javascript/apis/video-audio/finished/video/sintel-short.webm"
    }
  }, [vs_[1]])
  return (
    <div className="w-[800px] h-[400px] bg-black rounded-[2px]">
      <video
        id="main-player"
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
          type="video/*"
        ></source>
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
    </div>
  );
};

// Video details 👇👇👇 
const VideoDetails = (props) => {
  return (
    <div className={`flex flex-row`}>
      <img
        src={`https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg`}
        className="w-[110px] h-[110px] cursor-pointer relative bottom-[0px] left-4 object-cover"
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
          excepteur ea sunt..
        </div>
      </div>
    </div>
  );
};

// Video menu items, on selection this element changes the video (removed from 'Next Episode' when selected) 👇👇👇 
const VideoItem = (props) => {
  const [vs_, setVS_] = useRecoilState(videoSelection);
  return (
    <div className={``}>
      <div className="mb-6 p-2.5 border rounded-xl border-zinc-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center relative">
            <img
              className="h-14 w-14 rounded-lg cursor-pointer object-cover"
              src={
                "https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg"
              }
              alt={"title"}
              onClick={() => {}}
            />
            <div className="ml-4 flex flex-col">
              <div
                className="cursor-pointer line-clamp-1 pr-2 text-sm"
                onClick={() => {}}
              >
                {"Sintel by Blender"}
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
                        <p className="text-[8px] pr-1 ml-1 " onClick={() => {}}>
                          @LwaziNF
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="mx-1.5 w-full line-clamp-1 text-xs">
                  Sintel, code-named Project Durian during production, is a 2010
                  computer-animated fantasy short film. It was the third Blender
                  "open movie". It was produced by Ton Roosendaal, chairman of
                  the Blender Foundation, written by Esther Wouda, directed by
                  Colin Levy, at the time an artist at Pixar and art direction
                  by David Revoy, who is known for Pepper&Carrot an open source
                  webcomic series.
                </div>
              </div>
            </div>
          </div>
          <div
            className="cursor-pointer rounded-[34px] p-3 bg-black/40"
            onClick={() => {
              // Video details are put here.. Links, Covers, Desc, Title, etc..
              setVS_(["w", {}]);
            }}
          >
            <PlayIcon className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>
    </div>
  )
}