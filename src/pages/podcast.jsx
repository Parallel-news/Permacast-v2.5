import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Shikwasa from '../shikwasa-src/main.js';
import { useTranslation } from 'react-i18next';
import { FaRss, FaRegGem } from 'react-icons/fa';
import { PlusIcon, HeartIcon } from '@heroicons/react/24/solid';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import Track from '../component/track.jsx';
import TipButton from '../component/reusables/tip.jsx';
import UploadEpisode from './uploadEpisode.jsx';
import { arweave, smartweave, NEWS_CONTRACT, MESON_ENDPOINT } from '../utils/arweave.js';
// import * as SmartWeaveSdk from 'redstone-smartweave';
// import { contract } from 'redstone-smartweave';
// import { Dialog, Transition } from '@headlessui/react'
// import { Fragment } from 'react'
import { 
  convertToPodcast,
  convertToEpisode,
  getPodcasts,
  getPodcastEpisodes,
  getPodcast
} from '../utils/podcast.js';
import { Cooyub } from '../component/reusables/icons';

import { getButtonRGBs } from '../utils/ui.js';
import { appContext } from '../utils/initStateGen.js';
import { isDarkMode } from '../utils/theme.js';
import { API_MAP } from '../utils/arweave.js';

import { useRecoilState } from "recoil";
import { showPodcasts, videoSelection } from '../atoms';


