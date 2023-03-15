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
  fetchAverageColor,
  getCoverColorScheme,
} from "../../utils/ui";

import { PlayButton } from "../reusables/icons";

import {
  switchFocus,
  videoSelection,
  queue,
  isQueueVisible,
} from "../../atoms";

import { arweaveTX, Episode, PodcastDev } from "../../interfaces/index.js";
import Link from "next/link";
import { RGB, RGBA } from "../../interfaces/ui";
import FeaturedPodcastPlayButton, { FeaturedPodcastDummyPlayButton } from "./featuredPodcastPlayButton";
import { PauseIcon } from "@heroicons/react/24/outline";
import { usePlayerConnector } from "../../hooks";
import Image from "next/image";


/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */

// 1. Interfaces 

interface EpisodeCountProps {
  count: number;
  textColor: string;
};

interface PodcastCoverProps {
  cover: arweaveTX;
  podcastName: string;
};

interface PodcastNameProps {
  podcastName: string;
};

interface PodcastDescriptionProps {
  podcastDescription: string;
};

// 2. Stylings

const podcastOuterBackgroundStyling = `rounded-3xl text-white/30 relative overflow-hidden carousel-item hover-up-effect mx-2 max-w-[280px]`
const podcastInnerBackgroundStyling = `w-full h-1/6 px-5 pb-2 cursor-pointer relative`
const podcastCoverStyling = `w-full max-w-[250px] overflow-x-hidden mx-auto mb-2`
const podcastEpisodeCountStyling = `pt-5 pb-3 text-xs font-semibold`
const podcastBottomStyling = `h-16 flex items-center`
const podcastNameStyling = `text-lg hover:underline font-medium line-clamp-1 cursor-pointer`
const podcastDescriptionStyling = `text-xs line-clamp-2`

// 3. Custom Functions

// 4. Reusable Components

const EpisodeCount: FC<EpisodeCountProps> = ({ count, textColor }) => {
  const { t } = useTranslation();

  return (
    <div className={podcastEpisodeCountStyling} style={{ color: textColor }}>
      {count}{" "}
      {count === 1
        ? t("home.episode")
        : t("home.episodes")}
    </div>
  );
};

const PocastCover: FC<PodcastCoverProps> = ({ cover, podcastName }) => {
  return (
    <div className={podcastCoverStyling}>
      {cover &&
        <Image
          height={240}
          width={240}
          className="aspect-square object-cover w-[240px] h-[240px]"
          src={"https://arweave.net/" + cover}
          alt={podcastName}
        />
      }
    </div>
  );
};

const PodcastName: FC<PodcastNameProps> = ({ podcastName }) => {
  return (
    <div className={podcastNameStyling}>
      {podcastName}
    </div>
  );
};

const PodcastDescription: FC<PodcastDescriptionProps> = ({ podcastDescription }) => {
  return (
    <div className={podcastDescriptionStyling}>
      {podcastDescription}
    </div>
  );
};


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

  const [player, launchPlayer] = usePlayerConnector();
  const [themeColor, setThemeColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');

  const [_queue, _setQueue] = useRecoilState(queue);

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [vs_, setVS_] = useRecoilState(videoSelection);

  const [_isQueueVisible, _setQueueVisible] = useRecoilState(isQueueVisible);

  useEffect(() => {
    const fetchData = async () => {
      const coverToBeUsed = (minifiedCover || cover);
      const averageColor = await fetchAverageColor(coverToBeUsed);
      if (averageColor.error) return;
      const [coverColor, textColor] = getCoverColorScheme(averageColor.rgba);
      setThemeColor(coverColor);
      setTextColor(textColor);
    };
    fetchData();
  }, []);

  const episode = episodes.length ? episodes[0]: undefined;
  const playerInfoArgs = { themeColor, buttonColor: textColor, title: episode?.episodeName, artist: author, cover, src: episode?.contentTx };

  return (
    <div className={podcastOuterBackgroundStyling} style={{ backgroundColor: themeColor }}>
      <div className={podcastInnerBackgroundStyling}>
        <Link href={`/podcast/${pid}`}>
          <EpisodeCount count={episodes.length} textColor={textColor} />
          <PocastCover podcastName={podcastName} cover={cover} />
        </Link>
        <div className={podcastBottomStyling}>
          <FeaturedPodcastPlayButton
            playerInfo={playerInfoArgs}
            podcastInfo={podcast}
            episodes={episodes}
          />
          <Link href={`/podcast/${pid}`} className="ml-3 w-full" style={{color: textColor}}>
            <PodcastName podcastName={podcastName} />
            <PodcastDescription podcastDescription={description} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPodcast;