import React, { FC, ReactNode } from 'react';

import { useRecoilState } from 'recoil';

import { useTranslation } from 'next-i18next';

import { Sidenav, NavBar } from './navigation';
import Background from './background';

import EpisodeQueue from './episodeQueue';
import Fullscreen from './fullscreen';

import { isFullscreenAtom, isQueueVisibleAtom } from '../atoms/index';
import { MINT_DURATION, TOAST_POSITION } from '../constants';
import { Toaster } from 'react-hot-toast';

interface LayoutInterface {
  children: ReactNode;
};
//ml-0 lg:pr-8 pt-2 px-5 lg:pt-9
export const AppStyling = "select-none h-full bg-black overflow-hidden";
export const AppInnerStyling = "flex h-screen overflow-x-hidden relative";
export const BackgroundWrapperStyling = "w-screen overflow-y-scroll overflow-x-hidden z-[1]";
export const InnerLayoutStyling = "ml-0 md:ml-5 md:pr-8 pt-2 px-5 md:pt-8 z-[3]";
export const ParentStyling = "w-full overflow-hidden z-[3]";

const Layout: FC<LayoutInterface> = ({ children }) => {

  const [isFullscreen] = useRecoilState(isFullscreenAtom);
  const [isQueueVisible] = useRecoilState(isQueueVisibleAtom);

  return (
    <div className={AppStyling} data-theme="permacast">
      <div className={AppInnerStyling}>
        <Sidenav />
        {isQueueVisible && <EpisodeQueue />}
        {isFullscreen && <Fullscreen />}
        <div className={BackgroundWrapperStyling}>
          <Background />
          <div className={InnerLayoutStyling} id="start">
            <Toaster
              position={TOAST_POSITION}
              reverseOrder={false}
              toastOptions={{
                duration: MINT_DURATION
              }}
            />
            <NavBar />
            <div className={ParentStyling}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;