export default function Podcast(props) {
  const { t } = useTranslation()
  const appState = useContext(appContext);
  const {address, setAddress} = appState.user;
  const {setIsOpen} = appState.globalModal;
  const [loading, setLoading] = useState(true);

  const [thePodcast, setThePodcast] = useState(null);
  const [podcastHtml, setPodcastHtml] = useState(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const {setCurrentPodcastColor, currentPodcastColor} = appState.theme;

  const loadRss = () => {
    window.open(API_MAP.rss + thePodcast.podcastId, '_blank')
  }  

  const loadEpisodes = async (podcast, episodes) => {
    console.log(podcast)
    const episodeList = []
    for (let i in episodes) {
      let e = episodes[i]
      // console.log("episode", e)
      if (e.eid !== 'FqPtfefS8QNGWdPcUcrEZ0SXk_IYiOA52-Fu6hXcesw') {
        episodeList.push(
          <div
            className="flex flex-col md:flex-row justify-between items-center shadow-lg rounded-xl border border-zinc-800 hover:border-white px-10 py-5 md:py-2 my-4 md:h-24 mx-3 md:mx-auto"
            key={e.eid}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-x-10 mr-5">
              <div className="flex space-x-10 mb-3 md:mb-0">
                <button onClick={() => showPlayer(podcast, e)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <a
                  href={`${MESON_ENDPOINT}/${e.contentTx}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
              <div className="font-bold w-full md:w-auto text-center">{e.episodeName}</div>
            </div>
            <div className='text-sm w-full md:w-auto text-center'>
              {truncatedDesc(e.description, 52)}
            </div>
          </div >
        )

      }
    }
    return episodeList
  }

  const checkEpisodeForm = async (podObj) => {
    if (address === podObj.creatorAddress || podObj.superAdmins.includes(address)) {
      setShowEpisodeForm(true)
      window.scrollTo(0, 0)
    } else {
      alert('Not the owner of this podcast')
    }
  }

  const truncatedDesc = (desc, maxLength) => {
    if (desc.length < maxLength) {
      return <>{desc}</>
    } else {
      return <>{desc.substring(0, maxLength)}... <span className="text-blue-500 hover:cursor-pointer" onClick={() => showDesc(desc)}>[read more]</span></>
    }
  }

  const showDesc = (desc) => {
    Swal.fire({
      text: desc,
      button: 'close',
      customClass: "font-mono",
    })
  }

  const showPlayer = (podcast, e) => {
    const player = new Shikwasa({
      container: () => document.querySelector('.podcast-player'),
      themeColor: 'gray',
      theme: `${isDarkMode() ? 'dark' : 'light'}`,
      autoplay: true,
      audio: {
        title: e.episodeName,
        artist: podcast.podcastName,
        cover: `${MESON_ENDPOINT}/${podcast?.cover}`,
        src: `${MESON_ENDPOINT}/${e.contentTx}`,
      },
      download: true
    })
    player.play()
    window.scrollTo(0, document.body.scrollHeight)
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const podcastId = props.match.params.podcastId
      const podcasts = await getPodcasts()
      const p = getPodcast(podcasts, podcastId)
      const ep = await getPodcastEpisodes(podcastId)
      const convertedPodcast = await convertToPodcast(p)
      const convertedEpisodes = await Promise.all(ep.map(e => convertToEpisode(convertedPodcast, e, false)))
      setThePodcast(convertedPodcast)
      setCurrentPodcastColor(convertedPodcast?.rgb)
      setPodcastEpisodes(convertedEpisodes)

      setLoading(false)
    }
    fetchData()
  }, [])

  const isOwner = (thePodcast?.creatorAddress === address || thePodcast?.superAdmins?.includes(address))
  const [showPods_, setShowPods_] = useRecoilState(showPodcasts);
  const [vs_, setVS_] = useRecoilState(videoSelection);
  return (
    <div className="flex flex-col items-center justify-center mb-20">
      {!loading && (
        <div className="pb-14 flex flex-col justify-center md:flex-row md:items-center w-full">
          <img className="w-40 cursor-pointer rounded-sm mx-auto md:mx-0 md:mr-8" src={thePodcast?.cover} alt={thePodcast.title} />
          <div className="col-span-2 my-3 text-zinc-100 w-full md:w-4/6 md:mr-2">
            <div className="text-center md:text-left text-xl font-semibold tracking-wide select-text line-clamp-1 hover:line-clamp-none">{thePodcast?.title}</div>
            <div className="line-clamp-5 hover:line-clamp-none select-text">{thePodcast?.description}</div>
          </div>
          <div className="mx-auto md:mx-0 md:ml-auto md:mr-9">
            <div className="flex items-center justify-between">
              <button className="btn btn-primary btn-sm normal-case rounded-full border-0" style={getButtonRGBs(currentPodcastColor)} onClick={() => loadRss()}>
                <FaRss className="mr-2 w-3 h-3" /><span className="font-normal">RSS</span>
              </button>
              {!isOwner && <div className="ml-4"><TipButton /></div>}
              {thePodcast && isOwner && (
                <button className="btn btn-outline btn-sm normal-case rounded-full border-0 flex cursor-pointer font-normal ml-4" style={getButtonRGBs(currentPodcastColor)} onClick={() => setIsOpen(true)}>
                  <PlusIcon className="mr-2 w-4 h-4" /> {t("podcast.newepisode")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <UploadEpisode podcast={thePodcast} />
      {loading && <h5 className="p-5">{t("loadingepisodes")}</h5>}

      <div className="w-full">
      {!loading && <div className={`w-full h-[25px] flex flex-row ml-[-4px] relative bottom-8`}>
        <div className={`h-full min-w-[30px] rounded-[4px] flex flex-row justify-center items-center mx-1 cursor-pointer ${showPods_ ? 'bg-white/80 hover:bg-white/80' : 'bg-white/50 hover:bg-white/80'} transition-all duration-200`} onClick={() => {
          setShowPods_(true)
        }}>
          <p className={`m-2 text-black/80 font-black`}>Podcasts</p>
        </div>

        <div className={`h-full min-w-[30px] rounded-[4px] flex flex-row justify-center items-center mx-1 cursor-pointer ${!showPods_ ? 'bg-white/80 hover:bg-white/80' : 'bg-white/50 hover:bg-white/80'} transition-all duration-200`} onClick={() => {
          setShowPods_(false)
        }}>
          <p className={`m-2 text-black/80 font-black`}>Videos</p>
        </div>
      </div>}
        {
        showPods_ ?
        podcastEpisodes && podcastEpisodes.map((e, i) => (
          <div key={i} className="mb-6 p-2.5 border rounded-xl border-zinc-600">
            <Track episode={e} includeDescription={true} episodeNumber={i+1} />
          </div>
        ))
        :
        <div className="mb-6 p-2.5 border rounded-xl border-zinc-600">
            <div className="flex items-center justify-between">
      <div className="flex items-center relative">
        <img className="h-14 w-14 rounded-lg cursor-pointer object-cover" src={'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg'} alt={'title'} onClick={() => {}} />
        <div className="ml-4 flex flex-col">
          <div className="cursor-pointer line-clamp-1 pr-2 text-sm" onClick={() => {}}>{'Sintel by Blender'}</div>
          <div className="flex items-center">
            {true && (
              <>
                <p className="text-zinc-400 text-[8px]">by</p>
                <div className="ml-1.5 p-1 bg-black/40 rounded-full cursor-pointer">
                  <div className="flex items-center min-w-max">
                    {/* <img className="h-6 w-6" src={cover} alt={title} /> */}
                    <Cooyub className="rounded-full" svgStyle="h-2 w-2" rectStyle="h-6 w-6" fill={"#007600"} />
                    <p className="text-[8px] pr-1 ml-1 " onClick={() => {}}>@LwaziNF</p>
                  </div>
                </div>
              </>
            )}
            
              <div className="mx-1.5 w-full line-clamp-1 text-xs">
              Sintel, code-named Project Durian during production, is a 2010 computer-animated fantasy short film. It was the third Blender "open movie". It was produced by Ton Roosendaal, chairman of the Blender Foundation, written by Esther Wouda, directed by Colin Levy, at the time an artist at Pixar and art direction by David Revoy, who is known for Pepper&Carrot an open source webcomic series.
              </div>
          </div>
        </div>
      </div>
      <div className="cursor-pointer rounded-[34px] p-3 bg-black/40" onClick={() => {
        setVS_(['w', {}])
      }}>
      <PlayIcon className="w-4 h-4 fill-current" />
    </div>
    </div>
          </div>
        }
        {!loading && podcastEpisodes.length === 0 && <h5 className="py-5">{t("noepisodes")}</h5>}
      </div>
      <div className="podcast-player sticky bottom-0 w-screen" />
    </div>
  )
}

// export function PodcastView({podcast}) {
//   const appState = useContext(appContext);
//   const {title, description} = podcast;

//   return (
//     <div className="h-full">
//       <div className="p-14 flex w-full border border-zinc-800 rounded-3xl">
//         <div className="col-span-2 my-3 text-zinc-100 max-w-xs md:max-w-lg mr-2">
//           <div className="font-medium cursor-pointer line-clamp-1"></div>
//           <div className="text-sm line-clamp-5"></div>
//         </div>
//       </div>
//       <div>
//         {podcast.episodes?.map((e, i) => (
//           <div className="mt-4">
//             <Track episode={e} key={i} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
