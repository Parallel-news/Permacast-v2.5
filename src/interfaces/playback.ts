import { Episode, PodcastDev } from ".";
import Player from "../shikwasa-src/player";
import { RGB } from "./ui";

export interface showShikwasaPlayerArguments {
  themeColor:   string;
  buttonColor?: string;
  title:        string;
  artist:       string;
  cover:        string;
  src:          string;
};

export type ShowShikwasaPlayerInterface = ({
  themeColor, 
  title,
  artist,
  cover,
  src
}: showShikwasaPlayerArguments) => Player;

export interface FeaturedPodcastPlayButtonInterface {
  playerInfo:  showShikwasaPlayerArguments;
  podcastInfo: PodcastDev;
  episodes:    Episode[];
};
