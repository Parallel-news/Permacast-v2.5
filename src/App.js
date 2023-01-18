// import React, { useEffect, useState, useRef } from 'react';
// import { AnsProvider } from 'ans-for-all';
// import {
//   getDefaultWallets,
//   RainbowKitProvider,
//   darkTheme
// } from '@rainbow-me/rainbowkit';
// import { configureChains, createClient, WagmiConfig } from 'wagmi';
// import { mainnet, goerli } from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';
// import Shikwasa from './shikwasa-src/main.js';
// import { useTranslation } from 'react-i18next';
// import { Sidenav, NavBar } from './component/navbars.jsx';
// import Background from './component/background.jsx';
// import Search from "./pages/search.jsx";
// import ArConnect from './component/arconnect.jsx';
// import EpisodeQueue from './component/episode_queue.jsx';
// import Fullscreen from './component/fullscreen.jsx';
// import UploadPodcastView from './pages/uploadPodcast.jsx';
// import Podcast from './pages/podcast.jsx';
// import Episode from './pages/episode.jsx';
// import Show from './pages/show.jsx';
// import Creator from './pages/creator.jsx';
// import Home from './pages/index.js';
// import { appContext } from './utils/initStateGen.js';
// import { useRecoilState } from 'recoil';
// import VideoModal from './component/video_modal.jsx';
// import { isFullscreen, primaryData, queue, currentEpisode, isPaused, queueVisible } from './atoms/index.js';
// import { getAllData } from "../src/services/services";
// import '@rainbow-me/rainbowkit/styles.css';

// export default function App() {
//   const { t } = useTranslation();
  
//   const { chains, provider } = configureChains([mainnet], [publicProvider()]);
//   const { connectors } = getDefaultWallets({appName: 'Permacast', chains});
//   const wagmiClient = createClient({
//     autoConnect: true,
//     connectors,
//     provider
//   })

//   const [loading, ] = useState(false);
//   const [appLoaded, setAppLoaded] = useState(false);

//   const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
//   const videoRef = useRef();
//   const [isFullscreen_, setIsFullscreen_] = useRecoilState(isFullscreen);
//   const [_isPaused, _setIsPaused] = useRecoilState(isPaused);
//   const [_currentEpisode, _setCurrentEpisode] = useRecoilState(currentEpisode);
//   const [_queue, _setQueue] = useRecoilState(queue);
//   const [_queueVisible, _setQueueVisible] = useRecoilState(queueVisible);

//   const [themeColor, ] = useState('rgb(255, 255, 0)');
//   const [currentPodcastColor, setCurrentPodcastColor] = useState('rgb(255, 255, 0)');
//   const [backdropColor, ] = useState();
//   const [address, setAddress] = useState();
//   const [ANSData, setANSData] = useState({ address_color: "", currentLabel: "", avatar: "" });
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [player, setPlayer] = useState();

//   // for the queue button
//   useEffect(() => {
//     console.log("Use effect player");
//     const abortContr = new AbortController();
//     try {
//       getAllData({signal: abortContr.signal}).then((data) => setPrimaryData_(data));
//     } catch(e) {
//       console.log("Error fetching read data from App.js");
//       console.log(e);
//     }
      
//     if (!player) return;
//     const queue = player.ui.queueBtn;
//     const paused = player.ui.playBtn;
//     const fullscreen = player.ui.fullscreenBtn;

//     queue.addEventListener('click', () => _setQueueVisible(visible => !visible));
//     paused.addEventListener('click', () => _setIsPaused(paused => !paused));
//     fullscreen.addEventListener('click', () => setIsFullscreen_(isFullscreen_ => !isFullscreen_));
//     return () => {
//       abortContr.abort()
//     }
//   }, []);

//   const [recentlyAdded, setRecentlyAdded] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   // Episode  Loader + spacebar for play/pause
//   useEffect(() => {
//     window.addEventListener('keydown', function (e) {
//       if (e.key == " " && e.target == document.body) {
//         e.preventDefault();
//       }
//     });
  
//     // TODO: generalize
//     if (!localStorage.getItem("checkupDate")) localStorage.setItem("checkupDate", new Date());
//     playEpisode(null);
//     if (!appLoaded) {
//       setAppLoaded(true);
//     }
//     console.log("Use Effect Episode Loader");
//   }, [appLoaded]);


//   const appState = {
//     t: t,
//     loading: loading,
//     appLoaded: appLoaded,
//     setAppLoaded: setAppLoaded,
//     globalModal: {
//       isOpen: modalIsOpen,
//       setIsOpen: setModalIsOpen,
//     },
//     theme: {
//       themeColor: themeColor,
//       backdropColor: backdropColor,
//       currentPodcastColor: currentPodcastColor,
//       setCurrentPodcastColor: setCurrentPodcastColor,
//     },
//     user: {
//       address: address,
//       setAddress: setAddress,
//       ANSData: ANSData,
//       setANSData: setANSData,
//       walletConnected: walletConnected,
//       setWalletConnected: setWalletConnected,
//     },
//     queue: {
//       currentEpisode: _currentEpisode, // move this down to playback
//       get: () => _queue,
//       enqueueEpisode: (episode) => _setQueue([episode]),
//       enqueuePodcast: (episodes) => _setQueue(episodes),
//       play: (episode) => playEpisode(episode),
//       playEpisode: (episode, number) => {
//         _setQueue([episode])
//         playEpisode(episode, number)
//       },
//       visibility: _queueVisible,
//     },
//     queueHistory: {
//       // This can be used for playback history tracking
//     },
//     player: player,
//     playback: {
//       isPaused: _isPaused,
//       setIsPaused: _setIsPaused,
//     },
//     videoRef: videoRef,
//   }

