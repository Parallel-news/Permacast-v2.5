import { useAccount } from 'wagmi';
import { useArconnect } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { isFullscreen, isPaused, isQueueVisible, player, queue } from '../atoms';
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
  const [player_, setPlayer_] = useRecoilState<any>(player);
  const [isQueueVisible_, setQueueVisible_] = useRecoilState(isQueueVisible);
  const [isPaused_, setIsPaused_] = useRecoilState(isPaused);
  const [isFullscreen_, setIsFullscreen_] = useRecoilState(isFullscreen);
  const [_queue, _setQueue] = useRecoilState(queue);

  const launchPlayer = (args: showShikwasaPlayerArguments, episodes: Episode[]) => {
    const playuh = showShikwasaPlayer(args);
    if (!playuh) return;
    // setPlayer_(playuh);
    if (episodes && episodes.length) _setQueue(episodes);
    const queue = playuh?.ui?.queueBtn;
    const paused = playuh?.ui?.playBtn;
    const fullscreen = playuh?.ui?.fullscreenBtn;

    queue?.addEventListener('click', () => setQueueVisible_(visible => !visible));
    paused?.addEventListener('click', () => setIsPaused_(paused => !paused));
    fullscreen?.addEventListener('click', () => setIsFullscreen_(isFullscreen => !isFullscreen));
    console.log('mounted successfully');
  };

  return [player_, launchPlayer];
}