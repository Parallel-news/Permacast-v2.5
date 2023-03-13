import React, { useState, useEffect, FC } from "react";
import { useRecoilState } from "recoil";

import {
  dimColorString,
  RGBobjectToString,
} from "../../utils/ui";

import { PlayButton } from "../reusables/icons";

import { currentPodcast, isPlaying, queue } from "../../atoms";

import { Episode } from "../../interfaces/index.js";
import { FeaturedPodcastPlayButtonInterface } from "../../interfaces/playback"; 

import { PauseIcon } from "@heroicons/react/24/outline";
import { usePlayerConnector } from "../../hooks";



// WIP
// This would require a proper integration with the player and a few other things:
// 1. To check against which podcast name is playing (to save current podcast name into recoil state)
// 2. To show paused button if the player is paused when playing an episode from current podcast
// 3. To prevent the player from enqueueing the same episodes again if one of them is already playing
// 4. To automatically pause when queue state clears all episodes from currently playing podcast

const FeaturedPodcastPlayButton: FC<FeaturedPodcastPlayButtonInterface> = ({ playerInfo, podcastInfo, episodes }) => {

  const { themeColor, buttonColor, title, artist, cover, src, } = playerInfo;

  const [launchPlayer] = usePlayerConnector();

  // const [_queue, _setQueue] = useRecoilState<Episode[]>(queue);
  const [currentPodcast_, setCurrentPodcast_] = useRecoilState(currentPodcast);
  const [isPlaying_, setIsPlaying_] = useRecoilState<boolean>(isPlaying);
  const [localIsPlaying, setLocalIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    //@ts-ignore
    if (currentPodcast_?.pid === podcastInfo?.pid) {
      // !TODO make sure to also check playback state
      // setLocalIsPlaying(true);
      return;
    } else {
      // setLocalIsPlaying(false);
    };
  }, [currentPodcast_, isPlaying_])

  return (
    <button
      style={{backgroundColor: dimColorString(buttonColor, 0.2)}}
      className={`z-10 rounded-full w-10 h-10 flex justify-center items-center shrink-0 default-animation hover:scale-[1.1]`}
      onClick={() => {
        launchPlayer({ themeColor, title, artist, cover, src }, podcastInfo, episodes);
      }}
    >
      {localIsPlaying ? (
        <PauseIcon className="w-4 h-4 fill-current stroke-[3]" />
      ): (
        <PlayButton
          svgColor={buttonColor}
          fillColor={buttonColor}
          outlineColor={buttonColor}
        />
      )}
    </button>
  );
};

export const FeaturedPodcastDummyPlayButton: FC<{buttonColor: string}> = ({ buttonColor }) => {
  return (
    <button
      style={{backgroundColor: dimColorString(buttonColor, 0.2)}}
      className={`z-10 rounded-full w-10 h-10 flex justify-center items-center shrink-0 default-animation hover:scale-[1.1]`}
      onClick={() => {}}
    >
    <PlayButton
      svgColor={buttonColor}
      fillColor={buttonColor}
      outlineColor={buttonColor}
    />
    </button>
  ) 
}

export default FeaturedPodcastPlayButton;