import React, { useState, useEffect, FC } from "react";
import { useTranslation } from "next-i18next";
import { useRecoilState } from "recoil";
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';

import {
  isTooLight,
  RGBAstringToObject,
  RGBAobjectToString,
  dimColorString,
  showShikwasaPlayer,
} from "../../utils/ui";

import { PlayButton } from "../reusables/icons";

import {
  switchFocus,
  videoSelection,
  creators,
  currentThemeColor,
  queue
} from "../../atoms";
import { PodcastDev } from "../../interfaces/index.js";
import Link from "next/link";
import { RGBA } from "../../interfaces/ui";


const FeaturedPodcast: FC<PodcastDev> = ({
  cover,
  pid,
  minifiedCover,
  podcastName,
  episodes,
  author,
  label,
  description,
  
}) => {

  const { t } = useTranslation();

  const [dominantColor, setDominantColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');

  const [_queue, _setQueue] = useRecoilState(queue);

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [vs_, setVS_] = useRecoilState(videoSelection);


  useEffect(() => {
    const fetchColor = async () => {
      const coverToBeUsed = (minifiedCover || cover);
      if (!coverToBeUsed) return;
      const fac = new FastAverageColor();
      const averageColor: FastAverageColorResult = await fac.getColorAsync('https://arweave.net/' + coverToBeUsed)
      if (averageColor.error) return;
      const rgba: RGBA = RGBAstringToObject(averageColor.rgba);
      const stringRGBA = RGBAobjectToString(rgba);
      setDominantColor(stringRGBA);
      const colorForText = isTooLight(rgba) ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
      setTextColor(colorForText);
    }
    fetchColor();
  }, [])

  return (
    <div 
      className={`rounded-3xl text-white/30 relative overflow-hidden carousel-item hover-up-effect mx-2 max-w-[280px]`} 
      style={{backgroundColor: dominantColor}}
    >
      <div className={`w-full h-full absolute top-0 right-0`} />
      <div className="h-1/6 w-full px-5 pb-2 cursor-pointer relative">
        <Link href={`/podcast/${pid}`}>
          <div className="pt-5 pb-3 text-xs font-semibold" style={{color: textColor}}>
            {episodes.length}{" "}
            {episodes.length === 1
              ? t("home.episode")
              : t("home.episodes")}
          </div>
          <div className="w-full mb-7 max-w-[250px] overflow-x-hidden mx-auto">
            <img
              className="object-cover aspect-square h-[240px]"
              src={"https://arweave.net/" + cover}
              alt={podcastName}
            />
          </div>
        </Link>
        <div className="h-16 flex items-center">
          <div
            style={{backgroundColor: dimColorString(textColor, 0.2)}}
            className={`z-10 rounded-full w-10 h-10 flex justify-center items-center shrink-0 default-animation hover:scale-[1.1]`}
            onClick={() => {
              if (!episodes) return;
              _setQueue(episodes);
              const { episodeName, contentTx } = episodes[0]
              console.log("episodeName: ", episodeName, contentTx)
              showShikwasaPlayer(episodeName, author, cover, contentTx)
            }}
          >
            <PlayButton svgColor={textColor} fillColor={textColor} outlineColor={textColor} />
          </div>
          <Link className="ml-3 w-full" href={`/podcast/${pid}`} style={{color: textColor}}>
            <div className="text-lg hover:underline font-medium line-clamp-1 cursor-pointer">
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
};

export default FeaturedPodcast;