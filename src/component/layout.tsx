import React, { FC, ReactNode, useEffect } from 'react';

import { useRecoilState } from 'recoil';

import { useTranslation } from 'next-i18next';

import { Sidenav, NavBar } from './navigation';
import Background from './background';

import EpisodeQueue from './episodeQueue';
import Fullscreen from './fullscreen';

import { firstRender, isFullscreenAtom, isQueueVisibleAtom } from '../atoms/index';
import { FADE_WAIT, MINT_DURATION, TOAST_POSITION } from '../constants';
import { Toaster } from 'react-hot-toast';
import { InitialLoad } from './reusables/InitialLoad';
import { DEFAULT_BACKGROUND_COLOR } from '../constants/ui';

interface LayoutInterface {
  children: ReactNode;
};

//ml-0 lg:pr-8 pt-2 px-5 lg:pt-9
export const AppStyling = "select-none h-full overflow-hidden ";
export const AppInnerStyling = "flex h-screen overflow-x-hidden relative";
export const BackgroundWrapperStyling = "w-screen overflow-y-scroll overflow-x-hidden z-[1]";
export const InnerLayoutStyling = "ml-0 md:ml-2 md:pr-8 pt-2 px-5 md:pt-8 z-[3]";
export const ParentStyling = "w-full overflow-hidden z-[3]";

const Layout: FC<LayoutInterface> = ({ children }) => {

  const [isFullscreen] = useRecoilState(isFullscreenAtom);
  const [isQueueVisible] = useRecoilState(isQueueVisibleAtom);
  const [_firstRender, _setFirstRender] = useRecoilState(firstRender)

  useEffect(() => {
    if(!_firstRender) {
      //set the timeout 
      const timer = setTimeout(() =>{_setFirstRender(true); console.log("O RENDERED");}, FADE_WAIT+1000);
      
      return () => clearTimeout(timer);
    }
  }, [])

  const backgroundColor = DEFAULT_BACKGROUND_COLOR;

  return (
    <div className={AppStyling} data-theme="permacast">
      {!_firstRender && (<InitialLoad />)}
      <div className={AppInnerStyling} style={{backgroundColor}}>
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