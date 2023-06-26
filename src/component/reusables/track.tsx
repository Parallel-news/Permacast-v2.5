import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import React, { useState, useMemo, useEffect } from 'react';
import { shortenAddress } from "react-arconnect";
import { Tooltip } from 'react-tooltip'
import { useRecoilState } from 'recoil';
import PlayButton from "./playButton";
import MarkdownRenderer from '../markdownRenderer';

import { allANSUsersAtom, loadingPage } from "@/atoms/index";
import { ARSEED_URL, MESON_ENDPOINT, startId } from "@/constants/index";
import { ANSMapped, FullEpisodeInfo } from "@/interfaces/index";
import { showShikwasaPlayerArguments } from "@/interfaces/playback";
import useShikwasa from "@/hooks/useShikwasa";
import { queryMarkdownByTX } from "@/utils/markdown";
import {
  determinePodcastURL,
  fetchDominantColor,
  getButtonRGBs,
  getCoverColorScheme,
  RGBAstringToObject,
  RGBobjectToString,
  RGBstringToObject
} from "@/utils/ui";
import { trimChars } from "@/utils/filters";
import { detectTimestampType, hasBeen10Min } from "@/utils/reusables";
import { Icon } from "../icon";

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
  includeContentType?: boolean,
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
  minified?: boolean;
  fontSize?: number;
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

export interface TrackContentTypeIconProps {
  includeContentType: boolean;
  isVideo: boolean;
  className: string;
};

// 2. Stylings

export const trackFlexCenterYStyling = `flex items-center mt-1 `;
export const trackFlexCenterPaddedYStyling = `flex items-center flex-col md:flex-row justify-center p-3 space-y-3 md:space-y-0 w-[85%]`;
export const trackFlexCenterBothStyling = `flex items-center justify-between border-zinc-600 border-2 rounded-2xl pr-4 `;
export const trackEpisodeLinkableTitleStyling = `cursor-pointer line-clamp-1 pr-2 text-sm hover:underline select-text`;
export const trackByStyling = `text-zinc-400 text-[10px] mr-2 `;
export const trackBackgroundColorStyling = `rounded-full cursor-pointer flex items-center min-w-max gap-x-1 px-2 py-0.5 brighten-animation `;
export const trackDescriptionStyling = `mx-1.5 w-full line-clamp-1 text-xs `;
export const trackMainInfoStyling = `ml-4 flex flex-col text-wrap `;
export const trackPodcastInfoContainer = `flex flex-row md:items-center w-full md:min-w-[25%] `;

export const PodcastCover = ({ podcastURL, cover, alt, timestamp }: PodcastCoverProps) => {
  const [, _setLoadingPage] = useRecoilState(loadingPage)
  if (cover) return (
    <Link
      href={`/podcast/${podcastURL}`}
      className={`w-14 h-14 shrink-0`}
      onClick={() => _setLoadingPage(true)}
    >
      <Image
        width={56}
        height={56}
        className="rounded-lg aspect-square object-cover w-14 h-14"
        src={hasBeen10Min(timestamp) ? MESON_ENDPOINT + cover : ARSEED_URL + cover}
        alt={alt}
      />
    </Link>
  );
};

export const EpisodeLinkableTitle = ({ podcastURL, eid, episodeName }: EpisodeLinkableTitleProps) => {
  const [, _setLoadingPage] = useRecoilState(loadingPage)
  return (
    <Link
      href={`/episode/${podcastURL}/${trimChars(eid)}${startId}`}
      className={trackEpisodeLinkableTitleStyling}
      onClick={() => _setLoadingPage(true)}
    >
      {episodeName}
    </Link>
  );
};

export const TrackCreatorLink = ({ uploader, buttonStyles, coverColor, minified, fontSize }: TrackCreatorLinkProps) => {
  const text = uploader || "";
  const uploaderText = shortenAddress(text, minified ? 8 : 16);
  const [, _setLoadingPage] = useRecoilState(loadingPage);

  if (buttonStyles.backgroundColor && buttonStyles.color) return (
    <Link
      href={`/creator/${uploader}`}
      style={{ ...buttonStyles, fontSize: `${fontSize || 10}px` }}
      className={trackBackgroundColorStyling}
      onClick={() => _setLoadingPage(true)}
    >
      <div
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: coverColor }}
      ></div>
      <div>{uploaderText}</div>
    </Link>
  );
};

