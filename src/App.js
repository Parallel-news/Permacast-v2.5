import React, { useEffect, useState, useRef, useContext } from 'react';
import Shikwasa from './shikwasa-src/main.js';
import { useTranslation } from 'react-i18next';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Sidenav, NavBar } from './component/navbars.jsx';
import Background from './component/background.jsx';
import SearchView from "./component/search.jsx";
import ArConnect from './component/arconnect.jsx';
import UploadPodcastView from './pages/uploadPodcast.jsx';
import EpisodeQueue from './component/episode_queue.jsx';
import Podcast from './pages/podcast.jsx';
import Episode from './pages/episode.jsx';
import { Player, PlayerMobile } from './component/player.jsx';
import Home from './pages/home.jsx';
import { fetchPodcastTitles, convertToEpisode, convertToPodcast, convertSearchItem, sortPodcasts } from './utils/podcast.js';
import { appContext } from './utils/initStateGen.js';
import { MOCK_CREATORS } from './utils/ui.js';
import { MESON_ENDPOINT } from './utils/arweave.js';


export default function App() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [appLoaded, setAppLoaded] = useState(false);
  const [selection, setSelection] = useState(0);

  const playerRef = useRef();
  const videoRef = useRef();
  const playButtonRef = useRef();

  const [currentEpisode, setCurrentEpisode] = useState(null);

  const [themeColor, setThemeColor] = useState('rgb(255, 255, 0)');
  const [currentPodcastColor, setCurrentPodcastColor] = useState('rgb(255, 255, 0)');
  const [backdropColor, setBackdropColor] = useState();

  const [address, setAddress] = useState();
  const [ANSData, setANSData] = useState({address_color: "", currentLabel: "", avatar: ""});
  const [walletConnected, setWalletConnected] = useState(false);

  // const [podcasts, setPodcasts] = useState();
  // const [sortedPodcasts, setSortedPodcasts] = useState();
  const [queue, setQueue] = useState([]);
  const [queueVisible, setQueueVisible] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [featuredPodcasts, setFeaturedPodcasts] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [titles, setTitles] = useState([]);

  const filters = [
    {type: "episodescount", desc: t("sorting.episodescount")},
    {type: "podcastsactivity", desc: t("sorting.podcastsactivity")}
  ];
  const filterTypes = filters.map(f => f.type)

  // const changeSorting = (n) => {
  //   setPodcasts(podcasts[filterTypes[n]])
  //   setSelection(n)
  // }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const sorted = await sortPodcasts(filterTypes)
      const podcasts = sorted[filterTypes[selection]].splice(0, 6)
      const convertedPodcasts = await Promise.all(podcasts.map(p => convertToPodcast(p)))
      const convertedEpisodes = await Promise.all(podcasts.splice(0, 3).map(p => convertToEpisode(p, p.episodes[0])))
      const searchTitles = await Promise.all((await fetchPodcastTitles()).map(p => convertSearchItem(p)))
      setTitles(searchTitles)
      setCurrentEpisode(convertedEpisodes[0])
      setRecentlyAdded(convertedEpisodes)
      setFeaturedPodcasts(convertedPodcasts)
      // setSortedPodcasts(sorted)
      // setPodcasts(sorted[filterTypes[selection]])
      setLoading(false)
    }
    if (!appLoaded) {
      fetchData()
      setAppLoaded(true)
    }
  }, [])


  const playEpisode = (episode) => {
    const player = new Shikwasa({
      container: () => document.querySelector('.podcast-player'),
      themeColor: 'yellow',
      theme: 'dark',
      autoplay: true,
      audio: {
        title: episode?.title || 'titel',
        artist: episode?.creatorName || 'creator',
        cover: episode.cover,
        src: `${MESON_ENDPOINT}/${episode?.contentTx}`,
      },
    })
    player.play()
    window.scrollTo(0, document.body.scrollHeight)

    // setCurrentEpisode(episode);
  };

  window.addEventListener('keydown', function(e) {
    if(e.key == " " && e.target == document.body) {
      e.preventDefault();
    }
  });

  const appState = {
    t: t,
    loading: loading,
    appLoaded: appLoaded,
    setAppLoaded: setAppLoaded,
    globalModal: {
      isOpen: modalIsOpen,
      setIsOpen: setModalIsOpen,
    },
    theme: {
      themeColor: themeColor,
      backdropColor: backdropColor,
      currentPodcastColor: currentPodcastColor,
      setCurrentPodcastColor: setCurrentPodcastColor,
    },
    search: {
      input: searchInput,
      setInput: setSearchInput,
      titles: titles,
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
      get: () => queue,
      set: setQueue,
      enqueueEpisode: (episode) => setQueue([episode]),
      enqueuePodcast: (episodes) => setQueue(episodes),
      play: (episode) => playEpisode(episode),
      playEpisode: (episode) => {setQueue([episode]); playEpisode(episode)},
      visibility: queueVisible,
      toggleVisibility: () => setQueueVisible(!queueVisible),
    },
    queueHistory: {
      // This can be used for playback history tracking
    },
    playback: {
      player: playerRef.current,
      playerRef: playerRef,
      videoRef: videoRef,
      playButtonRef: playButtonRef,
      currentEpisode: currentEpisode,
    },
  }

  // TODO
  // add a loading skeleton for the app
  // clean up useEffect and appState code
  // add translations
  // improve AR rounding
  // finish tab switching gradient color animation
  // make buttons and stuff consistent accross app
  // mobile view
  // re-write fetch logic to await ALL urls asynchronously (put callbacks into array and promise.all)
  // use fuse.js for search (?)
  // re-write getAverageColor functions to use in-memory images (?)

  return (
    <div className="select-none h-full bg-black overflow-hidden " data-theme="permacast">
      <appContext.Provider value={appState}>
        <Router>
          <div className="flex h-screen">
            <div className="absolute z-20 bottom-0 w-full">
              <div className="relative podcast-player">
                {/* {!loading && currentEpisode ? <Player episode={currentEpisode} />: <div>Loading...</div>} */}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-[100px] flex justify-center">
                <Sidenav />
              </div>
              <div className="absolute z-10 bottom-0 right-0" style={{display: queueVisible ? 'block': 'none'}}>
                {!loading ? <EpisodeQueue />: <div className="h-full w-full animate-pulse bg-gray-900/30"></div>}
              </div>
            </div>
            <Background className="w-screen overflow-scroll">
              <div className="ml-8 pr-8 pt-9">
                <div className="mb-10">
                  <NavBar />
                </div>
                <div className="w-full overflow-hidden">
                  <Route
                    exact
                    path="/"
                    component={({match}) => <div><Home recentlyAdded={recentlyAdded} featuredPodcasts={featuredPodcasts} creators={MOCK_CREATORS} /></div>}
                  />
                  <Route
                    exact
                    path="/uploadpodcast"
                    component={({match}) => <div><UploadPodcastView /></div>}
                  />
                  {/* <Route
                    exact
                    path="/following"
                    component={({match}) => <div className="text-3xl">Coming soon!</div>}
                  /> */}
                  <Route
                    exact
                    path="/search"
                    component={({match}) => <div><SearchView /></div>}
                  />
                  <Route
                    exact
                    path="/podcast/:podcastId"
                    render={({ match }) => <Podcast match={match} />}
                  />
                  <Route
                    exact
                    path="/podcast/:podcastId/:episodeNumber"
                    render={({ match }) => <Episode match={match} />}
                  />
                </div>
              </div>
            </Background>
          </div>
        </Router>
      </appContext.Provider>
    </div>
  );
}
