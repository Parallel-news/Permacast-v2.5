import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ArrowDownTrayIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

import { MESON_ENDPOINT } from "../utils/arweave";
import { getButtonRGBs, isTooLight } from "../utils/ui"
import { getPodcasts, getPodcastEpisodes, convertToEpisode } from '../utils/podcast';
import { appContext } from '../utils/initStateGen.js';

import TipButton from '../component/reusables/tip';
import PlayButton from '../component/reusables/playButton';
import Track from '../component/track';

export default function Show (props) {
  const { podcastId, episodeNumber } = props.match.params;
  const { t } = useTranslation()
  const history = useHistory();
  const location = useLocation();

  const appState = useContext(appContext);
  
  const { currentPodcastColor, setCurrentPodcastColor } = appState.theme;
  const { playEpisode, currentEpisode } = appState.queue;
  const [copied, setCopied] = useState(false);
  const [episode, setEpisode] = useState();
  const [nextEpisode, setNextEpisode] = useState();
  const [loading, setLoading] = useState(true);
  const [rgb, setRgb] = useState({});

  // useEffect(() => {
  //   setLoading(true);
  //   async function fetchData() {
  //     setEpisode(null);
  //     setNextEpisode(null);
  //     setRgb(null);
  //     const podcasts = await getPodcasts();
  //     const foundPodcast = podcasts?.find(p => p.pid === podcastId);
  //     if (!foundPodcast) return;
  //     const episodes = foundPodcast?.episodes //await getPodcastEpisodes(podcastId);
  //     const foundEpisode = episodes?.find((episode, index) => index == episodeNumber - 1);
  //     if (!foundEpisode) return;
  //     const foundNextEpisode = episodes?.find((episode, index) => index == episodeNumber);
  //     const convertedEpisode = foundEpisode && await convertToEpisode(foundPodcast, foundEpisode)
  //     const convertedNextEpisode = foundNextEpisode && await convertToEpisode(foundPodcast, foundNextEpisode)
  //     setEpisode(convertedEpisode);
  //     setNextEpisode(convertedNextEpisode);
  //     setRgb(getButtonRGBs(convertedEpisode?.rgb));
  //     setCurrentPodcastColor(convertedEpisode?.rgb)
  //   }
  //   fetchData()
  //   setLoading(false);
  // }, [episodeNumber])
  
  return (
    <div>
      Lwazi
    </div>
  )
}