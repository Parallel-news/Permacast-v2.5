import { useEffect, useCallback, FC, useState } from "react";

import { switchFocus } from "../../atoms";
import { useRecoilState } from "recoil";
import { FeaturedPodcastDummyPlayButton } from "../home/featuredPodcastPlayButton";
import { FullEpisodeInfo } from "../../interfaces";
import Image from "next/image";
import Link from "next/link";
import { fetchAverageColor, getButtonRGBs, getCoverColorScheme, RGBAstringToObject, RGBobjectToString, RGBstringToObject } from "../../utils/ui";
import { Cooyub } from "./icons";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */


// 1. Interface

export interface TrackProps {
  episode: FullEpisodeInfo;
  episodeNumber: number,
  includeDescription?: boolean,
  includePlayButton?: boolean,
};

export interface PodcastCoverProps {
  cover?: string;
  alt: string;
};

export interface ButtonStyle {
  backgroundColor: string;
  color: string;
};

export interface EpisodeLinkableTitleProps {
  eid: string;
  episodeName: string;
};

export interface TrackCreatorLinkProps {
  uploader: string;
  buttonStyles: ButtonStyle;
  coverColor: string;
  author: string;
};

export interface TrackDescriptionProps {
  includeDescription: boolean;
  description: string;
};

export interface TrackPlayButtonProps {
  includePlayButton: boolean;
  coverColor: string;
};

// 2. Stylings

const trackFlexCenterYStyling = `flex items-center`;
const trackFlexCenterBothStyling = `flex items-center justify-between`;
const trackEpisodeLinkableTitleStyling = `cursor-pointer line-clamp-1 pr-2 text-sm hover:underline`;
const trackByStyling = `text-zinc-400 text-[10px] mr-2`;
const trackBackgroundColorStyling = `rounded-full cursor-pointer flex items-center min-w-max text-[10px] gap-x-1`;
const trackDescriptionStyling = `mx-1.5 w-full line-clamp-1 text-xs`;

// 3. Custom Functions

// const ShortenAuthor = (author: string, maxLength: number) => {
//   return author.split(0, 20);
// }

// 4. Reusable Components

export const PodcastCover: FC<PodcastCoverProps> = ({ cover, alt }) => {
  if (cover) return (
    <Image
      width={56}
      height={56}
      className="rounded-lg cursor-pointer"
      src={"https://arweave.net/" + cover}
      alt={alt}
    />
  );
};

export const EpisodeLinkableTitle: FC<EpisodeLinkableTitleProps> = ({ eid, episodeName }) => {
  return (
    <Link
      href={`/episode/${eid}`}
      className={trackEpisodeLinkableTitleStyling}
    >
      {episodeName}
    </Link>
  );
};

export const TrackCreatorLink: FC<TrackCreatorLinkProps> = ({ uploader, buttonStyles, coverColor, author }) => {
  return (
    <Link
      href={`/creator/${uploader}`}
      style={buttonStyles}
      className={trackBackgroundColorStyling}
    >
      <div
        className="h-2.5 w-2.5 rounded-full"
        style={{backgroundColor: coverColor}}
      ></div>
      <div>{author}</div>
    </Link>
  );
};

export const TrackDescription: FC<TrackDescriptionProps> = ({ includeDescription, description }) => {
  if (includeDescription && description) return (
    <div className={trackDescriptionStyling}>
      {description}
    </div>
  );
};

export const TrackPlayButton: FC<TrackPlayButtonProps> = ({ includePlayButton, coverColor }) => {
  // TODO: WIP
  // PLAY STATUS (PLAY / PAUSE)
  // BACKGROUND COLOR

  return (
    <>
      {!includePlayButton && (
        <FeaturedPodcastDummyPlayButton buttonColor={coverColor} size={36} />
      )}
    </>
  );
};

const Track: FC<TrackProps> = (props: TrackProps) => {

  const { t } = useTranslation();

  const { episode, episodeNumber, includeDescription, includePlayButton } = props;
  const {
    cover,
    minifiedCover,
    author,
    description,
    pid,
  } = episode.podcast;
  const {
    episodeName,
    eid,
    uploader,
  } = episode.episode;

  const coverUsed = minifiedCover || cover;
  // const { currentEpisode, playEpisode } = appState.queue;
  // const { isPaused, setIsPaused } = appState.playback;

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [coverColor, setCoverColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [buttonStyles, setButtonStyles] = useState<ButtonStyle>({backgroundColor: '', color: ''})

  // const { player } = appState;
  // const c = color ? color : episode?.rgb;
  // // const id = objectType === 'episode' ? episodeId : podcastId;
  // const url = `/podcast/${secondaryData_.pid}` + `/${episode.eid}`;

  useEffect(() => {
    const fetchData = async () => {
      const coverToBeUsed = (minifiedCover || cover);
      const averageColor = await fetchAverageColor(coverToBeUsed);
      if (averageColor.error) return;
      const [coverColor, textColor] = getCoverColorScheme(averageColor.rgba);
      const buttonStyles = getButtonRGBs(RGBstringToObject(coverColor));
      setCoverColor(coverColor);
      setTextColor(textColor);
      setButtonStyles(buttonStyles);
    };
    fetchData();
  }, []);

  return (
    <div className={trackFlexCenterBothStyling}>
      <div className={trackFlexCenterYStyling}>
        <PodcastCover cover={coverUsed} alt={episodeName} />
        <div className="ml-4 flex flex-col">
          <EpisodeLinkableTitle {...{eid, episodeName}} />
          <div className={trackFlexCenterYStyling}>
            <p className={trackByStyling}>{t("track.by")}</p>
            <TrackCreatorLink {...{ uploader, buttonStyles, coverColor, author }} />
            <TrackDescription {...{ includeDescription, description }} />
          </div>
        </div>
      </div>
      <TrackPlayButton {...{ includePlayButton, coverColor }} />
    </div>
  );
};

export default Track;