import { FullEpisodeInfo, Podcast } from ".";
import Player from "../shikwasa-src/player";
import { RGBorRGBAstring, RGBstring } from "./ui";

export interface showShikwasaPlayerArguments {
  playerColorScheme?:  RGBorRGBAstring; // actual player color
  buttonColor?:        RGBstring; // play button in featured podcast, track, etc
  accentColor?:        string; // the play Icon within the play button, better contrast this way
  openFullscreen?:     boolean; // set this to true to force open fullscreen
  title:               string;
  artist:              string;
  cover:               string;
  src:                 string;
};

export type ShowShikwasaPlayerInterface = ({
  playerColorScheme, 
  title,
  artist,
  cover,
  src
}: showShikwasaPlayerArguments) => Player;

export interface FeaturedPodcastPlayButtonInterface {
  playerInfo:  showShikwasaPlayerArguments;
  podcastInfo: Podcast;
  episodes:    FullEpisodeInfo[];
};
