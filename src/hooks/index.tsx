import { useRecoilState } from 'recoil';
import { currentEpisodeAtom, currentPodcastAtom, isFullscreenAtom, isPlayingAtom, isQueueVisibleAtom, queueAtom } from '../atoms';
import { createContext, MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { showShikwasaPlayer } from '../utils/ui';
import { showShikwasaPlayerArguments } from '../interfaces/playback';
import { Episode, Podcast } from '../interfaces';

import Player from '../shikwasa-src/player';
import { useRouter } from 'next/router';

export type playerInterface = Player | null | any;

export interface playerStateInterface {
  player: playerInterface;
  isQueueVisible: boolean;
  isPlaying: boolean;
  isFullscreen: boolean;
  currentPodcast: Podcast | null;
  currentEpisode: Episode | null;
  queue: Episode[];
};

export type launchPlayerInterface = (
  args: showShikwasaPlayerArguments,
  podcast?: Podcast,
  episodes?: Episode[]
) => Player;

type togglePlayInterface = () => void;


export const ShikwasaContext = createContext<
  Partial<ShikwasaContextInterface>
>({} as ShikwasaContextInterface);


export interface ShikwasaContextInterface {
  playerState: playerStateInterface,
  launchPlayer: launchPlayerInterface,
  togglePlay: togglePlayInterface,
};

export function useShikwasa(): Partial<ShikwasaContextInterface> {
  const useShikwasaContext: Partial<ShikwasaContextInterface> = useContext(
    ShikwasaContext
  );

  if (useShikwasaContext === null) {
    throw new Error(
      'useShikwasa() can only be used inside of <ShikwasaProvider />, ' +
        'please declare it at a higher level.'
    );
  }

  return useShikwasaContext;
}


export const ShikwasaProvider = ({ children }) => {
  const router = useRouter();
  const player = useRef<playerInterface>(null);
  const [isQueueVisible, setQueueVisible] = useRecoilState(isQueueVisibleAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [isFullscreen, setIsFullscreen] = useRecoilState(isFullscreenAtom);
  const [currentPodcast, setCurrentPodcast] = useRecoilState(currentPodcastAtom);
  const [currentEpisode, setCurrentEpisode] = useRecoilState(currentEpisodeAtom);
  const [queue, setQueue] = useRecoilState(queueAtom);

  const playerState = {
    player,
    isQueueVisible,
    isPlaying,
    isFullscreen,
    currentPodcast,
    currentEpisode,
    queue,
  };

  // // For debugging
  // useEffect(() => console.log('player updated', player.current), [player.current])
  // useEffect(() => console.log('isQueueVisible updated', isQueueVisible), [isQueueVisible])
  // useEffect(() => console.log('isPlaying updated', isPlaying), [isPlaying])
  // useEffect(() => console.log('isFullscreen updated', isFullscreen), [isFullscreen])
  // useEffect(() => console.log('currentEpisode updated', currentEpisode), [currentEpisode])
  // useEffect(() => console.log('currentPodcast updated', currentPodcast), [currentPodcast])
  // useEffect(() => console.log('queue updated', queue), [queue])

  // In simple terms, this function is responsible for:
  // 1. Creating a new player instance and mounting it to the UI
  // 2. Setting up event listeners for the player along with creating the ref
  // 3. Saving the current podcast and queue into recoil state for use in other components.
  // It functions like a Spotify "play album, enqueue all tracks" button.
  // 4. Returns helper functions for controlling the player

  const launchPlayer: launchPlayerInterface = (args, podcast, episodes) => {
    const playerObject = showShikwasaPlayer(args);
    if (!playerObject) return;

    // set player params
    player.current = playerObject;
    setIsPlaying(true);
    // save data about current podcast and episodes
    if (podcast) setCurrentPodcast(podcast);
    if (episodes && episodes.length) {
      setCurrentEpisode(episodes[0]);
      setQueue(episodes);
    };
    if (episodes[0].type.includes("video")) setIsFullscreen(true);
    const queue = playerObject?.ui?.queueBtn;
    const playing = playerObject?.ui?.playBtn;
    const fullscreen = playerObject?.ui?.fullscreenBtn;

    // add event listeners
    // TODO: re-add event listeners on navigation
    queue?.addEventListener('click', (event) => {event.stopPropagation(); setQueueVisible(visible => !visible)});
    playing?.addEventListener('click', (event) => {event.stopPropagation(); setIsPlaying(playing => !playing)});
    fullscreen?.addEventListener('click', (event) => {event.stopPropagation(); setIsFullscreen(isFullscreen => !isFullscreen)});
    console.log('mounted successfully');
    return playerObject;
  };

  const togglePlay = () => {
    if (!player.current) return;
    player.current.toggle();
    setIsPlaying(playing => !playing);
  };

  const rehoistVideo = () => {
    const v = player?.current?.audio;
    player.current.rehoistVideo(v);
  }

  useEffect(() => {
    if (isFullscreen) rehoistVideo();
  }, [isFullscreen])

  useEffect(() => {
    setIsFullscreen(false);
  }, [router.asPath]);

  return <ShikwasaContext.Provider value={{ playerState, launchPlayer, togglePlay }}>
    {children}
  </ShikwasaContext.Provider>
};
