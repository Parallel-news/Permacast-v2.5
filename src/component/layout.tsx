import React, { FC, ReactNode, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import Shikwasa from '../shikwasa-src/main.js';
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
  const { t } = useTranslation('common')

  const [loading, ] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);

  const videoRef = useRef();
  const [_isFullscreen, _setIsFullscreen] = useRecoilState(isFullscreen);
  const [_isPlaying, _setIsPlaying] = useRecoilState(isPlaying);
  const [_currentEpisode, _setCurrentEpisode] = useRecoilState(currentEpisode);
  const [_queue, _setQueue] = useRecoilState(queue);
  const [_isQueueVisible, _setQueueVisible] = useRecoilState(isQueueVisible);

  const [currentThemeColor_, setCurrentThemeColor_] = useRecoilState(currentThemeColor);
  const [currentPodcastColor, setCurrentPodcastColor] = useState(THEME_COLOR);
  const [backdropColor, ] = useState();
  const [address, setAddress] = useState();
  const [ANS, setANS] = useState({ address_color: "", currentLabel: "", avatar: "" });
  const [walletConnected, setWalletConnected] = useState(false);

  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Episode  Loader + spacebar for play/pause
  useEffect(() => {
    // TODO: reimplement later
    // window.addEventListener('keydown', function (e) {
    //   if (e.key == " " && e.target == document.body) {
    //     e.preventDefault();
    //   }
    // });
  
    // TODO: generalize
    // if (!localStorage.getItem("checkupDate")) localStorage.setItem("checkupDate", new Date());
    playEpisode(null);
    if (!appLoaded) {
      setAppLoaded(true);
    }
    console.log("Use Effect Episode Loader");
  }, [appLoaded]);

  useEffect(() => {
    setCurrentThemeColor_(THEME_COLOR);
  }, [])

  const playEpisode = (episode, number = 1) => {
    const shikwasaPlayer = new Shikwasa({
      container: () => document.querySelector('.podcast-player'),
      themeColor: 'yellow',
      theme: 'dark',
      autoplay: true,
      audio: {
        title: episode?.episodeName || 'No episode selected',
        artist: '',
        cover: "https://arweave.net/Rtjwzke-8cCLd0DOKGKCx5zNjmoVr51yy_Se1s73YH4",
        color: '',
        src: `https://arweave.net/${episode?.contentTx}`,
      },
    })

    if (episode) {
      // setPlayer(shikwasaPlayer)
      _setCurrentEpisode({ ...episode, number: number }) // add it to local storage for later
      shikwasaPlayer.play()
      // window.scrollTo(0, document.body.scrollHeight)
    }
  };

  return (
    <div className="select-none h-full bg-black overflow-hidden " data-theme="permacast">
      <div className="flex h-screen">
        <div className="fixed z-[60] bottom-0 w-full">
          <div className={`relative podcast-player rounded-t-xl backdrop-blur-sm ${_isFullscreen ? "bg-zinc-900/60" : "bg-zinc-900"}`}>
            {/* {!loading && currentEpisode ? <Player episode={currentEpisode} />: <div>Loading...</div>} */}
          </div>
        </div>
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