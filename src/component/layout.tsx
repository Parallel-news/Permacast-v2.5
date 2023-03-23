import React, { FC, ReactNode, useEffect } from 'react';

import { useRecoilState } from 'recoil';

import { useTranslation } from 'next-i18next';

import { Sidenav, NavBar } from './navbars';
import Background from './background';

import EpisodeQueue from './episodeQueue';
import Fullscreen from './fullscreen';
import VideoModal from './video_modal';

import { isFullscreen, queue, currentEpisode, isPlaying, isQueueVisible, currentThemeColor } from '../atoms/index.js';
import { THEME_COLOR } from '../constants/ui';

interface LayoutInterface {
  children: ReactNode;
}

const Layout: FC<LayoutInterface> = ({ children }) => {
  const { t } = useTranslation()


  const [_isFullscreen, _setIsFullscreen] = useRecoilState(isFullscreen);
  const [_isPlaying, _setIsPlaying] = useRecoilState(isPlaying);
  const [_currentEpisode, _setCurrentEpisode] = useRecoilState(currentEpisode);
  const [_queue, _setQueue] = useRecoilState(queue);
  const [_isQueueVisible, _setQueueVisible] = useRecoilState(isQueueVisible);

  const [currentThemeColor_, setCurrentThemeColor_] = useRecoilState(currentThemeColor);

  useEffect(() => {
    setCurrentThemeColor_(THEME_COLOR);
  }, [])

  return (
    <div className="select-none h-full bg-black overflow-hidden " data-theme="permacast">
      <div className="flex h-screen">
        <div className="hidden md:block z-50">
          <div className="w-[100px] z-50 flex justify-center">
            <Sidenav />
          </div>
        </div>
        <div className="z-50">
          <div className="absolute z-50 bottom-0 right-0">
            {_isQueueVisible && <EpisodeQueue />}
          </div>
        </div>
        {_isFullscreen && <Fullscreen episode={_currentEpisode} id={Number(_currentEpisode?.number) || 1} />}
        <Background>
          <div className="ml-8 pr-8 pt-9">
            <div className="mb-10">
              <NavBar />
            </div>
            <div className="w-full overflow-hidden">
              {children}
            </div>
          </div>
        </Background>
        <VideoModal/>
      </div>
    </div>
  )
}

export default Layout;