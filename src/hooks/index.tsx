import { useAccount } from 'wagmi';
import { useArconnect } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { currentPodcast, isFullscreen, isPlaying, isQueueVisible, queue } from '../atoms';
import { useEffect, useState } from 'react';
import { showShikwasaPlayer } from '../utils/ui';
import { showShikwasaPlayerArguments } from '../interfaces/playback';
import { Episode } from '../interfaces';

export const useWalletAddresses = () => {
  const { address: EthAddress } = useAccount();
  const { address: ArConnectAddress } = useArconnect();

  return [EthAddress, ArConnectAddress];
};

export const usePlayerConnector = () => {

  const [isQueueVisible_, setQueueVisible_] = useRecoilState(isQueueVisible);
  const [_isPlaying, _setIsPlaying] = useRecoilState(isPlaying);
  const [isFullscreen_, setIsFullscreen_] = useRecoilState(isFullscreen);
  const [currentPodcast_, setCurrentPodcast_] = useRecoilState(currentPodcast);
  const [_queue, _setQueue] = useRecoilState(queue);

  const launchPlayer = (args: showShikwasaPlayerArguments, podcast?: any, episodes?: Episode[]) => {
    const playerObject = showShikwasaPlayer(args);
    if (!playerObject) return;
    // setPlayer_(playerObject);
    if (podcast) setCurrentPodcast_(podcast);
    if (episodes && episodes.length) _setQueue(episodes);
    const queue = playerObject?.ui?.queueBtn;
    const paused = playerObject?.ui?.playBtn;
    const fullscreen = playerObject?.ui?.fullscreenBtn;

    queue?.addEventListener('click', () => setQueueVisible_(visible => !visible));
    paused?.addEventListener('click', () => _setIsPlaying(playing => !playing));
    fullscreen?.addEventListener('click', () => setIsFullscreen_(isFullscreen => !isFullscreen));
    console.log('mounted successfully');
    return playerObject;
  };

  const pause = () => {}

  const play = () => {}

  return [launchPlayer];
}