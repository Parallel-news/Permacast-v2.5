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
  RGBobjectToString,
} from "../../utils/ui";

import { PlayButton } from "../reusables/icons";

import {
  switchFocus,
  videoSelection,
  queue,
  isQueueVisible,
} from "../../atoms";

import { Episode, PodcastDev } from "../../interfaces/index.js";
import Link from "next/link";
import { RGB, RGBA } from "../../interfaces/ui";
import FeaturedPodcastPlayButton, { FeaturedPodcastDummyPlayButton } from "./featuredPodcastPlayButton";
import { PauseIcon } from "@heroicons/react/24/outline";
import { usePlayerConnector } from "../../hooks";


const FeaturedPodcast: FC<PodcastDev> = (podcast) => {

  const {
    cover,
    pid,
    minifiedCover,
    podcastName,
    episodes,
    author,
    label,
    description,
  } = podcast;

  const { t } = useTranslation();
  const [player, launchPlayer] = usePlayerConnector();
  const [themeColor, setThemeColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');

  const [_queue, _setQueue] = useRecoilState(queue);

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [vs_, setVS_] = useRecoilState(videoSelection);

  const [_isQueueVisible, _setQueueVisible] = useRecoilState(isQueueVisible);

  useEffect(() => {
    const fetchColor = async () => {
      const coverToBeUsed = (minifiedCover || cover);
      if (!coverToBeUsed) return;
      const fac = new FastAverageColor();
      const averageColor: FastAverageColorResult = await fac.getColorAsync('https://arweave.net/' + coverToBeUsed)
      if (averageColor.error) return;
      const rgba: RGBA = RGBAstringToObject(averageColor.rgba);
      const stringRGBA = RGBAobjectToString(rgba);
      setThemeColor(stringRGBA);
      const colorForText = isTooLight(rgba, 0.6) ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
      setTextColor(colorForText);
    }
    fetchColor();
  }, [])

  const EpisodeCount: FC<{count: number}> = ({ count }) => (
    <>
      {count}{" "}
      {count === 1
        ? t("home.episode")
        : t("home.episodes")}
    </>
  );

  const episode = episodes.length ? episodes[0]: undefined
  const playerInfoArgs = { themeColor, buttonColor: textColor, title: episode?.episodeName, artist: author, cover, src: episode?.contentTx }

  return (
    <div
      className={`rounded-3xl text-white/30 relative overflow-hidden carousel-item hover-up-effect mx-2 max-w-[280px]`}
      style={{ backgroundColor: themeColor }}
    >
      <div className={`w-full h-full absolute top-0 right-0`} />
      <div className="w-full h-1/6 px-5 pb-2 cursor-pointer relative">
        <Link href={`/podcast/${pid}`}>
          <div className="pt-5 pb-3 text-xs font-semibold" style={{ color: textColor }}>
            <EpisodeCount count={episodes.length} />
          </div>
          <div className="w-full max-w-[250px] overflow-x-hidden mx-auto mb-2">
            {cover &&
              <img
                className="object-cover aspect-square h-[240px]"
                src={"https://arweave.net/" + cover}
                alt={podcastName}
              />
            }
          </div>
        </Link>
        <div className="h-16 flex items-center">
          {episodes.length ? (
            <FeaturedPodcastPlayButton
              playerInfo={playerInfoArgs}
              podcastInfo={podcast}
              episodes={episodes}
            />
          ): (
            <FeaturedPodcastDummyPlayButton buttonColor={textColor} />
          )}
          <Link className="ml-3 w-full" href={`/podcast/${pid}`} style={{color: textColor}}>
            <div className="text-lg hover:underline font-medium line-clamp-1 cursor-pointer">
              {podcastName}
            </div>
            <div className="text-xs line-clamp-2">
              {description}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPodcast;