import React, { useState, useEffect, FC } from "react";

import PlayButton from "../reusables/playButton";


import { FeaturedPodcastPlayButtonInterface } from "../../interfaces/playback"; 

import { useShikwasa } from "../../hooks";



const FeaturedPodcastPlayButton: FC<FeaturedPodcastPlayButtonInterface> = ({ playerInfo, podcastInfo, episodes }) => {

  const { playerColorScheme, buttonColor, accentColor, title, artist, cover, src, } = playerInfo;

  const { playerState, launchPlayer, togglePlay } = useShikwasa();
  const { currentPodcast, isPlaying } = playerState;

  const [localIsPlaying, setLocalIsPlaying] = useState<boolean>(false);
  const openFullscreen = true;

  useEffect(() => {
    if (currentPodcast.pid === podcastInfo.pid && isPlaying) {
      setLocalIsPlaying(true);
    } else {
      setLocalIsPlaying(false);
    };
  }, [currentPodcast, isPlaying]);

  const handlePlay = () => {
    if (!(currentPodcast.pid === podcastInfo.pid)) {
      launchPlayer({ playerColorScheme, buttonColor, openFullscreen, title, artist, cover, src }, podcastInfo, episodes);
    } else {
      togglePlay();
      setLocalIsPlaying(false);
    };
  };

  const buttonStyleArgs = {
    size: 40,
    iconSize: 20,
    buttonColor: accentColor,
    accentColor: accentColor
  };

  if (episodes.length) {
    return (
      <PlayButton
        onClick={handlePlay}
        isPlaying={localIsPlaying}
        {...buttonStyleArgs}
      />
    );
  } else {
    return (
      <PlayButton {...buttonStyleArgs} />
    );
  };
};


export default FeaturedPodcastPlayButton;