export const TrackDescription = ({ includeDescription, description }: TrackDescriptionProps) => {
  if (includeDescription && description) return (
    <div className={trackDescriptionStyling}>
      <MarkdownRenderer markdownText={description} />
    </div>
  );
};

export const TrackContentTypeIcon = ({ isVideo, className, includeContentType }: TrackContentTypeIconProps) => {

  const { t } = useTranslation();

  if (includeContentType) return (
    <>
      <div
        data-tooltip-id="my-tooltip"
        data-tooltip-content={t(isVideo ? "track.video" : "track.audio")}
        data-tooltip-place="top"
      >
        {isVideo ? <Icon {...{ className }} icon="CAM" /> : <Icon {...{ className }} icon="MIC" />}
      </div>
      <Tooltip id="my-tooltip" />
    </>
  );
};


export const TrackPlayButton = ({
  playerInfo,
  episode,
  includePlayButton,
  buttonColor,
  accentColor
}: TrackPlayButtonProps) => {

  const { playerState, launchPlayer, togglePlay } = useShikwasa();

  let currentPodcast, currentEpisode, isPlaying;

  if (playerState) {
    currentPodcast = playerState?.currentPodcast;
    currentEpisode = playerState?.currentEpisode;
    isPlaying = playerState?.isPlaying;
  };

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
    buttonColor: accentColor || "rgb(0, 0, 0)",
    accentColor: accentColor || "rgb(0, 0, 0)"
  };

  if (!includePlayButton) return <></>;

  return <PlayButton isPlaying={isPlaying && currentEpisode && (currentEpisode.eid === episodeInfo.eid)} onClick={handlePlay} {...buttonStyleArgs} />;
};

const Track = (props: TrackProps) => {

  const { t } = useTranslation();

  const { episode, openFullscreen, includeDescription, includePlayButton, includeContentType } = props;
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
    thumbnail,
    type,
    eid,
    uploader,
    uploadedAt,
    isVisible
  } = episode.episode;

  const coverUsed = thumbnail || minifiedCover || cover;

  const [allANSUsers, setAllANSUsers] = useRecoilState(allANSUsersAtom);

  const [coverColor, setCoverColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [buttonStyles, setButtonStyles] = useState<ButtonStyle>({ backgroundColor: '', color: '' });
  const [markdown, setMarkdown] = useState<string>('');
  const [artist, setArtist] = useState<string>('');

  useMemo(() => {
    const ANS = allANSUsers.find((user: ANSMapped) => user.address === uploader);
    if (ANS) setArtist(ANS.primary + ".ar");
    else setArtist(uploader);
  }, [allANSUsers]);

  // WARNING: Switching to useMemo will trigger mounting error
  useEffect(() => {
    const fetchData = async () => {
      if (!coverUsed) return;
      const dominantColor = await fetchDominantColor(coverUsed);
      if (dominantColor.error) return;
      const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba);
      const { r, g, b } = RGBAstringToObject(coverColor);
      const RGBstring = RGBobjectToString({ r, g, b });
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
    openFullscreen: true,
    title: episodeName,
    artist,
    cover: coverUsed,
    src: contentTx,
  };

  const podcastURL = determinePodcastURL(label, pid);
  const isVideo = type.includes("video");
  const timestamp = detectTimestampType(uploadedAt) === "seconds" ? uploadedAt * 1000 : uploadedAt;
  const className = `w-4 h-4 hover:white zinc-600 mx-1 `;

  return (
    <div className={trackFlexCenterBothStyling}>
      <div className={trackFlexCenterPaddedYStyling}>
        <span className={trackPodcastInfoContainer}>
          <PodcastCover {...{ podcastURL, cover: coverUsed, alt: podcastName, timestamp }} />
          <div className={trackMainInfoStyling}>
            <EpisodeLinkableTitle {...{ podcastURL, eid, episodeName }} />
            <div className={trackFlexCenterYStyling}>
              <p className={trackByStyling}>{t("track.by")}</p>
              <div className={`flexCenter `}>
                <TrackCreatorLink {...{ uploader: artist, buttonStyles, coverColor }} minified />
                <TrackContentTypeIcon {...{ isVideo, className, includeContentType }} />
                <Tooltip id={"hidden-tooltip"+eid} offset={0}/>
                {isVisible ? null 
                  : 
                <Image src={"/icons/eye-slash-white.svg"} width={20} height={20} alt="Hidden Episode" className="rounded-md p-0.5"
                  data-tooltip-content={t("tooltips.hidden-content")} data-tooltip-place="top" data-tooltip-id={"hidden-tooltip"+eid}
                />}
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