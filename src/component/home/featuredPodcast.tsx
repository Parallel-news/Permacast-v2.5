import React, { useState, useEffect, FC } from "react";
import { useTranslation } from "next-i18next";
import { determinePodcastURL, fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import { arweaveTX, Podcast } from "../../interfaces/index";
import Link from "next/link";
import FeaturedPodcastPlayButton from "./featuredPodcastPlayButton";
import Image from "next/image";
import { ARSEED_URL } from "../../constants";
import MarkdownRenderer from "../markdownRenderer";
import { queryMarkdownByTX } from "../../utils/markdown";
import { convertPodcastsToEpisodes } from "../../utils/filters";
import { useRouter } from "next/router";



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

export const featuredPocastCarouselStyling = `w-full mt-8 carousel gap-x-12 py-3`;
export const podcastOuterBackgroundStyling = `rounded-3xl text-white/30 relative overflow-hidden carousel-item hover-up-effect max-w-[280px] default-outline `
export const podcastInnerBackgroundStyling = `w-full h-1/6 px-5 pb-2 cursor-pointer relative`
export const podcastCoverStyling = `w-full max-w-[250px] overflow-x-hidden mx-auto mb-2`
export const podcastEpisodeCountStyling = `pt-5 pb-3 text-xs font-semibold`
export const podcastBottomStyling = `h-16 flex items-center`
export const podcastNameStyling = `text-lg font-medium line-clamp-1`
export const podcastDescriptionStyling = `text-xs line-clamp-2 max-w-[95%] break-all`

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
          src={ARSEED_URL + cover}
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
      <MarkdownRenderer markdownText={podcastDescription} />
    </div>
  );
};


const FeaturedPodcast: FC<Podcast> = (podcastInfo) => {

  const {
    cover,
    pid,
    minifiedCover,
    podcastName,
    author,
    label,
    description,
  } = podcastInfo;

  const [themeColor, setThemeColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [markdownText, setMarkdownText] = useState<string>('');

  useEffect(() => {
    const fetchMarkdown = async (tx: arweaveTX) => {
      const text = await queryMarkdownByTX(tx);
      setMarkdownText(text);
    };

    const fetchColors = async () => {
      const coverToBeUsed = (minifiedCover || cover);
      const dominantColor = await fetchDominantColor(coverToBeUsed);
      if (dominantColor.error) return;
      const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba);
      setThemeColor(coverColor);
      setTextColor(textColor);
    };

    try {
      fetchColors();
      fetchMarkdown(description);
    } catch (error) {
      console.log(error)
    };
  }, []);

  useEffect(() => {
    queryMarkdownByTX(description).then(setMarkdownText);
  }, []);

  const episodes = convertPodcastsToEpisodes([podcastInfo]);
  const episode = episodes.length ? episodes[0]: undefined
  const playerInfo = { playerColorScheme: themeColor, buttonColor: themeColor, accentColor: textColor, title: episode?.episode?.episodeName, artist: author, cover, src: episode?.episode?.contentTx };

  const prevent = (event: any) => {
    event.preventDefault();
  };
  // console.log("HEADS UP: ")
  // console.log("playerInfo: ", playerInfo)
  // console.log("podcastInfo ", podcastInfo)
  // console.log("episodes: ", episodes)

  return (
    <Link 
      passHref
      href={`/podcast/${determinePodcastURL(label, pid)}#start`}
      className={podcastOuterBackgroundStyling}
      style={{ backgroundColor: themeColor }}
      onClick={() => window.scrollTo(0, 0) }
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
            <PodcastDescription podcastDescription={markdownText} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPodcast;
//<PodcastDescription podcastDescription={description} />
//<MarkdownRenderer markdownText={markdownText} />