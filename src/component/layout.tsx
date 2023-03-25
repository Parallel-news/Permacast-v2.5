import React, { FC, ReactNode } from 'react';

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


  const [_isFullscreen, _setIsFullscreen] = useRecoilState(isFullscreenAtom);
  const [isQueueVisible] = useRecoilState(isQueueVisibleAtom);

  return (
    <div className="select-none h-full bg-black overflow-hidden " data-theme="permacast">
      <div className="flex h-screen overflow-x-hidden relative">
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
        <div className="w-screen overflow-y-scroll overflow-x-hidden">
          <Background />
          <div className="ml-8 pr-8 pt-9 relative z-[3]">
            <div className="mb-10 ">
              <NavBar />
            </div>
            <div className="w-full overflow-hidden z-[3]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;