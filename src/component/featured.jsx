import React, { useState, useContext, useEffect } from 'react';
import { appContext } from '../utils/initStateGen.js';
import { useTranslation } from 'react-i18next';

import { useLocation, useHistory } from 'react-router-dom';
import { replaceDarkColorsRGB, isTooLight, trimANSLabel, RGBobjectToString } from '../utils/ui';
import { getCreator } from '../utils/podcast.js';
import { Cooyub, PlayButton, GlobalPlayButton } from './reusables/icons';
import { EyeIcon } from '@heroicons/react/24/outline';
import { FaPlay } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';

import Track from './track';
import { getButtonRGBs } from '../utils/ui';

import { useRecoilState } from "recoil";
import { videoSelection } from '../atoms';

export function Greeting() {
  const appState = useContext(appContext);
  const user = appState.user;
  const { t } = useTranslation();

  const label = user.ANSData?.currentLabel
  // what about randomizing greetings?

  return (
    <div>
      <h1 className="text-zinc-100 text-xl">
      {label ? (
        <>
          {t("home.hi")} {trimANSLabel(label)}!
        </>
      ) : <>{t("home.welcome")}</>}
      </h1>
      <p className="text-zinc-400 mb-9">{t("home.subtext")}</p>
    </div>
  )
}

export function FeaturedEpisode({episode, episodeId}) {
  const appState = useContext(appContext);
  const {cover, podcastName, description, pid} = episode;
  const { t } = useTranslation();

  let history = useHistory();
  let location = useLocation();
  const rgb = RGBobjectToString(replaceDarkColorsRGB(episode.rgb))
  const url = `/podcast/${pid}/${episode.eid}`;
  
  return (
    <div className="p-14 flex w-full border border-zinc-800 rounded-3xl">
      <img className="w-40 cursor-pointer mr-8" src={'https://arweave.net/'+cover} alt={podcastName} onClick={() => history.push(url)} />
      <div className="col-span-2 my-3 text-zinc-100 max-w-xs md:max-w-lg mr-2">
        <div onClick={() => {
          // history.push(url)
          console.log(episode.episodes)
        }} className="font-medium cursor-pointer line-clamp-1">{podcastName}</div>
        <div className="text-sm line-clamp-5">{description}</div>
      </div>
      <div className="ml-auto">
        <>
          <div 
            className="min-w-min btn btn-primary border-0 mt-5 rounded-full flex items-center cursor-pointer backdrop-blur-md"
            style={getButtonRGBs(rgb)}
            onClick={() => appState.queue.playEpisode(episode.episodes, episode.episodes.eid)}
          >
            <FaPlay className="w-3 h-3" />
            <div className="ml-2">{t("home.playfeaturedepisode")}</div>
          </div>
          <div
            className="min-w-min btn btn-primary border-0 mt-5 rounded-full flex items-center cursor-pointer backdrop-blur-md"
            style={getButtonRGBs(rgb)}
            onClick={() => history.push(url)}
          >
            <FiEye className="h-5 w-5" />
            <div className="ml-2">{t("home.viewfeaturedepisode")}</div>
          </div>
        </>
      </div>
    </div>
  )
}


