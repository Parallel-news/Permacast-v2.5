import { Episode } from ".";
import Player from "../shikwasa-src/player";
import { RGB } from "./ui";

export interface showShikwasaPlayerArguments {
  themeColor:  string;
  title:  string;
  artist: string;
  cover:  string;
  src:    string;
}

export type ShowShikwasaPlayerInterface = ({
  themeColor, 
  title,
  artist,
  cover,
  src
}: showShikwasaPlayerArguments) => Player;

export interface FeaturedPodcastPlayButtonInterface {
  episodes:      Episode[];
  buttonColor:   RGB;
  playerInfo:    showShikwasaPlayerArguments;
};
