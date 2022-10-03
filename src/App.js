import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import Shikwasa from './shikwasa-src/main.js';
import { useTranslation } from 'react-i18next';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Sidenav, NavBar } from './component/navbars.jsx';
import Background from './component/background.jsx';
import Search from "./pages/search.jsx";
import ArConnect from './component/arconnect.jsx';
import UploadPodcastView from './pages/uploadPodcast.jsx';
import EpisodeQueue from './component/episode_queue.jsx';
import Podcast from './pages/podcast.jsx';
import Episode from './pages/episode.jsx';
import Creator from './pages/creator.jsx';
import { Player, PlayerMobile } from './component/player.jsx';
import Home from './pages/home.jsx';
import { fetchPodcastTitles, convertToEpisode, convertToPodcast, convertSearchItem, sortPodcasts, getPodcasts, getCreator } from './utils/podcast.js';
import { appContext } from './utils/initStateGen.js';
import { MESON_ENDPOINT } from './utils/arweave.js';


export default function App() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [appLoaded, setAppLoaded] = useState(false);
  const [selection, setSelection] = useState(0);

  const videoRef = useRef();
  const [player, setPlayer] = useState();
  const [isPaused, setIsPaused] = useState();
  const [currentEpisode, setCurrentEpisode] = useState({contentTx: 'null', pid: 'null', eid: 'null'});

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

  // for the queue button
  useEffect(() => {
    if (!player) return;
    const queue = player.ui.queueBtn;
    const paused = player.ui.playBtn;
    queue.addEventListener('click', () => setQueueVisible(visible => !visible));
    paused.addEventListener('click', () => setIsPaused(paused => !paused));
  }, [player]);

  const [creatorsLoading, setCreatorsLoading] = useState(true)
  const [creators, setCreators] = useState([]);

  const veryGoodWhitelistOfVeryGoodPeople = [
    "kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI",
    "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0",
    "lIg5mdDMAAIj5Pn2BSYKI8SEo8hRIdh-Zrn_LSy_3Qg"
  ]

  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [featuredPodcasts, setFeaturedPodcasts] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [titlesLoading, setTitlesLoading] = useState(true);
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
    if (!localStorage.getItem("checkupDate")) localStorage.setItem("checkupDate", new Date()); 
    playEpisode(null);
    const fetchData = async () => {
      setLoading(true)
      let sorted = [];
      // if (Date.parse(localStorage.getItem("checkupDate")) <= new Date()) {
        // console.log('fetching new data')
        // const unsortedPodcasts = await Promise.all((await getPodcasts()).map(p => convertToPodcast(p)))
        const sortedPodcasts = await sortPodcasts(filterTypes)
        sorted = sortedPodcasts[filterTypes[selection]]
        // setAllPodcasts(sortedPodcasts)
        const oldDateObj = new Date();
        const newDateObj = new Date();
        newDateObj.setTime(oldDateObj.getTime() + (10 * 60 * 1000));

        localStorage.setItem("sortedPodcasts", JSON.stringify(sorted))
        localStorage.setItem("checkupDate", newDateObj) 
      // } else {
      //   sorted = JSON.parse(localStorage.getItem("sortedPodcasts"))
      //   console.log("using cached data")
      // }
      const podcasts = sorted.splice(0, 9)
      // const recentPodcasts = sorted.splice(0, 9)
      const convertedPodcasts = await Promise.all(podcasts.map(p => convertToPodcast(p)))
      const convertedEpisodes = await Promise.all(podcasts.splice(0, 3).map(p => convertToEpisode(p, p.episodes[0])))
      // setCurrentEpisode(convertedEpisodes[0])
      setRecentlyAdded(convertedEpisodes)
      setFeaturedPodcasts(convertedPodcasts)
      // setSortedPodcasts(sorted)
      // setPodcasts(sorted[filterTypes[selection]])
      setLoading(false)
      setTitlesLoading(true)
      if (localStorage.getItem("titles")) {
        setTitles(JSON.parse(localStorage.getItem("titles")))
      } else {
        Promise.all((await fetchPodcastTitles()).map(p => convertSearchItem(p))).then(titles => {
          setTitles(titles)
          console.log('yeah')
          localStorage.setItem("titles", JSON.stringify(titles))
        })
      }
      setTitlesLoading(false);
      setCreatorsLoading(true);
      setCreators(await Promise.all(veryGoodWhitelistOfVeryGoodPeople.map(creatorAddress => getCreator(creatorAddress))))
      setCreatorsLoading(false);
    }
    if (!appLoaded) {
      fetchData()
      setAppLoaded(true)
    }
  }, [])

  window.addEventListener('keydown', function(e) {
    if(e.key == " " && e.target == document.body) {
      e.preventDefault();
    }
  });

  const appState = {
    t: t,
    creators: creators,
    loading: loading,
    otherComponentsLoading: {
      titles: titlesLoading,
      creators: creatorsLoading
    },
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
      currentEpisode: currentEpisode,
      get: () => queue,
      enqueueEpisode: (episode) => setQueue([episode]),
      enqueuePodcast: (episodes) => setQueue(episodes),
      play: (episode) => playEpisode(episode),
      playEpisode: (episode) => {
        setQueue([episode])
        playEpisode(episode)
      },
      visibility: queueVisible,
    },
    queueHistory: {
      // This can be used for playback history tracking
    },
    player: player,
    playback: {
      isPaused: isPaused,
      setIsPaused: setIsPaused,
    },
    videoRef: videoRef,
  }

  const playEpisode = (episode) => {
    localStorage.setItem("queue", "false")
    const player = new Shikwasa({
      container: () => document.querySelector('.podcast-player'),
      themeColor: 'yellow',
      theme: 'dark',
      autoplay: true,
      audio: {
        title: episode?.title || 'No track selected',
        artist: episode?.creatorName || '',
        cover: episode?.cover || 'https://arweave.net/LFG804jivA0mLagJdvbYEYx9VB_3Nivtz_dw4gN1PgY', // TODO: add a default cover
        color: episode?.color || 'text-[rgb(255,255,0)] bg-[rgb(255,255,0)]/20',
        src: `${MESON_ENDPOINT}/${episode?.contentTx}`,
      },
    })
    if (episode) {
      setPlayer(player)
      setCurrentEpisode(episode) // add it to local storage for later
      player.play()
      window.scrollTo(0, document.body.scrollHeight)  
    }
  };

  // useEffect(() => {
  //   if (player) player.play()
  // }, [player])

  // TODO
  // add a loading skeleton for the app // DONE
  // save ALL fetched data to local storage, update it every 5 minutes // Needs rework
  // add translations // DONE
  // add creator page // DONE
  // finish tab switching gradient color animation
  // make buttons consistent accross app
  // improve AR rounding
  /* mobile view
    - episode list
    - podcast list
    - podcast page
    - episode page
    - search
    - queue (maybe)
  */
  // re-write fetch logic to not block the rest of the app // Mostly done
  // use fuse.js for better search (?)
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
                    component={({match}) => <Home recentlyAdded={recentlyAdded} featuredPodcasts={featuredPodcasts} />}
                  />
                  <Route
                    exact
                    path="/uploadpodcast"
                    component={({match}) => <UploadPodcastView />}
                  />
                  {/* <Route
                    exact
                    path="/following"
                    component={({match}) => <div className="text-3xl">Coming soon!</div>}
                  /> */}
                  <Route
                    exact
                    path="/search"
                    component={({match}) => <Search />}
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
                  <Route
                    exact
                    path="/creator/:creatorAddress"
                    render={({ match }) => <Creator match={match} />}
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
