import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import Shikwasa from '../shikwasa-src/main.js';
import { useTranslation } from 'next-i18next';

import { Sidenav, NavBar } from './navbars';
import Background from './background.jsx';

import EpisodeQueue from './episode_queue.jsx';
import Fullscreen from './fullscreen.jsx';
import VideoModal from './video_modal.jsx';

import { appContext } from '../utils/initStateGen.js';
// import { getAllData } from "../src/services/services";
import { isFullscreen, primaryData, queue, currentEpisode, isPaused, queueVisible } from '../atoms/index.js';

export default function Layout(props) {
  const { t } = useTranslation('common')

  const [loading, ] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);

  const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
  const videoRef = useRef();
  const [isFullscreen_, setIsFullscreen_] = useRecoilState(isFullscreen);
  const [_isPaused, _setIsPaused] = useRecoilState(isPaused);
  const [_currentEpisode, _setCurrentEpisode] = useRecoilState(currentEpisode);
  const [_queue, _setQueue] = useRecoilState(queue);
  const [_queueVisible, _setQueueVisible] = useRecoilState(queueVisible);

  const [themeColor, ] = useState('rgb(255, 255, 0)');
  const [currentPodcastColor, setCurrentPodcastColor] = useState('rgb(255, 255, 0)');
  const [backdropColor, ] = useState();
  const [address, setAddress] = useState();
  const [ANSData, setANSData] = useState({ address_color: "", currentLabel: "", avatar: "" });
  const [walletConnected, setWalletConnected] = useState(false);
  const [player, setPlayer] = useState();

  // for the queue button
  useEffect(() => {
    console.log("Use effect player");
    try {
      // getAllData({signal: abortContr.signal}).then((data) => setPrimaryData_(data));
    } catch(e) {
      console.log("Error fetching read data from App.js");
      console.log(e);
    }
      
    if (!player) return;
    const queue = player.ui.queueBtn;
    const paused = player.ui.playBtn;
    const fullscreen = player.ui.fullscreenBtn;

    queue.addEventListener('click', () => _setQueueVisible(visible => !visible));
    paused.addEventListener('click', () => _setIsPaused(paused => !paused));
    fullscreen.addEventListener('click', () => setIsFullscreen_(isFullscreen_ => !isFullscreen_));
  }, []);

  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Episode  Loader + spacebar for play/pause
  useEffect(() => {
    window.addEventListener('keydown', function (e) {
      if (e.key == " " && e.target == document.body) {
        e.preventDefault();
      }
    });
  
    // TODO: generalize
    if (!localStorage.getItem("checkupDate")) localStorage.setItem("checkupDate", new Date());
    playEpisode(null);
    if (!appLoaded) {
      setAppLoaded(true);
    }
    console.log("Use Effect Episode Loader");
  }, [appLoaded]);


  const appState = {
    t: t,
    loading: loading,
    theme: {
      themeColor: themeColor,
      backdropColor: backdropColor,
      currentPodcastColor: currentPodcastColor,
      setCurrentPodcastColor: setCurrentPodcastColor,
    },
    user: {
      address: address,
      setAddress: setAddress,
      ANSData: ANSData,
      setANSData: setANSData,
      walletConnected: walletConnected,
      setWalletConnected: setWalletConnected,
    },
    queue: {
      currentEpisode: _currentEpisode, // move this down to playback
      get: () => _queue,
      enqueueEpisode: (episode) => _setQueue([episode]),
      enqueuePodcast: (episodes) => _setQueue(episodes),
      play: (episode) => playEpisode(episode),
      playEpisode: (episode, number) => {
        _setQueue([episode])
        playEpisode(episode, number)
      },
    },
    queueHistory: {
      // This can be used for playback history tracking
    },
    player: player,
    playback: {
      isPaused: _isPaused,
      setIsPaused: _setIsPaused,
    },
    videoRef: videoRef,
  }

  const playEpisode = (episode, number = 1) => {
    console.log("PLAYEPISODE BEING CALLED");
    const shikwasaPlayer = new Shikwasa({
      container: () => document.querySelector('.podcast-player'),
      themeColor: 'yellow',
      theme: 'dark',
      autoplay: true,
      audio: {
        title: episode?.episodeName || 'Permacast not selected',
        artist: primaryData_.podcasts === undefined ?
          'Standby..' : primaryData_.podcasts.filter((obj_) => {
            return obj_.episodes.filter((obj__) => {
              return obj__.eid === episode.eid
            })
          })[0].author,
        cover: primaryData_.podcasts === undefined ?
        'https://ih1.redbubble.net/image.2647292310.1736/st,small,845x845-pad,1000x1000,f8f8f8.jpg' : 'https://arweave.net/'+primaryData_.podcasts.filter((obj_) => {
            return obj_.episodes.filter((obj__) => {
              return obj__.eid === episode.eid
            })
          })[0].cover,
        color: episode?.color || 'text-[rgb(255,255,0)] bg-[rgb(255,255,0)]/20',
        src: `https://arweave.net/${episode?.contentTx}`,
      },
    })

    if (episode) {
      setPlayer(shikwasaPlayer)
      _setCurrentEpisode({ ...episode, number: number }) // add it to local storage for later
      shikwasaPlayer.play()
      // window.scrollTo(0, document.body.scrollHeight)
    }
  };

  return (
    <appContext.Provider value={appState}>
      <div className="select-none h-full bg-black overflow-hidden " data-theme="permacast">
        <div className="flex h-screen">
          <div className="fixed z-[60] bottom-0 w-full">
            <div className={`relative podcast-player rounded-t-xl backdrop-blur-sm ${isFullscreen_ ? "bg-zinc-900/60" : "bg-zinc-900"}`}>
              {/* {!loading && currentEpisode ? <Player episode={currentEpisode} />: <div>Loading...</div>} */}
            </div>
          </div>
          <div className="hidden md:block z-50">
            <div className="w-[100px] z-50 flex justify-center">
              <Sidenav />
            </div>
          </div>

          <div className="z-50">
            <div className="absolute z-50 bottom-0 right-0" style={{ display: _queueVisible ? 'block' : 'none' }}>
              {!loading ? <EpisodeQueue /> : <div className="h-full w-full animate-pulse bg-gray-900/30"></div>}
            </div>
          </div>
          {isFullscreen_ && <Fullscreen episode={_currentEpisode} number={_currentEpisode?.number || 1} />}
          <Background className="w-screen overflow-scroll">
            <div className="ml-8 pr-8 pt-9">
              <div className="mb-10">
                <NavBar />
              </div>
              <div className="w-full overflow-hidden">
                {props.children}
              </div>
            </div>
          </Background>
          <VideoModal/>
        </div>

      </div>
    </appContext.Provider >
  )
}