import React, { FC, ReactNode, useEffect } from 'react';

import { useRecoilState } from 'recoil';

import { useTranslation } from 'next-i18next';

import { Sidenav, NavBar } from './navbars';
import Background from './background';

import EpisodeQueue from './episodeQueue';
import Fullscreen from './fullscreen';

import { isFullscreenAtom, isQueueVisibleAtom } from '../atoms/index';

interface LayoutInterface {
  children: ReactNode;
}

const Layout: FC<LayoutInterface> = ({ children }) => {
  const { t } = useTranslation()


  const [_isFullscreen, _setIsFullscreen] = useRecoilState(isFullscreenAtom);
  const [isQueueVisible, setQueueVisible] = useRecoilState(isQueueVisibleAtom);

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
            {isQueueVisible && <EpisodeQueue />}
          </div>
        </div>
        {/* placeholder */}
        {_isFullscreen && <Fullscreen episode={''} id={1} />}
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
      </div>
    </div>
  )
}

export default Layout;