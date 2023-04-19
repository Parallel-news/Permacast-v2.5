import { createContext, useContext, useEffect, useRef } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { currentEpisodeAtom, currentPodcastAtom, isFullscreenAtom, isPlayingAtom, isQueueVisibleAtom, queueAtom } from '../atoms';
import { getColorSchemeShorthand, showEmptyShikwasaPlayer, showShikwasaPlayer } from '../utils/ui';
import { showShikwasaPlayerArguments } from '../interfaces/playback';
import { Episode, FullEpisodeInfo, Podcast } from '../interfaces';

import Player from '../shikwasa-src/player';
import { useRouter } from 'next/router';
import { CURRENT_EPISODE_TEMPLATE, CURRENT_PODCAST_TEMPLATE } from '../constants/ui';

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
  const onPlaybackEndCallback = useRecoilCallback(({ snapshot, set }) => async (event) => {
    set(isPlayingAtom, () => false);
    const queue = await snapshot.getPromise(queueAtom);
    let newQueue = [...queue];
    newQueue = newQueue.splice(1, queue.length);
    if (newQueue.length > 0) {
      const { podcast, episode } = newQueue[0];
      const { minifiedCover: coverToBeUsed = podcast.cover } = podcast;
      const { author: artist, cover } = podcast;
      const { contentTx: src, episodeName: title } = episode;
      const [coverColor, textColor] = await getColorSchemeShorthand(coverToBeUsed);
      const args = { playerColorScheme: coverColor, buttonColor: textColor, accentColor: textColor, title, artist, cover, src };
      launchPlayer(args, podcast, newQueue);
    } else {
      set(queueAtom, () => []);
      setCurrentEpisode(CURRENT_EPISODE_TEMPLATE);
      setCurrentPodcast(CURRENT_PODCAST_TEMPLATE);
      setIsFullscreen(false);
      const emptyPlayer = showEmptyShikwasaPlayer();
      mountPlayerWithListeners(emptyPlayer);
    };
  });


  // In simple terms, this function is responsible for:
  // 1. Creating a new player instance and mounting it to the UI
  // 2. Setting up event listeners for the player along with creating the ref
  // 3. Saving the current podcast and queue into recoil state for use in other components.
  // It functions like a Spotify "play album, enqueue all tracks" button.
  // 4. Returns helper functions for controlling the player

  const launchPlayer: launchPlayerInterface = (args, podcast, episodes) => {
    const playerUI = showShikwasaPlayer(args);
    if (!playerUI) return;
    mountPlayerWithListeners(playerUI);

    // set player params
    setIsPlaying(true);
    // save data about current podcast and episodes
    if (podcast) setCurrentPodcast(podcast);
    if (episodes.length) {
      const { episode } = episodes[0];
      setCurrentEpisode(episode);
      setQueue(episodes);
      console.log(episodes);
      if (episode?.type?.includes("video") && args?.openFullscreen) setIsFullscreen(true);
    };

    return playerUI;
  };

  const mountPlayerWithListeners = (shikwasaPlayerInstance: Player) => {
    player.current = shikwasaPlayerInstance;
    const UI = shikwasaPlayerInstance?.ui;

    const queueBtn = UI.queueBtn;
    const playingBtn = UI.playBtn;
    const fullscreenBtn = UI.fullscreenBtn;

    // add event listeners
    shikwasaPlayerInstance?.audio?.addEventListener('ended', onPlaybackEndCallback);
    queueBtn?.addEventListener('click', (event) => {event.stopPropagation(); setQueueVisible(visible => !visible)});
    playingBtn?.addEventListener('click', (event) => {event.stopPropagation(); setIsPlaying(playing => !playing)});
    fullscreenBtn?.addEventListener('click', (event) => {event.stopPropagation(); setIsFullscreen(isFullscreen => !isFullscreen)});
    console.log('mounted successfully');
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
  }, [isFullscreen]);

  useEffect(() => {
    setIsFullscreen(false);
  }, [router.asPath]);

  return <ShikwasaContext.Provider value={{ playerState, launchPlayer, togglePlay }}>
    {children}
  </ShikwasaContext.Provider>
};