//   const playEpisode = (episode, number = 1) => {
//     console.log("PLAYEPISODE BEING CALLED");
//     const shikwasaPlayer = new Shikwasa({
//       container: () => document.querySelector('.podcast-player'),
//       themeColor: 'yellow',
//       theme: 'dark',
//       autoplay: true,
//       audio: {
//         title: episode?.episodeName || 'Permacast not selected',
//         artist: primaryData_.podcasts === undefined ?
//           'Standby..' : primaryData_.podcasts.filter((obj_) => {
//             return obj_.episodes.filter((obj__) => {
//               return obj__.eid === episode.eid
//             })
//           })[0].author,
//         cover: primaryData_.podcasts === undefined ?
//         'https://ih1.redbubble.net/image.2647292310.1736/st,small,845x845-pad,1000x1000,f8f8f8.jpg' : 'https://arweave.net/'+primaryData_.podcasts.filter((obj_) => {
//             return obj_.episodes.filter((obj__) => {
//               return obj__.eid === episode.eid
//             })
//           })[0].cover,
//         color: episode?.color || 'text-[rgb(255,255,0)] bg-[rgb(255,255,0)]/20',
//         src: `${MESON_ENDPOINT}/${episode?.contentTx}`,
//       },
//     })

//     if (episode) {
//       setPlayer(shikwasaPlayer)
//       _setCurrentEpisode({ ...episode, number: number }) // add it to local storage for later
//       shikwasaPlayer.play()
//       window.scrollTo(0, document.body.scrollHeight)
//     }
//   };

//   // TODO
//   // cache images
//   // finish tab switching gradient color animation
//   // improve AR rounding
//   /* mobile view
//     - episode list
//     - podcast list
//     - podcast page
//     - episode page
//     - search
//     - queue (maybe)
//   */
//   // re-write fetch logic to not block the rest of the app // Mostly done
//   // use fuse.js for better search (?)
//   // re-write getAverageColor functions to use in-memory images (?)

//   return (
//   <AnsProvider>
//   <WagmiConfig client={wagmiClient}>
//     <RainbowKitProvider chains={chains} theme={darkTheme({accentColor: "rgb(24,24,27)"})}>
//       <div className="select-none h-full bg-black overflow-hidden " data-theme="permacast">
//         <appContext.Provider value={appState}>
//           <Router>
//             <div className="flex h-screen">
//               <div className="fixed z-[60] bottom-0 w-full">
//                 <div className={`relative podcast-player rounded-t-xl backdrop-blur-sm ${isFullscreen_ ? "bg-zinc-900/60" : "bg-zinc-900"}`}>
//                   {/* {!loading && currentEpisode ? <Player episode={currentEpisode} />: <div>Loading...</div>} */}
//                 </div>
//               </div>
//               <div className="hidden md:block z-50">
//                 <div className="w-[100px] z-50 flex justify-center">
//                   <Sidenav />
//                 </div>
//               </div>

//               <div className="z-50">
//                 <div className="absolute z-50 bottom-0 right-0" style={{ display: _queueVisible ? 'block' : 'none' }}>
//                   {!loading ? <EpisodeQueue /> : <div className="h-full w-full animate-pulse bg-gray-900/30"></div>}
//                 </div>
//               </div>
//               {isFullscreen_ && <Fullscreen episode={_currentEpisode} number={_currentEpisode?.number || 1} />}
//               <Background className="w-screen overflow-scroll">
//                 <div className="ml-8 pr-8 pt-9">
//                   <div className="mb-10">
//                     <NavBar />
//                   </div>
//                   <div className="w-full overflow-hidden">
//                     <Route
//                       exact
//                       path="/"
//                       component={({ match }) => <Home recentlyAdded={recentlyAdded}/>}
//                     />
//                     <Route
//                       exact
//                       path="/uploadpodcast"
//                       component={({ match }) => <UploadPodcastView />}
//                     />
//                     {/* <Route
//                     exact
//                     path="/following"
//                     component={({match}) => <div className="text-3xl">Coming soon!</div>}
//                   /> */}
//                     <Route
//                       exact
//                       path="/search"
//                       component={({ match }) => <Search />}
//                     />
//                     <Route
//                       exact
//                       path="/podcast/:podcastId"
//                       render={({ match }) => <Podcast match={match} />}
//                     />
//                     <Route
//                       exact
//                       path="/podcast/:podcastId/:episodeNumber"
//                       render={({ match }) => <Episode match={match} />}
//                     />
//                     <Route
//                       exact
//                       path="/shows"
//                       render={({ match }) => <Show match={match} />}
//                     />
//                     <Route
//                       exact
//                       path="/creator/:creatorAddress"
//                       render={({ match }) => <Creator match={match} />}
//                     />
//                   </div>
//                 </div>
//               </Background>            
//               <VideoModal/>
//             </div>
//           </Router>
//         </appContext.Provider>
//       </div>
//     </RainbowKitProvider>
//   </WagmiConfig>
//   </AnsProvider>
//   );
// }
