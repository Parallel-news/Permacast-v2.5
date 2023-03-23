import React, { useEffect, useCallback, FC, useState, useMemo } from "react";

import { FullEpisodeInfo } from "../../interfaces";
import Image from "next/image";
import Link from "next/link";
import { fetchAverageColor, getButtonRGBs, getCoverColorScheme, RGBAstringToObject, RGBobjectToString, RGBstringToObject } from "../../utils/ui";
import { useTranslation } from "react-i18next";
import { useShikwasa } from "../../hooks";
import { showShikwasaPlayerArguments } from "../../interfaces/playback";
import PlayButton from "./playButton";

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */


// 1. Interface

/**
  * Track props
*/
export interface TrackProps {
  episode: FullEpisodeInfo;
  episodeNumber: number,
  includeDescription?: boolean,
  includePlayButton?: boolean,
};

export interface PodcastCoverProps {
  pid?: string;
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
  playerInfo: showShikwasaPlayerArguments;
  episode: FullEpisodeInfo;
  includePlayButton: boolean;
  buttonColor: string;
  accentColor: string;
};

export interface MemoizedComponentProps {
  pid: string,
  coverUsed: string,
  podcastName: string,
  eid: string,
  episodeName: string,
  uploader: string,
  coverColor: string,
  author: string,
  includeDescription: boolean,
  description?: string,
}

// 2. Stylings

const trackFlexCenterYStyling = `flex items-center mt-1`;
const trackFlexCenterPaddedYStyling = `flex items-center p-3`;
const trackFlexCenterBothStyling = `flex items-center justify-between border-zinc-600 border-2 rounded-2xl pr-4`;
const trackEpisodeLinkableTitleStyling = `cursor-pointer line-clamp-1 pr-2 text-sm hover:underline`;
const trackByStyling = `text-zinc-400 text-[10px] mr-2`;
const trackBackgroundColorStyling = `rounded-full cursor-pointer flex items-center min-w-max text-[10px] gap-x-1 px-2 py-0.5 hover:light hover:brightness-125 default-animation`;
const trackDescriptionStyling = `mx-1.5 w-full line-clamp-1 text-xs`;

// 3. Custom Functions

// const ShortenAuthor = (author: string, maxLength: number) => {
//   return author.split(0, 20);
// }

// 4. Reusable Components

export const PodcastCover: FC<PodcastCoverProps> = ({ pid, cover, alt }) => {
  if (cover) return (
    <Link href={`/podcast/${pid}`} className={`w-14 h-14 shrink-0`}>
      <Image
        width={56}
        height={56}
        className="rounded-lg"
        src={"https://arweave.net/" + cover}
        alt={alt}
      />
    </Link>
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

export const TrackPlayButton: FC<TrackPlayButtonProps> = ({ playerInfo, episode, includePlayButton, buttonColor, accentColor }) => {

  const { playerState, launchPlayer, togglePlay } = useShikwasa();

  const { currentPodcast, currentEpisode, isPlaying } = playerState;
  const { episode: episodeInfo, podcast: podcastInfo } = episode;


  const handlePlay = () => {
    if (!(currentEpisode.eid === episodeInfo.eid)) {
      launchPlayer(playerInfo, podcastInfo, [episodeInfo]);
    } else {
      togglePlay();
    };
  };

  const buttonStyleArgs = {
    size: 36,
    iconSize: 18,
    buttonColor: accentColor,
    accentColor: accentColor
  };

  if (!includePlayButton) return <></>;

  console.log(buttonColor)

  return <PlayButton isPlaying={isPlaying && (currentEpisode.eid === episodeInfo.eid)} onClick={handlePlay} {...buttonStyleArgs} />;
};

const Track: FC<TrackProps> = (props: TrackProps) => {

  const { t } = useTranslation();

  const { episode, episodeNumber, includeDescription, includePlayButton } = props;
  const {
    cover,
    minifiedCover,
    author,
    description,
    podcastName,
    pid,
  } = episode.podcast;
  const {
    episodeName,
    contentTx,
    eid,
    uploader,
  } = episode.episode;

  const coverUsed = minifiedCover || cover;

  const [coverColor, setCoverColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [buttonStyles, setButtonStyles] = useState<ButtonStyle>({backgroundColor: '', color: ''})

  useMemo(() => {
    // this is a little expensive to run when there's a lot of tracks (well, not really)
    // but in the future we can use a cache to store the average color
    // or force this track component to accept colors as props
    const fetchData = async () => {
      if (!coverUsed) return;
      const averageColor = await fetchAverageColor(coverUsed);
      if (averageColor.error) return;
      const [coverColor, textColor] = getCoverColorScheme(averageColor.rgba);
      const { r, g, b } = RGBAstringToObject(coverColor);
      const RGBstring = RGBobjectToString({r, g, b});
      const buttonStyles = getButtonRGBs(RGBstringToObject(RGBstring));
      setCoverColor(coverColor);
      setTextColor(textColor);
      setButtonStyles(buttonStyles);
    };
    fetchData();
  }, []);

  const MemoizedTrackInfo: React.FC<MemoizedComponentProps> = React.memo(({
    pid,
    coverUsed,
    podcastName,
    eid,
    episodeName,
    uploader,
    coverColor,
    author,
    includeDescription,
    description,
  }) => {
    return (
      <div className={trackFlexCenterPaddedYStyling}>
        <PodcastCover {...{ pid, cover: coverUsed, alt: podcastName }} />
        <div className="ml-4 flex flex-col min-w-[100px]">
          <EpisodeLinkableTitle {...{ eid, episodeName }} />
          <div className={trackFlexCenterYStyling}>
            <p className={trackByStyling}>{t("track.by")}</p>
            <TrackCreatorLink {...{ uploader, buttonStyles, coverColor, author }} />
          </div>
        </div>
        <TrackDescription {...{ includeDescription, description }} />
      </div>
    );
  });

  const playerInfo = {
    playerColorScheme: coverColor,
    buttonColor: textColor,
    accentColor: textColor,
    title: episodeName,
    artist: author,
    cover: coverUsed,
    src: contentTx,
  };

  return (
    <div className={trackFlexCenterBothStyling}>
      <MemoizedTrackInfo {...{ pid, coverUsed, podcastName, eid, episodeName, uploader, coverColor, author, description, includeDescription }} />
      <TrackPlayButton {...{ playerInfo, episode, includePlayButton, buttonColor: coverColor, accentColor: coverColor }} />
    </div>
  );
};

export default Track;