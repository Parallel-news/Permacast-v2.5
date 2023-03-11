import { Episode } from ".";
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
}: showShikwasaPlayerArguments) => void;

export interface FeaturedPodcastPlayButtonInterface {
  episodes:      Episode[];
  buttonColor:   RGB;
  playerInfo:    showShikwasaPlayerArguments;
};