export function FeaturedPodcast({podcast}) {
  const appState = useContext(appContext);
  const history = useHistory();
  const { rgb, episodesCount, cover, podcastName, title, description, firstTenEpisodes, podcastId } = podcast;
  const textColor = isTooLight(rgb) ? 'black' : 'white';
  const { enqueuePodcast, play } = appState.queue;
  const { t } = useTranslation();

  return (
    <>
      <div style={{backgroundColor: rgb, color: textColor}} className="mt-4 backdrop-blur-md rounded-3xl">
        <div className="h-1/6 w-full px-5 pb-2 cursor-pointer">
          <div onClick={() => history.push(`/podcast/${podcastId}`)}>
            <div className="pt-5 pb-3 text-xs">{episodesCount} {t("home.episodes")}</div>
            <div className="w-full mb-7 max-w-[180px] overflow-x-hidden mx-auto">
              <img className="object-cover aspect-square h-[180px]" src={cover} alt={podcastName} />
            </div>
          </div>
          <div className="h-16 flex items-center">
            <div className="z-10" onClick={() => {
              Promise.all(firstTenEpisodes(true)).then((episodes) => {
                enqueuePodcast(episodes)
                play(episodes[0]);
              });
            }}>
              <GlobalPlayButton size="20" innerColor={rgb} outerColor={textColor} />
            </div>
            <div className="ml-3" onClick={() => history.push(`/podcast/${podcastId}`)}>
              <div className="text-lg line-clamp-1 cursor-pointer">{title}</div>
              <div className="text-xs max-w-[95%] line-clamp-2">{description}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function FeaturedPodcasts({podcasts}) {
  return (
    <>
      {podcasts.map((podcast, index) => (
        <React.Fragment key={index}>
          <FeaturedPodcast podcast={podcast} />
        </React.Fragment>
      ))}
    </>
  )
}

export function FeaturedPodcastsMobile({podcasts}) {
  return (
    <div className="carousel">
      {podcasts.map((podcast, index) => (
        <div className="carousel-item max-w-[280px] md:max-w-xs pr-4" key={index}>
          <FeaturedPodcast podcast={podcast} />
        </div>
      ))}
    </div>
  )
}

export function FeaturedVideoShows({videoShows}) {
  const [vs_, setVS_] = useRecoilState(videoSelection);
  return (
    <div className="carousel">
      {/* {videoShows.map((vs_, index) => (
        <div className="carousel-item max-w-[280px] md:max-w-xs pr-4" key={index}>
          <FeaturedVS podcast={vs_} />
        </div>
      ))} */}

      <div className={`carousel-item min-w-[280px] md:min-w-xs pr-4`}>
        
      <>
      <div style={{backgroundColor: 'blue', color: 'white'}} className="mt-4 h-[325px] w-[450px] backdrop-blur-md rounded-3xl cursor-pointer relative overflow-hidden" onClick={() => {
            setVS_(['https://www.pexels.com/video/853921/download/?fps=25.0&h=720&w=1280', {cover: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg'}])
          }}>
              <img className="object-cover w-full" src={'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg'} alt={'Flamingo Blur'} />
        {/* <div className="min-h-[60px] flex flex-col justify-center items-center w-full bg-black/40 backdrop-blur-md text-white absolute bottom-0 left-0">
          
        </div> */}
      </div>
    </>

      </div>
      
    </div>
  )
}

export function RecentlyAdded({episodes}) {
  const { t } = useTranslation();

  return (
    <div className="">
      <h2 className="text-zinc-400 mb-4">{t("home.recentlyadded")}</h2>
      <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
        {episodes.map((episode, index) => (
          <div key={index} className="border border-zinc-800 rounded-3xl p-3 w-full">
            <Track episode={episode} includeDescription={true} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeaturedCreators() {
  const appState = useContext(appContext);
  const history = useHistory();
  const { t } = useTranslation();
  const { themeColor } = appState.theme;
  const bg = themeColor.replace('rgb', 'rgba').replace(')', ', 0.1)')

  const loading = appState.otherComponentsLoading.creators
  const creators = appState.creators
  
  return (
    <div>
      <h2 className="text-zinc-400 mb-4">{t("home.featuredcreators")}</h2>
      {loading ? (
        <>
          <div className="bg-gray-300/30 animate-pulse w-full h-20 mb-4 mt-4 rounded-full"></div>
          <div className="bg-gray-300/30 animate-pulse w-full h-20 mb-4 rounded-full"></div>
          <div className="bg-gray-300/30 animate-pulse w-full h-20 mb-4 rounded-full"></div>
        </>
      ) : (
        <>
          {creators.map((creator, index) => (
            <div key={index}>
              <div className="flex justify-between items-center p-4 mb-4 w-full border-zinc-800 border rounded-3xl">
                <div className="flex items-center">
                  {creator?.avatar ? (
                    <img className="rounded-full h-12 w-12 object-cover" src={"https://arweave.net/" + creator?.avatar} alt={creator?.nickname} />
                    ) : (
                      <Cooyub svgStyle="rounded-lg h-12 w-12" rectStyle="h-6 w-6" fill={'rgb(255, 80, 0)'} />
                    )
                  }
                  <div className="ml-4 flex items-center">
                    <div className="flex flex-col">
                      <div className="text-zinc-100 text-sm cursor-pointer">{creator?.nickname || creator?.user}</div>
                      {creator?.label && 
                        <div className="text-zinc-400 cursor-pointer text-[8px]">@{creator?.label}</div>
                      }
                    </div>
                  </div>
                </div>
                <div className=" ">
                  <p 
                    className="px-3 py-2 rounded-full text-[10px] ml-5 cursor-pointer"
                    style={{backgroundColor: bg, color: themeColor}}
                    onClick={() => history.push("/creator/" + creator?.user)}
                  >{t("view")}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
