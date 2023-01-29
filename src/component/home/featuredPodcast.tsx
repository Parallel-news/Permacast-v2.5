import React, { useState, useEffect, FC } from "react";
import { useTranslation } from "next-i18next";
import { useRecoilState } from "recoil";
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';

import {
  replaceDarkColorsRGB,
  isTooLight,
  RGBobjectToString,
  getButtonRGBs,
  dimColor,
} from "../../utils/ui";

import { Cooyub, PlayButton } from "../reusables/icons";

import {
  switchFocus,
  videoSelection,
  creators,
  currentThemeColor
} from "../../atoms";
import { PodcastDev } from "../../interfaces/index.js";
import Link from "next/link";

interface FeaturedPodcastInterface {
  podcast: PodcastDev;
};

const FeaturedPodcast: FC<FeaturedPodcastInterface> = ({ podcast }) => {

  const {
    cover,
    pid,
    minifiedCover,
    podcastName,
    episodes,
    label,
    description,
  } = podcast;

  const [dominantColor, setDominantColor] = useState<string>();

  useEffect(() => {
    console.log(podcast)
    const fetchColor = async () => {
      const fac = new FastAverageColor();
      const color: FastAverageColorResult = await fac.getColorAsync('https://arweave.net/' + minifiedCover)
      if (color?.error) return;
      setDominantColor(dimColor(color.rgb, 0.6))
    }
    fetchColor();
  }, [])
  getButtonRGBs  
  // const textColor = isTooLight(rgb) ? "black" : "white";

  const { t } = useTranslation();

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [vs_, setVS_] = useRecoilState(videoSelection);

  return (
    <div className={`rounded-3xl text-white/30 relative overflow-hidden carousel-item`} style={{backgroundColor: dominantColor}}>
      <div className={`w-full h-full absolute top-0 right-0`} />
      <div className="h-1/6 w-full px-5 pb-2 cursor-pointer relative">
        <Link href={`/podcast/${pid}`}>
          <div className="pt-5 pb-3 text-xs">
            {episodes.length}{" "}
            {episodes.length === 1
              ? t("home.episode")
              : t("home.episodes")}
          </div>
          <div className="w-full mb-7 max-w-[200px] overflow-x-hidden mx-auto">
            <img
              className="object-cover aspect-square h-[200px]"
              src={"https://arweave.net/" + cover}
              alt={podcastName}
            />
          </div>
        </Link>
        <div className="h-16 flex items-center">
          <div
            style={{backgroundColor: dominantColor}}
            className="z-10 rounded-full w-10 h-10 flex justify-center items-center shrink-0"
            onClick={() => {
              // Promise.all(firstTenEpisodes(true)).then((episodes) => {
              //   enqueuePodcast(episodes);
              //   play(episodes[0]);
              // });
              if (switchFocus_) {
                // appState.queue.playEpisode(
                //   secondaryData_.episodes[0],
                //   secondaryData_.episodes[0].eid
                // );
              } else {
                // setVS_([
                //   "https://arweave.net/" +
                //     secondaryData_.episodes[0].contentTx,
                //   {},
                // ]);
              }
            }}
          >
            <PlayButton svgStyle={"white"} fill={"white"} outline={"white"} />
          </div>
          <Link className="ml-3 w-full" href={`/podcast/${pid}`}>
            <div className="text-lg line-clamp-1 cursor-pointer">
              {podcastName}
            </div>
            <div className="text-xs max-w-[85%] line-clamp-3 break-all">
              {description}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedPodcast;