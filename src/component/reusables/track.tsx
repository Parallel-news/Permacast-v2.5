import Image from "next/image";
import Link from "next/link";
import React, { FC, useState, useMemo, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { shortenAddress } from "react-arconnect";

import { ANSMapped, arweaveTX, FullEpisodeInfo } from "../../interfaces";
import { determinePodcastURL, fetchDominantColor, getButtonRGBs, getCoverColorScheme, RGBAstringToObject, RGBobjectToString, RGBstringToObject } from "../../utils/ui";
import { useShikwasa } from "../../hooks";
import { showShikwasaPlayerArguments } from "../../interfaces/playback";
import PlayButton from "./playButton";
import MarkdownRenderer from "../markdownRenderer";
import { queryMarkdownByTX } from "../../utils/markdown";
import { ARSEED_URL, ARWEAVE_READ_LINK, MESON_ENDPOINT, startId } from "../../constants";
import { trimChars } from "../../utils/filters";
import { flexCenter } from "../creator/featuredCreators";
import { allANSUsersAtom } from "../../atoms";
import { useRecoilState } from "recoil";
import { MicrophoneIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@nextui-org/react";
import { detectTimestampType, hasBeen10Min, reRoute} from "../../utils/reusables";
import { useRouter } from "next/router";

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
  openFullscreen?: boolean;
  includeDescription?: boolean,
  includePlayButton?: boolean,
};

export interface PodcastCoverProps {
  podcastURL?: string;
  cover?: string;
  alt: string;
  timestamp: number;
};

export interface ButtonStyle {
  backgroundColor: string;
  color: string;
};

export interface EpisodeLinkableTitleProps {
  podcastURL: string;
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

// 2. Stylings

export const trackFlexCenterYStyling = `${flexCenter} mt-1 `;
export const trackFlexCenterPaddedYStyling = `${flexCenter} flex-col md:flex-row justify-center p-3 space-y-3 md:space-y-0 w-[85%]`;
export const trackFlexCenterBothStyling = `${flexCenter} justify-between border-zinc-600 border-2 rounded-2xl pr-4 `;
export const trackEpisodeLinkableTitleStyling = `cursor-pointer line-clamp-1 pr-2 text-sm hover:underline `;
export const trackByStyling = `text-zinc-400 text-[10px] mr-2 `;
export const trackBackgroundColorStyling = `rounded-full cursor-pointer flex items-center min-w-max text-[10px] gap-x-1 px-2 py-0.5 focus:brightness-150 hover:brightness-125 default-animation `;
export const trackDescriptionStyling = `mx-1.5 w-full line-clamp-1 text-xs `;
export const trackMainInfoStyling = `ml-4 flex flex-col text-wrap `;
export const trackPodcastInfoContainer = "flex flex-row md:items-center w-full md:min-w-[25%]"

// 3. Custom Functions

// const ShortenAuthor = (author: string, maxLength: number) => {
//   return author.split(0, 20);
// }

// 4. Reusable Components

export const PodcastCover: FC<PodcastCoverProps> = ({ podcastURL, cover, alt, timestamp }) => {
  if (cover) return (
    <Link href={`/podcast/${podcastURL}`} className={`w-14 h-14 shrink-0`}>
      <Image
        width={56}
        height={56}
        className="rounded-lg aspect-square object-cover w-14 h-14"
        src={hasBeen10Min(timestamp) ? MESON_ENDPOINT+ cover : ARSEED_URL + cover }
        alt={alt}
      />
    </Link>
  );
};

export const EpisodeLinkableTitle: FC<EpisodeLinkableTitleProps> = ({ podcastURL, eid, episodeName }) => {


  return (
    <Link
    href={`/episode/${podcastURL}/${trimChars(eid)}${startId}`}
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
      <div>{uploader || author || ""}</div>
    </Link>
  );
};

export const TrackDescription: FC<TrackDescriptionProps> = ({ includeDescription, description }) => {
  if (includeDescription && description) return (
    <div className={trackDescriptionStyling}>
      <MarkdownRenderer markdownText={description} />
    </div>
  );
};

export const TrackPlayButton: FC<TrackPlayButtonProps> = ({ playerInfo, episode, includePlayButton, buttonColor, accentColor }) => {

  const { playerState, launchPlayer, togglePlay } = useShikwasa();

  let currentPodcast, currentEpisode, isPlaying;

  if (playerState) {
    currentPodcast = playerState?.currentPodcast;
    currentEpisode = playerState?.currentEpisode;
    isPlaying = playerState?.isPlaying;
  }
  
  const episodeInfo = episode.episode;
  const podcastInfo = episode.podcast;


  const handlePlay = () => {
    if (!(currentEpisode.eid === episodeInfo.eid)) {
      launchPlayer(playerInfo, podcastInfo, [episode]);
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

  return <PlayButton isPlaying={isPlaying && currentEpisode && (currentEpisode.eid === episodeInfo.eid)} onClick={handlePlay} {...buttonStyleArgs} />;
};

const Track: FC<TrackProps> = (props: TrackProps) => {

  const { t } = useTranslation();

  const { episode, openFullscreen, includeDescription, includePlayButton } = props;
  const {
    cover,
    label,
    minifiedCover,
    author,
    podcastName,
    pid,
  } = episode.podcast;
  const {
    episodeName,
    contentTx,
    description,
    type,
    eid,
    uploader,
    uploadedAt
  } = episode.episode;

  const coverUsed = minifiedCover || cover;

  const [allANSUsers, setAllANSUsers] = useRecoilState(allANSUsersAtom);

  const [coverColor, setCoverColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [buttonStyles, setButtonStyles] = useState<ButtonStyle>({backgroundColor: '', color: ''})
  const [markdown, setMarkdown] = useState<string>('');
  const [artist, setArtist] = useState<string>('');

  useMemo(() => {
    const ANS = allANSUsers.find((user: ANSMapped) => user.address === uploader);
    if (ANS) setArtist(ANS.primary + ".ar");
    else setArtist(shortenAddress(uploader || author || "", 8));
  }, []);

  useMemo(() => {
    const fetchData = async () => {
      if (!coverUsed) return;
      const dominantColor = await fetchDominantColor(coverUsed);
      if (dominantColor.error) return;
      const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba);
      const { r, g, b } = RGBAstringToObject(coverColor);
      const RGBstring = RGBobjectToString({r, g, b});
      const buttonStyles = getButtonRGBs(RGBstringToObject(RGBstring));
      setCoverColor(coverColor);
      setTextColor(textColor);
      setButtonStyles(buttonStyles);
      const markdown = (await queryMarkdownByTX(description));
      setMarkdown(markdown);
    };
    fetchData();
  }, []);

  const playerInfo = {
    playerColorScheme: coverColor,
    buttonColor: textColor,
    accentColor: textColor,
    openFullscreen, 
    title: episodeName,
    artist,
    cover: coverUsed,
    src: contentTx,
  };

  const podcastURL =  determinePodcastURL(label, pid);
  const isVideo = type.includes("video");
  const className = 'w-4 h-4 hover:white zinc-600 mx-1'
  
  return (
    <div className={trackFlexCenterBothStyling}>
      <div className={trackFlexCenterPaddedYStyling}>
        <span className={trackPodcastInfoContainer}>
          <PodcastCover {...{ podcastURL, cover: coverUsed, alt: podcastName, timestamp: detectTimestampType(uploadedAt) === "seconds" ? uploadedAt * 1000 : uploadedAt}} />
          <div className={trackMainInfoStyling}>
            <EpisodeLinkableTitle {...{ podcastURL, eid, episodeName }} />
            <div className={trackFlexCenterYStyling}>
              <p className={trackByStyling}>{t("track.by")}</p>
              <div className={flexCenter}>
                <TrackCreatorLink {...{ uploader: artist, buttonStyles, coverColor, author }} />
                <Tooltip color='invert' content={t(isVideo ? "track.video" : t("track.audio"))}>
                  {isVideo ? <VideoCameraIcon {...{className}} /> : <MicrophoneIcon {...{className}} />}
                </Tooltip>
              </div>
            </div>
          </div>
        </span>
        
        <div className="flex justify-start w-full md:pl-4 lg:pl-0">
          <TrackDescription {...{ includeDescription, description: markdown }} />
        </div>
      </div>
      <TrackPlayButton {...{ playerInfo, episode, includePlayButton, buttonColor: coverColor, accentColor: coverColor }} />
    </div>
  );
};

export default Track;