
import { showShikwasaPlayerArguments } from '@/interfaces/playback';
import { Episode, FullEpisodeInfo, Podcast } from '@/interfaces/index';

import Player from '@/shikwasa-src/player';

export type playerInterface = Player | null | any;

export interface playerStateInterface {
  player: playerInterface;
  isQueueVisible: boolean;
  isPlaying: boolean;
  isFullscreen: boolean;
  currentPodcast: Podcast | null;
  currentEpisode: Episode | null;
  queue: FullEpisodeInfo[];
};

export type launchPlayerInterface = (
  args: showShikwasaPlayerArguments,
  podcast?: Podcast,
  episodes?: FullEpisodeInfo[],
) => Player;

export type togglePlayInterface = () => void;

export interface ShikwasaContextInterface {
  playerState: playerStateInterface,
  launchPlayer: launchPlayerInterface,
  togglePlay: togglePlayInterface,
};
