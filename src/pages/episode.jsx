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

export default function Episode (props) {
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

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      setEpisode(null);
      setNextEpisode(null);
      setRgb(null);
      const podcasts = await getPodcasts();
      const foundPodcast = podcasts?.find(p => p.pid === podcastId);
      if (!foundPodcast) return;
      const episodes = foundPodcast?.episodes //await getPodcastEpisodes(podcastId);
      const foundEpisode = episodes?.find((episode, index) => index == episodeNumber - 1);
      if (!foundEpisode) return;
      const foundNextEpisode = episodes?.find((episode, index) => index == episodeNumber);
      const convertedEpisode = foundEpisode && await convertToEpisode(foundPodcast, foundEpisode)
      const convertedNextEpisode = foundNextEpisode && await convertToEpisode(foundPodcast, foundNextEpisode)
      setEpisode(convertedEpisode);
      setNextEpisode(convertedNextEpisode);
      setRgb(getButtonRGBs(convertedEpisode?.rgb));
      setCurrentPodcastColor(convertedEpisode?.rgb)
    }
    fetchData()
    setLoading(false);
  }, [episodeNumber])
  
  return (
    <div>
      {!loading && episode ? (
        <div>
          <div className="flex flex-col md:flex-row items-center">
            <img src={episode?.cover} className="w-40 h-40 cursor-pointer" onClick={() => history.push(`/podcast/${episode?.podcastId}`)} />
            <div className="mt-8 md:mt-0 md:ml-8 flex flex-col">
              <div className="text-center md:text-left text-3xl font-medium text-gray-200 select-text">
                {episode?.title}
              </div>
              <div className='flex flex-row justify-center md:justify-start items-center mt-2'>
                <div className="px-3 py-1 text-xs mr-2 rounded-full" style={{backgroundColor: rgb?.backgroundColor, rgb: rgb?.color}}>
                  {t("episode.number")} {episodeNumber}
                </div>
                <div className={"text-sm text-gray-200"}>
                  {new Date(episode?.createdAt ? episode.createdAt * 1000 : 1).toDateString() + ""}
                </div>
              </div>
              <div className="mt-5 flex flex-col md:flex-row items-center gap-x-4">
                <div className="flex flex-row items-center gap-x-2">
                  <div className="-ml-1.5 rounded-full pointer scale-[0.8]">
                    <PlayButton episode={episode} />
                  </div>
                  <TipButton />
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <a
                    href={`${MESON_ENDPOINT}/${episode.contentTx}`}
                    className="flex items-center rounded-full btn btn-sm normal-case text-sm font-medium border-0"
                    style={{backgroundColor: rgb?.backgroundColor, color: rgb?.color}}
                    download
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    {t("episode.download")}
                  </a>
                  <button
                    className="flex items-center rounded-full btn btn-sm normal-case text-sm font-medium border-0"
                    style={{backgroundColor: rgb?.backgroundColor, color: rgb?.color}}
                    onClick={() => {
                      setCopied(true);
                      setTimeout(() => {if (!copied) setCopied(false)}, 2000)
                      navigator.clipboard.writeText(window.location.href)
                    }}
                  >
                    <ArrowUpOnSquareIcon className="w-4 h-4 mr-2" />
                    {copied ? t('episode.copied') : t('episode.share')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-gray-400 mt-8 select-text">
            {episode?.description ? episode.description : t('episode.nodescription')}
          </div>
          {nextEpisode && (
            <div>
              <div className="text-3xl text-gray-300 my-8">{t("episode.nextepisode")}</div>

              <div className="p-2.5 border rounded-xl border-zinc-600">
                <Track episode={nextEpisode} episodeNumber={Number(episodeNumber) + 1} />
              </div>
            </div>  
          )}
        </div>
      ) : (
        <>
        {/* TODO FIGURE THIS OUT */}
        {loading ? (
          <div>{t("loading")}</div>
        ) : (
          <div>{t("loading")}</div>
        )}
        </>
      )}
    </div>
  )
}

// // // // // // Auxiliary Functions

// _ module 👇👇👇
const _ = () => {
  return {
    
  }
}