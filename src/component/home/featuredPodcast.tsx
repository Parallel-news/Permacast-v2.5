import React, { useState, useEffect, FC } from "react";
import { useTranslation } from "next-i18next";
import {
  fetchAverageColor,
  getCoverColorScheme,
} from "../../utils/ui";
import { arweaveTX, Podcast } from "../../interfaces/index";
import Link from "next/link";
import FeaturedPodcastPlayButton from "./featuredPodcastPlayButton";
import Image from "next/image";
import MarkdownRenderer from "../markdownRenderer";


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

const podcastOuterBackgroundStyling = `rounded-3xl text-white/30 relative overflow-hidden carousel-item hover-up-effect max-w-[280px]`
const podcastInnerBackgroundStyling = `w-full h-1/6 px-5 pb-2 cursor-pointer relative`
const podcastCoverStyling = `w-full max-w-[250px] overflow-x-hidden mx-auto mb-2`
const podcastEpisodeCountStyling = `pt-5 pb-3 text-xs font-semibold`
const podcastBottomStyling = `h-16 flex items-center`
const podcastNameStyling = `text-lg font-medium line-clamp-1`
const podcastDescriptionStyling = `text-xs line-clamp-2 max-w-[95%] break-all`

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


const FeaturedPodcast: FC<Podcast> = (podcastInfo) => {

  const {
    cover,
    pid,
    minifiedCover,
    podcastName,
    episodes,
    author,
    label,
    description,
  } = podcastInfo;

  const [themeColor, setThemeColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [markdownText, setMarkdownText] = useState('');

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

  useEffect(() => {
    const fetchMarkdown = async () => {
      const url = `https://arweave.net/${description}`;
      const response = await fetch(url);
      const txt = await response.text();
      setMarkdownText(txt);
    };

    fetchMarkdown();
  }, []);

  const episode = episodes.length ? episodes[0]: undefined;
  const playerInfo = { playerColorScheme: themeColor, buttonColor: themeColor, accentColor: textColor, title: episode?.episodeName, artist: author, cover, src: episode?.contentTx };

  const prevent = (event: any) => {
    event.preventDefault();
  };

  return (
    <Link 
      passHref
      href={`/podcast/${pid}`}
      className={podcastOuterBackgroundStyling}
      style={{ backgroundColor: themeColor }}
    >
      <div className={podcastInnerBackgroundStyling}>
        <div>
          <EpisodeCount count={episodes.length} textColor={textColor} />
          <PocastCover podcastName={podcastName} cover={cover} />
        </div>
        <div className={podcastBottomStyling}>
          <div onClick={prevent}>
            <FeaturedPodcastPlayButton {...{ playerInfo, podcastInfo, episodes }} />
          </div>
          <div className="ml-3 w-full" style={{color: textColor}}>
            <PodcastName podcastName={podcastName} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPodcast;
//<PodcastDescription podcastDescription={description} />
//<MarkdownRenderer markdownText={markdownText} />