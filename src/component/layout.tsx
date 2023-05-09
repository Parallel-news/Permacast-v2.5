import Fullscreen from './fullscreen';
import Background from './background';
import { useShikwasa } from '../hooks';
import { useRecoilState } from 'recoil';
import EpisodeQueue from './episodeQueue';
import { Toaster } from 'react-hot-toast';
import { Sidenav, NavBar } from './navigation';
import LoadingLogo from './reusables/LoadingLogo';
import { InitialLoad } from './reusables/InitialLoad';
import React, { FC, ReactNode, useEffect } from 'react';
import { DEFAULT_BACKGROUND_COLOR } from '../constants/ui';
import { FADE_WAIT, MINT_DURATION, TOAST_POSITION } from '../constants';
import { firstRender, isFullscreenAtom, isQueueVisibleAtom } from '../atoms/index';

interface LayoutInterface {
  children: ReactNode;
};

export const AppStyling = "select-none h-full overflow-hidden bg-black";
export const AppInnerStyling = "h-screen overflow-x-hidden relative";
export const BackgroundWrapperStyling = "w-screen overflow-y-scroll overflow-x-hidden z-[1]";
export const InnerLayoutStyling = "ml-0 md:ml-2 md:pr-8 pt-2 px-5 md:pt-8 z-[3]";
export const ParentStyling = "w-full overflow-hidden z-[3]";

const Layout: FC<LayoutInterface> = ({ children }) => {

  const [isFullscreen] = useRecoilState(isFullscreenAtom);
  const [isQueueVisible] = useRecoilState(isQueueVisibleAtom);
  const [_firstRender, _setFirstRender] = useRecoilState(firstRender)
  const backgroundColor = DEFAULT_BACKGROUND_COLOR;

  const shik = useShikwasa()
  const playerActivated = shik?.playerState?.player?.current

  // First Render?
  useEffect(() => {
    if(!_firstRender) {
      const timer = setTimeout(() =>{_setFirstRender(true);}, FADE_WAIT+1000);
      return () => clearTimeout(timer);
    }
  }, [])
  
  return (
    <div className={AppStyling} data-theme="permacast">
      {!_firstRender && (<InitialLoad />)}
      <div className={`${AppInnerStyling} ${!_firstRender ? " hidden" : " flex"}`} style={{backgroundColor}}>
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
          <LoadingLogo 
            playerActivated={playerActivated}
          /> 
      </div>
    </div>
  );
};

export default Layout;