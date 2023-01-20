import React, { useState, useContext, useEffect, FC, useMemo } from "react";
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

import { Cooyub, PlayButton, GlobalPlayButton } from "../reusables/icons";

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
    minifiedCover,
    podcastName,
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
      setDominantColor(dimColor(color.rgb, 0.2))
    }
    fetchColor();
  }, [])
  getButtonRGBs  
  // const textColor = isTooLight(rgb) ? "black" : "white";

  const { t } = useTranslation();

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [vs_, setVS_] = useRecoilState(videoSelection);

  return (
    <>
      <div className={`mt-4 rounded-3xl text-white/30 relative overflow-hidden`} style={{backgroundColor: dominantColor, color: dominantColor}}>
        <div className={`w-full h-full backdrop-blur-lg absolute top-0 right-0`} style={{backgroundColor: dominantColor, color: dominantColor}} />
        <div className="h-1/6 w-full px-5 pb-2 cursor-pointer relative">
          <Link href={`/podcast/${podcast.pid}`}>
            <div className="pt-5 pb-3 text-xs">
              {podcast.episodes.length}{" "}
              {podcast.episodes.length === 1
                ? t("home.episode")
                : t("home.episodes")}
            </div>
            <div className="w-full mb-7 max-w-[180px] overflow-x-hidden mx-auto">
              <img
                className="object-cover aspect-square h-[180px]"
                src={"https://arweave.net/" + cover}
                alt={podcastName}
              />
            </div>
          </Link>
          <div className="h-16 flex items-center">
            <div
              className="z-10"
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
              <GlobalPlayButton
                size="20"
                innerColor={"black"}
                outerColor={"white"} //textColor
              />
            </div>
            <div
              className="ml-3"
              // onClick={() => history.push(`/podcast/${podcastId}`)}
            >
              <div className="text-lg line-clamp-1 cursor-pointer">
                {/* {secondaryData_.podcastName} */}
              </div>
              <div className="text-xs max-w-[95%] line-clamp-2">
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeaturedPodcast;